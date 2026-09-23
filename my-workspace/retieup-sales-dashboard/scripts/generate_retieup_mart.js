const fs = require('fs');
const path = require('path');

console.log('=====================================================');
console.log('  GENERATING RETIE-UP & COMMERCIAL SALES DATA MART   ');
console.log('=====================================================');

const rawPath = path.resolve('d:/NTAN/AI For work/Agentic/heineken-sdip-tracking/dist/sdip_data_202609.json');
const outputPath = path.resolve('d:/NTAN/AI For work/Agentic/my-workspace/retieup-sales-dashboard/data/retieup_mart.json');

// Read raw data and strip UTF-8 BOM if present
let rawText = fs.readFileSync(rawPath, 'utf8');
if (rawText.charCodeAt(0) === 0xFEFF) {
  rawText = rawText.slice(1);
}
const rawData = JSON.parse(rawText);

console.log(`Loaded raw data: ${rawData.subd_list.length} SubDs, Target SI: ${rawData.kpis.total_target}`);

// Channel list for realistic on-premise classification
const CHANNELS = [
  'Nhà Hàng Ẩm Thực',
  'Quán Ăn Gia Đình',
  'Quán Nhậu / Quán Ốc',
  'Beer Club / Lounge',
  'Karaoke / Giải Trí'
];

// Seeded pseudo-random generator for consistent deterministic enrichment
function pseudoRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const allOutlets = [];
let outletCounter = 0;

const enrichedSubDs = rawData.subd_list.map((subd, sIdx) => {
  const inactives = subd.inactive_outlets || [];
  
  // Enrich inactive outlets
  const enrichedInactives = inactives.map((ol, oIdx) => {
    outletCounter++;
    const seed = parseInt(ol.outlet_code || `${sIdx * 1000 + oIdx}`, 10) || (sIdx * 100 + oIdx);
    const rnd1 = pseudoRandom(seed);
    const rnd2 = pseudoRandom(seed + 11);
    const rnd3 = pseudoRandom(seed + 27);
    
    const channel = CHANNELS[Math.floor(rnd1 * CHANNELS.length)];
    
    // Past contract commitments
    // Quán inactive: orders = 0, actual_vol = 0 trong tháng này
    // Cam kết chu kỳ cũ: 30 - 150 thùng/tháng
    const contractTarget = Math.round(20 + rnd2 * 80);
    const actualVol = ol.qty || 0;
    const achievePct = contractTarget > 0 ? Math.round((actualVol / contractTarget) * 100) : 0;
    
    // Old sponsorship grant (VND) - based on contract target (e.g. 15,000 - 25,000 VND / thùng cam kết)
    const oldGrantVnd = contractTarget * Math.round(15000 + rnd3 * 10000);
    const costPerCase = actualVol > 0 ? Math.round(oldGrantVnd / actualVol) : oldGrantVnd; // Lãng phí cao khi vol = 0
    
    // Tier classification
    let tier = 'BRONZE';
    if (contractTarget >= 80) tier = 'SILVER';
    if (contractTarget >= 120) tier = 'GOLD';
    
    // AI Recommendation for Retie-up
    let recAction = 'DOWNSCALE_EXIT';
    let recTitle = 'Cắt Giảm Tài Trợ Cố Định / Chuyển Sang Chiết Khấu Thùng';
    let suggestedGrantVnd = 0;
    let suggestedTarget = Math.round(contractTarget * 0.6);
    let rationale = `Quán chưa phát sinh đơn trong tháng (0/${contractTarget} thùng). Gói tài trợ cũ (${(oldGrantVnd / 1e6).toFixed(1)} triệu) đang bị ứ đọng vốn. Đề xuất cắt gói tài trợ cố định, chuyển sang cơ chế thưởng ${Math.round(12000 + rnd1 * 3000).toLocaleString()}đ/thùng khi đạt sản lượng tối thiểu.`;
    let pitchScript = `Dạ anh/chị ơi, em từ đội ngũ đại diện Heineken/Tiger phụ trách tuyến của mình. Em thấy tháng qua bên quán mình chưa lên đơn bia. Để hỗ trợ quán kinh doanh tốt hơn chu kỳ tới, bên em có gói chương trình mới: không áp lực tiền cọc mà hỗ trợ trực tiếp chiết khấu ${Math.round(12000 + rnd1 * 3000).toLocaleString()}đ/thùng khi quán ra hàng, kèm tặng 2 dù bạt che nắng và áo PG. Em xin phép gửi anh/chị bản đề xuất OSR để quán mình xem qua nhé!`;

    const outletObj = {
      code: ol.outlet_code,
      name: ol.outlet_name,
      subd: subd.subd_id,
      subd_name: subd.subd_name,
      area: subd.area_name,
      city: ol.city || 'Đồng Bằng SCL',
      chn: channel,
      status: 'INACTIVE',
      ord: 0,
      vol: actualVol,
      tgt: contractTarget,
      pct: achievePct,
      grant: oldGrantVnd,
      cpc: costPerCase,
      tier: tier,
      rec: recAction,
      s_grant: suggestedGrantVnd,
      s_tgt: suggestedTarget
    };

    allOutlets.push(outletObj);
    return { code: ol.outlet_code, name: ol.outlet_name, vol: actualVol, tgt: contractTarget };
  });

  // Also simulate 5-8 Active outlets per SubD for comparison & demonstration in OSR generator
  const activeCount = Math.min(8, Math.max(3, Math.round(subd.aso_active / 10) || 5));
  for (let a = 1; a <= activeCount; a++) {
    outletCounter++;
    const aSeed = sIdx * 500 + a * 37;
    const aRnd1 = pseudoRandom(aSeed);
    const aRnd2 = pseudoRandom(aSeed + 13);
    const aRnd3 = pseudoRandom(aSeed + 41);

    const aCode = `668${String(sIdx).padStart(2, '0')}${String(a).padStart(3, '0')}`;
    const namesList = [
      'ẨM THỰC ĐỒNG QUÊ', 'QUÁN ĂN 79', 'HẢI SẢN PHỐ ĐÊM', 'BEER GARDEN 365',
      'NHÀ HÀNG HƯƠNG XƯA', 'LẨU NƯỚNG TIGER CLUB', 'QUÁN ỐC ĐÊM BỜ KÈ', 'DÊ TƯƠI NINH BÌNH'
    ];
    const aName = `${namesList[(sIdx + a) % namesList.length]} ${a}`;
    const channel = CHANNELS[(sIdx + a) % CHANNELS.length];
    
    const contractTarget = Math.round(40 + aRnd1 * 110); // 40 - 150 thùng
    const perfRatio = 0.7 + aRnd2 * 0.7; // 70% to 140%
    const actualVol = Math.round(contractTarget * perfRatio);
    const achievePct = Math.round((actualVol / contractTarget) * 100);
    const oldGrantVnd = contractTarget * Math.round(18000 + aRnd3 * 8000);
    const costPerCase = Math.round(oldGrantVnd / Math.max(1, actualVol));

    let tier = 'BRONZE';
    if (actualVol >= 120) tier = 'DIAMOND';
    else if (actualVol >= 70) tier = 'GOLD';
    else if (actualVol >= 30) tier = 'SILVER';

    let recAction = 'MAINTAIN_CONDITIONAL';
    let suggestedGrantVnd = oldGrantVnd;
    let suggestedTarget = contractTarget;

    if (achievePct >= 115) {
      recAction = 'SCALE_UP';
      suggestedGrantVnd = Math.round(oldGrantVnd * 1.25);
      suggestedTarget = Math.round(contractTarget * 1.2);
    } else if (achievePct < 75) {
      recAction = 'DOWNSCALE_EXIT';
      suggestedGrantVnd = Math.round(oldGrantVnd * 0.7);
      suggestedTarget = Math.round(contractTarget * 0.8);
    }

    const aOutletObj = {
      code: aCode,
      name: aName,
      subd: subd.subd_id,
      subd_name: subd.subd_name,
      area: subd.area_name,
      city: subd.area_name === 'South 2' ? 'Tiền Giang' : 'Cần Thơ',
      chn: channel,
      status: 'ACTIVE',
      ord: Math.max(1, Math.round(actualVol / 15)),
      vol: actualVol,
      tgt: contractTarget,
      pct: achievePct,
      grant: oldGrantVnd,
      cpc: costPerCase,
      tier: tier,
      rec: recAction,
      s_grant: suggestedGrantVnd,
      s_tgt: suggestedTarget
    };

    allOutlets.push(aOutletObj);
  }

  // Keep subd lean by omitting heavy inactive outlets duplicate list
  const { inactive_outlets, ...leanSubd } = subd;
  return {
    ...leanSubd,
    inactive_sample: enrichedInactives.slice(0, 5) // keep small sample
  };
});

