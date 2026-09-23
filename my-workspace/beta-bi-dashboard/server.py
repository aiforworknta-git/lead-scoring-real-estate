#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CÔNG TY CỔ PHẦN BETA SOLUTIONS - EXECUTIVE BI DASHBOARD SERVER
Trưởng phòng Tài chính kiêm Fullstack Developer
Tối ưu hóa: Zero-dependency, Fast Excel XML Parser, Polling 2s, Auto Open Browser
"""

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

# Reconfigure stdout for UTF-8 in Windows Terminal
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WORKSPACE_DIR = os.path.dirname(BASE_DIR)
DEFAULT_EXCEL_PATH = os.path.join(WORKSPACE_DIR, 'sample-data', 'TH_ngan_sach_phong_ban.xlsx')

DEFAULT_PORT = 9092

# Cache to avoid re-parsing unchanged files during 2-second polling
DATA_CACHE = {
    'mtime': 0,
    'data': None,
    'last_read': 0
}

def parse_budget_excel(excel_path):
    """
    Zero-dependency XML parser for Excel (.xlsx).
    Returns raw transaction records and metadata for client-side filtering.
    """
    if not os.path.exists(excel_path):
        return {
            'success': False,
            'error': f'Không tìm thấy file: {excel_path}',
            'mtime': 0,
            'records': []
        }

    current_mtime = os.path.getmtime(excel_path)
    if DATA_CACHE['data'] is not None and DATA_CACHE['mtime'] == current_mtime:
        return DATA_CACHE['data']

    try:
        with zipfile.ZipFile(excel_path) as z:
            strings = []
            if 'xl/sharedStrings.xml' in z.namelist():
                tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
                for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                    t = si.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
                    strings.append(t.text if t is not None and t.text else '')

            sheet_tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
            sheet_data = sheet_tree.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheetData')
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

        if not rows or len(rows) < 2:
            return {
                'success': False,
                'error': 'File Excel không có dữ liệu giao dịch',
                'mtime': current_mtime,
                'records': []
            }

        raw_headers = rows[0]
        col_map = {h.strip(): i for i, h in enumerate(raw_headers)}

        records = []
        quarters_set = set()
        departments_set = set()
        categories_set = set()

        for r in rows[1:]:
            if not r or len(r) < 5:
                continue

            def get_val(col_name, default=''):
                idx = col_map.get(col_name)
                if idx is not None and idx < len(r):
                    return r[idx]
                return default

            txn_id = get_val('Ma_Giao_Dich')
            quy = get_val('Quy')
            phong_ban = get_val('Phong_Ban')
            hang_muc = get_val('Hang_Muc_Chi')
            trang_thai = get_val('Trang_Thai')

            try:
                ngan_sach = float(get_val('Ngan_Sach_Duyet', 0) or 0)
            except (ValueError, TypeError):
                ngan_sach = 0.0

            try:
                chi_tieu = float(get_val('Chi_Tieu_Thuc_Te', 0) or 0)
            except (ValueError, TypeError):
                chi_tieu = 0.0

            try:
                chenh_lech = float(get_val('Chenh_Lech', 0) or (ngan_sach - chi_tieu))
            except (ValueError, TypeError):
                chenh_lech = ngan_sach - chi_tieu

            if quy:
                quarters_set.add(quy)
            if phong_ban:
                departments_set.add(phong_ban)
            if hang_muc:
                categories_set.add(hang_muc)

            records.append({
                'Ma_Giao_Dich': txn_id,
                'Quy': quy,
                'Phong_Ban': phong_ban,
                'Hang_Muc_Chi': hang_muc,
                'Ngan_Sach_Duyet': ngan_sach,
                'Chi_Tieu_Thuc_Te': chi_tieu,
                'Chenh_Lech': chenh_lech,
                'Trang_Thai': trang_thai
            })

        # Sort quarters chronologically
        def sort_quy_key(q):
            # Formats like Q1-2026
            parts = q.split('-')
            quarter_num = parts[0].replace('Q', '').strip()
            year = parts[1].strip() if len(parts) > 1 else '2026'
            return (year, quarter_num)

        sorted_quarters = sorted(list(quarters_set), key=sort_quy_key)
        sorted_departments = sorted(list(departments_set))
        sorted_categories = sorted(list(categories_set))

        result = {
            'success': True,
            'source_file': os.path.basename(excel_path),
            'mtime': current_mtime,
            'timestamp': time.strftime('%H:%M:%S - %d/%m/%Y'),
            'total_records': len(records),
            'quarters': sorted_quarters,
            'departments': sorted_departments,
            'categories': sorted_categories,
            'records': records  # RAW data as requested: API returns raw, frontend filters
        }

        DATA_CACHE['mtime'] = current_mtime
        DATA_CACHE['data'] = result
        DATA_CACHE['last_read'] = time.time()
        return result

    except Exception as e:
        return {
            'success': False,
            'error': f'Lỗi khi xử lý file Excel: {str(e)}',
            'mtime': current_mtime if 'current_mtime' in locals() else 0,
            'records': []
        }


class BetaDashboardHandler(BaseHTTPRequestHandler):
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
                self.send_error(404, 'File index.html không tồn tại')

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
            data = parse_budget_excel(DEFAULT_EXCEL_PATH)
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


def find_available_port(start_port=DEFAULT_PORT, max_tries=10):
    for p in range(start_port, start_port + max_tries):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('127.0.0.1', p))
                return p
            except OSError:
                continue
    return start_port


def open_browser_delayed(url, delay=1.0):
    time.sleep(delay)
    print(f"[Beta Solutions] Đang mở trình duyệt tại: {url}")
    try:
        chrome_paths = [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe")
        ]
        opened = False
        for cp in chrome_paths:
            if os.path.exists(cp):
                os.system(f'start "" "{cp}" "{url}"')
                opened = True
                break
        if not opened:
            webbrowser.open(url)
    except Exception as e:
        print(f"[Warning] Không thể mở trình duyệt tự động: {e}")
        webbrowser.open(url)


def run_server(port=None):
    if port is None:
        port = find_available_port(DEFAULT_PORT)

    server_address = ('::', port)
    try:
        httpd = DualStackServer(server_address, BetaDashboardHandler)
    except Exception:
        httpd = HTTPServer(('0.0.0.0', port), BetaDashboardHandler)

    url = f"http://localhost:{port}"
    print("=" * 70)
    print("  CÔNG TY CỔ PHẦN BETA SOLUTIONS - EXECUTIVE BI DASHBOARD")
    print("  Chức danh: Trưởng phòng Tài chính kiêm Fullstack Developer")
    print(f"  Server URL: {url}")
    print(f"  Nguồn dữ liệu Excel: {DEFAULT_EXCEL_PATH}")
    print("  Brand Colors: Ngân Sách #7C3AED | Chi Tiêu #06B6D4 | Vượt NS #F43F5E | Tiết Kiệm #14B8A6")
    print("  Cơ chế đồng bộ: Realtime Polling 2 giây tự động phát hiện thay đổi")
    print("  Frontend Engine: API Raw Data -> In-memory Reactive Filtering")
    print("=" * 70)

    # Launch browser in a background thread
    t = threading.Thread(target=open_browser_delayed, args=(url, 1.0), daemon=True)
    t.start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Beta Solutions] Đang tắt máy chủ...")
        httpd.server_close()


if __name__ == '__main__':
    run_server()
