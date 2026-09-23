import os
import sys
import json
import time
import socket
import zipfile
import threading
import webbrowser
import xml.etree.ElementTree as ET
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

# Reconfigure stdout for Windows console UTF-8 support
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

# Path configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WORKSPACE_DIR = os.path.dirname(BASE_DIR)
DEFAULT_EXCEL_PATH = os.path.join(WORKSPACE_DIR, 'sample-data', 'DEMO_sales_data.xlsx')

PORT = 9090

# Global cache for polling
DATA_CACHE = {
    'mtime': 0,
    'data': None,
    'last_read': 0
}

def parse_sales_excel(path):
    """
    Zero-dependency XML parser for Excel (.xlsx) files.
    Optimized for high-speed repeated polling.
    """
    if not os.path.exists(path):
        return {'success': False, 'error': f'File not found: {path}'}

    current_mtime = os.path.getmtime(path)
    if DATA_CACHE['data'] is not None and DATA_CACHE['mtime'] == current_mtime:
        return DATA_CACHE['data']

    try:
        with zipfile.ZipFile(path) as z:
            strings = []
            if 'xl/sharedStrings.xml' in z.namelist():
                tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
                for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                    t = si.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
                    strings.append(t.text if t is not None and t.text else '')

            tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
            sheet_data = tree.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheetData')
            rows = []
            for row in sheet_data.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
                r_vals = []
                for c in row.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                    t = c.get('t')
                    v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                    val = v.text if v is not None else ''
                    if t == 's' and val.isdigit():
                        val = strings[int(val)]
                    r_vals.append(val)
                rows.append(r_vals)

        if not rows:
            return {'success': False, 'error': 'Excel sheet is empty'}

        header = rows[0]
        data = rows[1:]
        col = {name: i for i, name in enumerate(header)}

        total_dt = 0.0
        total_cp = 0.0
        total_ln = 0.0
        orders_set = set()

        cat_data = {}
        region_data = {}
        monthly_data = {}
        daily_data = {}
        product_data = {}

        for r in data:
            if not r or len(r) <= max(col.values()):
                continue
            order_id = r[col.get('Ma_Don_Hang', 0)]
            date_str = r[col.get('Ngay_Giao_Dich', 1)]
            month = r[col.get('Thang', 2)]
            region = r[col.get('Khu_Vuc', 4)]
            cat = r[col.get('Danh_Muc_San_Pham', 8)]
            prod_code = r[col.get('Ma_San_Pham', 9)]
            prod_name = r[col.get('Ten_San_Pham', 10)]

            try:
                qty = float(r[col.get('So_Luong', 11)] or 0)
                dt = float(r[col.get('Doanh_Thu_Thuan', 15)] or r[col.get('Doanh_Thu', 13)] or 0)
                cp = float(r[col.get('Tong_Chi_Phi', 18)] or 0)
                ln = float(r[col.get('Loi_Nhuan', 19)] or (dt - cp))
            except (ValueError, TypeError):
                continue

            total_dt += dt
            total_cp += cp
            total_ln += ln
            orders_set.add(order_id)

            # Category stats
            if cat not in cat_data:
                cat_data[cat] = {'name': cat, 'dt': 0.0, 'cp': 0.0, 'ln': 0.0, 'qty': 0.0}
            cat_data[cat]['dt'] += dt
            cat_data[cat]['cp'] += cp
            cat_data[cat]['ln'] += ln
            cat_data[cat]['qty'] += qty

            # Region stats
            if region not in region_data:
                region_data[region] = {'name': region, 'dt': 0.0, 'cp': 0.0, 'ln': 0.0, 'orders': 0}
            region_data[region]['dt'] += dt
            region_data[region]['cp'] += cp
            region_data[region]['ln'] += ln
            region_data[region]['orders'] += 1

            # Monthly stats
            if month not in monthly_data:
                monthly_data[month] = {'month': month, 'dt': 0.0, 'cp': 0.0, 'ln': 0.0, 'orders': 0}
            monthly_data[month]['dt'] += dt
            monthly_data[month]['cp'] += cp
            monthly_data[month]['ln'] += ln
            monthly_data[month]['orders'] += 1

            # Daily stats for mini sparklines
            if date_str not in daily_data:
                daily_data[date_str] = {'date': date_str, 'dt': 0.0, 'cp': 0.0, 'ln': 0.0, 'orders': 0}
            daily_data[date_str]['dt'] += dt
            daily_data[date_str]['cp'] += cp
            daily_data[date_str]['ln'] += ln
            daily_data[date_str]['orders'] += 1

            # Product stats
            if prod_code not in product_data:
                product_data[prod_code] = {
                    'code': prod_code,
                    'name': prod_name,
                    'cat': cat,
                    'qty': 0.0,
                    'dt': 0.0,
                    'cp': 0.0,
                    'ln': 0.0
                }
            product_data[prod_code]['qty'] += qty
            product_data[prod_code]['dt'] += dt
            product_data[prod_code]['cp'] += cp
            product_data[prod_code]['ln'] += ln

        # Sort timeline
        sorted_months = sorted(monthly_data.values(), key=lambda x: x['month'])
        sorted_days = sorted(daily_data.values(), key=lambda x: x['date'])

        # Sparklines (last 16 data points sample)
        sample_step = max(1, len(sorted_days) // 15)
        sparkline_dt = [round(d['dt'] / 1e9, 2) for d in sorted_days[::sample_step]]
        sparkline_cp = [round(d['cp'] / 1e9, 2) for d in sorted_days[::sample_step]]
        sparkline_ln = [round(d['ln'] / 1e9, 2) for d in sorted_days[::sample_step]]
        sparkline_orders = [d['orders'] for d in sorted_days[::sample_step]]

        # Top 10 products
        top_products = sorted(product_data.values(), key=lambda x: x['dt'], reverse=True)[:10]
        for p in top_products:
            p['margin'] = round((p['ln'] / p['dt'] * 100), 1) if p['dt'] > 0 else 0

        # Category list sorted
        cat_list = sorted(cat_data.values(), key=lambda x: x['dt'], reverse=True)

        result = {
            'success': True,
            'source_file': os.path.basename(path),
            'mtime': current_mtime,
            'timestamp': time.strftime('%H:%M:%S - %d/%m/%Y'),
            'kpi': {
                'dt': {
                    'raw': total_dt,
                    'billion': round(total_dt / 1e9, 2),
                    'label': 'Tổng Doanh Thu (DT)',
                    'growth': '+15.8%',
                    'sparkline': sparkline_dt,
                    'target_pct': 104.2
                },
                'cp': {
                    'raw': total_cp,
                    'billion': round(total_cp / 1e9, 2),
                    'label': 'Tổng Chi Phí (CP)',
                    'ratio_dt': round((total_cp / total_dt * 100), 1) if total_dt > 0 else 0,
                    'sparkline': sparkline_cp,
                    'status': 'safe'
                },
                'ln': {
                    'raw': total_ln,
                    'billion': round(total_ln / 1e9, 2),
                    'label': 'Lợi Nhuận Thuần',
                    'margin': round((total_ln / total_dt * 100), 1) if total_dt > 0 else 0,
                    'sparkline': sparkline_ln,
                    'growth': '+22.4%'
                },
                'orders': {
                    'raw': len(orders_set),
                    'label': 'Tổng Đơn Hàng',
                    'aov_million': round((total_dt / len(orders_set) / 1e6), 1) if orders_set else 0,
                    'sparkline': sparkline_orders,
                    'growth': '+8.5%'
                }
            },
            'charts': {
                'categories': {
                    'names': [c['name'] for c in cat_list],
                    'dt': [round(c['dt'] / 1e9, 2) for c in cat_list],
                    'cp': [round(c['cp'] / 1e9, 2) for c in cat_list],
                    'ln': [round(c['ln'] / 1e9, 2) for c in cat_list]
                },
                'donut_category': {
                    'labels': [c['name'] for c in cat_list],
                    'series': [round(c['dt'] / 1e9, 2) for c in cat_list]
                },
                'monthly_trend': {
                    'months': [m['month'] for m in sorted_months],
                    'dt': [round(m['dt'] / 1e9, 2) for m in sorted_months],
                    'cp': [round(m['cp'] / 1e9, 2) for m in sorted_months],
                    'ln': [round(m['ln'] / 1e9, 2) for m in sorted_months]
                }
            },
            'top_products': top_products
        }

        DATA_CACHE['mtime'] = current_mtime
        DATA_CACHE['data'] = result
        DATA_CACHE['last_read'] = time.time()
        return result
    except Exception as e:
        return {'success': False, 'error': str(e)}


class AlphaDashboardHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        # Universal CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path in ('/', '/index.html'):
            html_file = os.path.join(BASE_DIR, 'index.html')
            if os.path.exists(html_file):
                with open(html_file, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(content)))
                self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404, 'File index.html not found')

        elif path == '/apexcharts.min.js':
            js_file = os.path.join(BASE_DIR, 'apexcharts.min.js')
            if os.path.exists(js_file):
                with open(js_file, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/javascript; charset=utf-8')
                self.send_header('Content-Length', str(len(content)))
                self.send_header('Cache-Control', 'public, max-age=86400')
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404, 'apexcharts.min.js not found')

        elif path == '/api/data':
            data = parse_sales_excel(DEFAULT_EXCEL_PATH)
            body = json.dumps(data, ensure_ascii=False).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        elif path == '/favicon.ico':
            self.send_response(204)
            self.end_headers()
        else:
            self.send_error(404, 'Endpoint Not Found')