// Calculate global analytics & investment summary
const totalOutlets = allOutlets.length;
const scaleUpCount = allOutlets.filter(o => o.rec === 'SCALE_UP').length;
const maintainCount = allOutlets.filter(o => o.rec === 'MAINTAIN_CONDITIONAL').length;
const downscaleCount = allOutlets.filter(o => o.rec === 'DOWNSCALE_EXIT').length;

const totalOldGrantVnd = allOutlets.reduce((acc, o) => acc + o.grant, 0);
const totalSuggestedGrantVnd = allOutlets.reduce((acc, o) => acc + o.s_grant, 0);
const totalBudgetSavingVnd = totalOldGrantVnd - totalSuggestedGrantVnd;

const finalMart = {
  metadata: {
    ...rawData.metadata,
    project_title: 'Heineken Commercial Retie-up & Sales Control Dashboard',
    version: '1.0.0',
    generated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    total_outlets_managed: totalOutlets,
    inactive_outlets_count: rawData.kpis.total_inactive_outlets
  },
  kpis: {
    ...rawData.kpis,
    investment_summary: {
      total_old_grant_vnd: totalOldGrantVnd,
      total_suggested_grant_vnd: totalSuggestedGrantVnd,
      total_budget_saving_vnd: totalBudgetSavingVnd,
      saving_pct: Math.round((totalBudgetSavingVnd / totalOldGrantVnd) * 100 * 10) / 10,
      scale_up_outlets: scaleUpCount,
      maintain_outlets: maintainCount,
      downscale_outlets: downscaleCount
    }
  },
  subd_list: enrichedSubDs,
  outlets: allOutlets
};

fs.writeFileSync(outputPath, JSON.stringify(finalMart), 'utf8');
const stats = fs.statSync(outputPath);
console.log(`Successfully generated Commercial Retie-up Data Mart!`);
console.log(`Path: ${outputPath}`);
console.log(`File Size: ${(stats.size / 1024).toFixed(1)} KB (Goal: < 1.5MB - Result: ${(stats.size / (1024*1024)).toFixed(2)} MB)`);
console.log(`Total Outlets Catalog: ${allOutlets.length} (Scale Up: ${scaleUpCount}, Maintain: ${maintainCount}, Downscale/Exit: ${downscaleCount})`);
