const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', '..', 'dist', 'sdip_data_202609.json');
const nppMapPath = path.join(__dirname, '..', '..', 'dist', 'subd_npp_map.json');

function readJson(p) {
    let raw = fs.readFileSync(p, 'utf8');
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
    return JSON.parse(raw);
}

const data = readJson(dataPath);
const nppMap = readJson(nppMapPath);

console.log(`Loaded ${data.subd_list.length} SubDs from JSON.`);

const s2Count = 0;
data.subd_list.forEach(s => {
    // 1. Assign NPP ShortCode
    s.npp_code = nppMap[s.subd_id] || 'N/A';

    // 2. Assign SS Name: South 2 is Nguyễn Thành Ân, South 9 keeps current
    if (s.area_name === 'South 2') {
        s.ss_name = 'Nguyễn Thành Ân';
    }
});

// Update supervisor filter list
const ssSet = new Set();
data.subd_list.forEach(s => {
    if (s.ss_name) ssSet.add(s.ss_name);
});
data.dimension_filters.supervisors = Array.from(ssSet).sort();

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated sdip_data_202609.json with NPP ShortCode and South 2 SS = Nguyễn Thành Ân!');
console.log('Supervisors list:', data.dimension_filters.supervisors);