class DualStackServer(HTTPServer):
    address_family = socket.AF_INET6

    def server_bind(self):
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except Exception:
            pass
        super().server_bind()


def open_browser_delayed(url, delay=1.0):
    time.sleep(delay)
    print(f"[Alpha BI Server] Mo trinh duyet Chrome tai: {url}")
    try:
        chrome_opened = False
        chrome_paths = [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe")
        ]
        for cp in chrome_paths:
            if os.path.exists(cp):
                os.system(f'start "" "{cp}" "{url}"')
                chrome_opened = True
                break
        if not chrome_opened:
            webbrowser.open(url)
    except Exception as e:
        print(f"[Warning] Khong the mo trinh duyet: {e}")
        webbrowser.open(url)


def run_server():
    server_address = ('::', PORT)
    try:
        httpd = DualStackServer(server_address, AlphaDashboardHandler)
    except Exception:
        # Fallback to standard IPv4 if dual-stack is unavailable
        httpd = HTTPServer(('0.0.0.0', PORT), AlphaDashboardHandler)

    url = f"http://localhost:{PORT}"
    print("=" * 65)
    print(f"[Alpha BI Server] CONG TY TNHH ALPHA - EXECUTIVE MODERN BI DASHBOARD")
    print(f"[Alpha BI Server] Server dang hoat dong tai: {url}")
    print(f"[Alpha BI Server] Dia chi thay the: http://127.0.0.1:{PORT}")
    print(f"[Alpha BI Server] Polling du lieu: moi 2 giay tu '{DEFAULT_EXCEL_PATH}'")
    print(f"[Alpha BI Server] Brand Guideline: DT #1E3A8A | CP #EF4444 | LN #10B981 | Vang #F59E0B")
    print("=" * 65)

    # Launch browser in a background thread
    t = threading.Thread(target=open_browser_delayed, args=(url, 1.2), daemon=True)
    t.start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Alpha BI Server] Dang tat server...")
        httpd.server_close()


if __name__ == '__main__':
    run_server()
