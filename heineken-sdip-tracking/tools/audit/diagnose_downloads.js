const fs = require('fs');
const path = require('path');

const downloadDir = 'C:\\Users\\HP\\Downloads';

console.log('====================================================');
console.log('CHẨN ĐOÁN THƯ MỤC DOWNLOADS: ' + downloadDir);
console.log('====================================================');

if (!fs.existsSync(downloadDir)) {
    console.log('LỖI: Thư mục không tồn tại!');
    process.exit(1);
}

const startTime = Date.now();
let entries = [];
try {
    entries = fs.readdirSync(downloadDir, { withFileTypes: true });
} catch (e) {
    console.error('Lỗi khi đọc thư mục:', e.message);
    process.exit(1);
}
const scanTime = Date.now() - startTime;

console.log(`Thời gian đọc danh sách thư mục: ${scanTime} ms`);
console.log(`Tổng số mục trực tiếp: ${entries.length}`);

let fileCount = 0;
let dirCount = 0;
let totalSizeBytes = 0;
let filesList = [];
let extMap = {};
let incompleteFiles = [];

for (const entry of entries) {
    if (entry.isDirectory()) {
        dirCount++;
    } else {
        fileCount++;
        const fullPath = path.join(downloadDir, entry.name);
        try {
            const stats = fs.statSync(fullPath);
            const size = stats.size;
            totalSizeBytes += size;
            const ext = path.extname(entry.name).toLowerCase() || '[Không có đuôi]';

            extMap[ext] = (extMap[ext] || 0) + 1;

            const fileObj = {
                name: entry.name,
                sizeMB: (size / (1024 * 1024)).toFixed(2),
                sizeBytes: size,
                mtime: stats.mtime.toISOString(),
                ext: ext
            };

            filesList.push(fileObj);

            if (['.crdownload', '.part', '.tmp', '.downloading', '.opdownload'].includes(ext)) {
                incompleteFiles.push(fileObj);
            }
        } catch (err) {
            console.log(`[CẢNH BÁO] Không đọc được file: ${entry.name} - ${err.message}`);
        }
    }
}

console.log(`- Số lượng file: ${fileCount}`);
console.log(`- Số lượng thư mục con: ${dirCount}`);
console.log(`- Tổng dung lượng file: ${(totalSizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB (${(totalSizeBytes / (1024 * 1024)).toFixed(0)} MB)`);

// Incomplete files
console.log('\n--- 1. FILE TẠM HOẶC ĐANG TẢI DỞ (NGUY CƠ KHÓA TIẾN TRÌNH) ---');
console.log(`Số lượng: ${incompleteFiles.length}`);
if (incompleteFiles.length > 0) {
    incompleteFiles.forEach(f => {
        console.log(`  - ${f.name} (${f.sizeMB} MB, cập nhật lần cuối: ${f.mtime})`);
    });
} else {
    console.log('  -> Không có file dở dang .crdownload/.part');
}

// Top 15 largest files
console.log('\n--- 2. TOP 15 FILE DUNG LƯỢNG LỚN NHẤT ---');
filesList.sort((a, b) => b.sizeBytes - a.sizeBytes);
filesList.slice(0, 15).forEach((f, idx) => {
    console.log(`  ${idx + 1}. [${f.sizeMB} MB] ${f.name} (${f.mtime.slice(0, 10)})`);
});

// Extension distribution
console.log('\n--- 3. PHÂN BỔ ĐỊNH DẠNG FILE ---');
const sortedExt = Object.entries(extMap).sort((a, b) => b[1] - a[1]);
sortedExt.slice(0, 15).forEach(([ext, count]) => {
    console.log(`  - ${ext}: ${count} file`);
});

// Check desktop.ini
console.log('\n--- 4. KIỂM TRA TẬP TIN DESKTOP.INI ---');
const desktopIniPath = path.join(downloadDir, 'desktop.ini');
if (fs.existsSync(desktopIniPath)) {
    try {
        const content = fs.readFileSync(desktopIniPath, 'utf8');
        console.log('Nội dung desktop.ini:\n' + content);
    } catch (e) {
        console.log('Không đọc được desktop.ini:', e.message);
    }
} else {
    console.log('Không tìm thấy desktop.ini tùy chỉnh.');
}

// Check if any file name has strange chars or corrupted links
console.log('\n--- 5. KIỂM TRA FILE .LNK (SHORTCUTS CÓ THỂ TRỎ ĐẾN MẠNG CHẾT) ---');
const lnkFiles = filesList.filter(f => f.ext === '.lnk');
console.log(`Số lượng file .lnk: ${lnkFiles.length}`);
lnkFiles.forEach(f => console.log(`  - ${f.name}`));

console.log('\n====================================================');
console.log('HOÀN TẤT QUÉT BƯỚC 1.');
console.log('====================================================');
