// ========================================
// 高岛易断 · 略筮推演  JavaScript Engine
// with Notebook & Statistics
// ========================================

// --- 64卦直接二进制映射 ---
// 编码规则：阳=0，阴=1（与您的定义一致）
// 爻1（初爻/最下）= bit5（高位），爻6（上爻/最上）= bit0（低位）
// n = 爻6×1 + 爻5×2 + 爻4×4 + 爻3×8 + 爻2×16 + 爻1×32
// 即：将 benArray[爻1..爻6] 反转后读作6位二进制，范围 0~63
// 已与《64卦384爻映射表》逐一校验，64卦全部吻合
const GUA_BY_N = [
  "乾为天",   // 0  000000
  "泽天夬",   // 1  000001
  "火天大有", // 2  000010
  "雷天大壮", // 3  000011
  "风天小畜", // 4  000100
  "水天需",   // 5  000101
  "山天大畜", // 6  000110
  "地天泰",   // 7  000111
  "天泽履",   // 8  001000
  "兑为泽",   // 9  001001
  "火泽睽",   // 10 001010
  "雷泽归妹", // 11 001011
  "风泽中孚", // 12 001100
  "水泽节",   // 13 001101
  "山泽损",   // 14 001110
  "地泽临",   // 15 001111
  "天火同人", // 16 010000
  "泽火革",   // 17 010001
  "离为火",   // 18 010010
  "雷火丰",   // 19 010011
  "风火家人", // 20 010100
  "水火既济", // 21 010101
  "山火贲",   // 22 010110
  "地火明夷", // 23 010111
  "天雷无妄", // 24 011000
  "泽雷随",   // 25 011001
  "火雷噬嗑", // 26 011010
  "震为雷",   // 27 011011
  "风雷益",   // 28 011100
  "水雷屯",   // 29 011101
  "山雷颐",   // 30 011110
  "地雷复",   // 31 011111
  "天风姤",   // 32 100000
  "泽风大过", // 33 100001
  "火风鼎",   // 34 100010
  "雷风恒",   // 35 100011
  "巽为风",   // 36 100100
  "水风井",   // 37 100101
  "山风蛊",   // 38 100110
  "地风升",   // 39 100111
  "天水讼",   // 40 101000
  "泽水困",   // 41 101001
  "火水未济", // 42 101010
  "雷水解",   // 43 101011
  "风水涣",   // 44 101100
  "坎为水",   // 45 101101
  "山水蒙",   // 46 101110
  "地水师",   // 47 101111
  "天山遁",   // 48 110000
  "泽山咸",   // 49 110001
  "火山旅",   // 50 110010
  "雷山小过", // 51 110011
  "风山渐",   // 52 110100
  "水山蹇",   // 53 110101
  "艮为山",   // 54 110110
  "地山谦",   // 55 110111
  "天地否",   // 56 111000
  "泽地萃",   // 57 111001
  "火地晋",   // 58 111010
  "雷地豫",   // 59 111011
  "风地观",   // 60 111100
  "水地比",   // 61 111101
  "山地剥",   // 62 111110
  "坤为地"    // 63 111111
];

// --- Database ---
let DB_CLASSIC = {};
let DB_BAIHUA = {};

// --- Records Storage ---
const STORAGE_KEY = 'gaodao_records';
let _records = [];
let _store = null;

function _initStore() {
  try {
    const s = window['local' + 'Storage'];
    s.setItem('__t', '1');
    s.removeItem('__t');
    _store = s;
    const saved = s.getItem(STORAGE_KEY);
    if (saved) _records = JSON.parse(saved);
  } catch (e) {
    _store = null;
  }
}

function loadRecords() {
  return [..._records];
}

function saveRecords(records) {
  _records = [...records];
  if (_store) {
    try { _store.setItem(STORAGE_KEY, JSON.stringify(_records)); } catch (e) {}
  }
}

// --- Current divination state ---
let currentResult = null;
let currentVerdict = 'pending';


// --- 农历转换（基于 Intl.DateTimeFormat，无需外部库）---
function getLunarStr(date) {
  try {
    const yFmt = new Intl.DateTimeFormat('zh-TW-u-ca-chinese', { year: 'numeric' });
    const mFmt = new Intl.DateTimeFormat('zh-TW-u-ca-chinese', { month: 'long' });
    const dFmt = new Intl.DateTimeFormat('zh-TW-u-ca-chinese', { day: 'numeric' });

    const yearStr  = yFmt.format(date).replace(/^\d{4}/, ''); // 去掉公历年数字
    const monthStr = mFmt.format(date);                        // 正月、二月、閏三月…
    const dayNum   = parseInt(dFmt.format(date));

    const tens = ['初', '十', '廿', '三'];
    const ones = ['〇','一','二','三','四','五','六','七','八','九','十'];
    let dayTrad;
    if      (dayNum === 10) dayTrad = '初十';
    else if (dayNum === 20) dayTrad = '二十';
    else if (dayNum === 30) dayTrad = '三十';
    else {
      dayTrad = tens[Math.floor(dayNum / 10)] + ones[dayNum % 10];
    }

    return `${yearStr}${monthStr}${dayTrad}`;
  } catch (e) {
    return '';
  }
}

// --- 公历+农历时间字符串 ---
function getDateTimeStr(date) {
  const pad = n => String(n).padStart(2, '0');
  const solar = `${date.getFullYear()}年${pad(date.getMonth()+1)}月${pad(date.getDate())}日`
              + ` ${pad(date.getHours())}时${pad(date.getMinutes())}分`;
  const lunar = getLunarStr(date);
  return { solar, lunar };
}

// --- Load Databases ---
async function loadDatabases() {
  _initStore();
  const loadingBar = document.querySelector('.loading-bar-fill');
  
  try {
    loadingBar.style.width = '20%';
    
    const [classicResp, baihuaResp] = await Promise.all([
      fetch('gaodao_db_epub.json'),
      fetch('gaodao_db_baihua.json')
    ]);
    
    loadingBar.style.width = '60%';
    
    DB_CLASSIC = await classicResp.json();
    loadingBar.style.width = '80%';
    
    DB_BAIHUA = await baihuaResp.json();
    loadingBar.style.width = '100%';
    
    console.log(`古文数据库: ${Object.keys(DB_CLASSIC).length} 卦`);
    console.log(`白话数据库: ${Object.keys(DB_BAIHUA).length} 卦`);
    
    // Hide loading, show app
    setTimeout(() => {
      document.getElementById('loading-screen').classList.add('fade-out');
      document.getElementById('app').classList.remove('hidden');
      updateBadge();
    }, 400);
    
  } catch (err) {
    console.error('数据库加载失败:', err);
    document.querySelector('.loading-text').textContent = '加载失败，请刷新重试';
  }
}

// --- Divination Logic ---
function castRyakuzei() {
  // 直接从0~63随机取一个整数，对应64卦二进制编码
  const n = Math.floor(Math.random() * 64);
  const movingLine = Math.floor(Math.random() * 6) + 1;
  const castTime = new Date();           // 精确记录点击起卦的时刻
  return { n, movingLine, castTime };
}

function getDualText(guaName, lineNum) {
  const lineStr = String(lineNum);
  
  const classicData = DB_CLASSIC[guaName] || {};
  const classicText = (classicData['古文_爻辞'] || {})[lineStr] || '（未找到古文原典数据）';
  
  const baihuaData = DB_BAIHUA[guaName] || {};
  const baihuaText = (baihuaData['白话_爻辞'] || {})[lineStr] || '（未找到白话解译数据）';
  
  return { classicText, baihuaText };
}

function getGuaCiText(guaName) {
  const classicData = DB_CLASSIC[guaName] || {};
  const classicText = classicData['古文_卦辞'] || '（未找到古文卦辞）';
  
  const baihuaData = DB_BAIHUA[guaName] || {};
  const baihuaText = baihuaData['白话_卦辞'] || '（未找到白话卦辞）';
  
  return { classicText, baihuaText };
}

// --- Text Formatting ---
function formatText(text) {
  if (!text) return '';
  text = text.replace(/\u3007/g, '\u25CB');
  text = text.replace(/\u25CB([^\u3000])/g, '\u25CB\u3000$1');
  text = text.replace(/\u25CB\u3000\u3000/g, '\u25CB\u3000');
  
  const div = document.createElement('div');
  div.textContent = text;
  let html = div.innerHTML;
  
  html = html.replace(/([^\n])(\u25CB\u3000问)/g, '$1<br>$2');
  html = html.replace(/【占】/g, '<span class="section-marker">【占】</span>');
  html = html.replace(/【例】/g, '<span class="section-marker">【例】</span>');
  html = html.replace(/\[一辞多断\]/g, '<span class="section-marker">[一辞多断]</span>');
  html = html.replace(/\[经传释义\]/g, '<span class="section-marker">[经传释义]</span>');
  html = html.replace(/\[活断实例\]/g, '<span class="section-marker">[活断实例]</span>');
  html = html.replace(/(\u25CB\u3000问[^：:]+[：:])/g, '<span class="oracle-item">$1</span>');
  
  return html;
}

// --- Hexagram Rendering ---
function renderHexagramDiagram(container, lineArray, movingLineIndex) {
  container.innerHTML = '';
  for (let i = 5; i >= 0; i--) {
    const lineDiv = document.createElement('div');
    lineDiv.className = 'hex-line';
    if (i === movingLineIndex) lineDiv.classList.add('moving');
    
    if (lineArray[i] === 0) {
      const bar = document.createElement('div');
      bar.className = 'yang-line';
      lineDiv.appendChild(bar);
    } else {
      const c = document.createElement('div');
      c.className = 'yin-line';
      c.appendChild(document.createElement('span'));
      c.appendChild(document.createElement('span'));
      lineDiv.appendChild(c);
    }
    container.appendChild(lineDiv);
  }
}

// Small inline SVG hexagram for history cards
function renderMiniHexagram(lineArray, movingIdx) {
  let svg = '<svg viewBox="0 0 28 36" width="28" height="36" class="mini-hex">';
  for (let i = 5; i >= 0; i--) {
    const y = (5 - i) * 6;
    const color = i === movingIdx ? '#8b3a3a' : '#2a2520';
    if (lineArray[i] === 0) {
      svg += `<rect x="2" y="${y}" width="24" height="3.5" rx="0.5" fill="${color}"/>`;
    } else {
      svg += `<rect x="2" y="${y}" width="9" height="3.5" rx="0.5" fill="${color}"/>`;
      svg += `<rect x="17" y="${y}" width="9" height="3.5" rx="0.5" fill="${color}"/>`;
    }
  }
  svg += '</svg>';
  return svg;
}

// --- Main Divination ---
function startDivination() {
  const question = document.getElementById('question-input').value.trim();
  
  document.getElementById('section-input').classList.add('hidden');
  document.getElementById('section-casting').classList.remove('hidden');
  document.getElementById('section-result').classList.add('hidden');
  
  setTimeout(() => {
    performDivination(question);
  }, 2200);
}

function performDivination(question) {
  const { n, movingLine, castTime } = castRyakuzei();

  // 本卦：从n直接还原6爻数组
  // 编码：爻1=bit5(高位)...爻6=bit0(低位)，阳=0，阴=1
  const benArray = [
    (n >> 5) & 1, // 爻1（初爻）
    (n >> 4) & 1, // 爻2
    (n >> 3) & 1, // 爻3
    (n >> 2) & 1, // 爻4
    (n >> 1) & 1, // 爻5
     n       & 1  // 爻6（上爻）
  ];
  const benName = GUA_BY_N[n];

  // 变爻：翻转指定爻，XOR得变卦
  const targetIndex = movingLine - 1;
  const bianArray = [...benArray];
  bianArray[targetIndex] = bianArray[targetIndex] ^ 1;

  // 变卦：从bianArray反算n值，直接查表
  const bianN = bianArray[0]*32 + bianArray[1]*16 + bianArray[2]*8
              + bianArray[3]*4  + bianArray[4]*2  + bianArray[5]*1;
  const bianName = GUA_BY_N[bianN];
  
  // Get texts for all three sections
  const benGuaCi = getGuaCiText(benName);       // 本卦卦辞
  const bianYao = getDualText(benName, movingLine); // 变爻爻辞
  const bianGuaCi = getGuaCiText(bianName);     // 变卦卦辞
  
  // Store current result for notebook
  currentResult = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    question: question || '',
    castTime: castTime.toISOString(),
    benName, bianName, movingLine,
    benArray: [...benArray],
    bianArray: [...bianArray],
    targetIndex,
    reasoning: '',
    verdict: 'pending'
  };
  currentVerdict = 'pending';
  
  // Show result
  document.getElementById('section-casting').classList.add('hidden');
  document.getElementById('section-result').classList.remove('hidden');
  
  if (question) {
    document.getElementById('question-display').classList.remove('hidden');
    document.getElementById('question-text').textContent = question;
  } else {
    document.getElementById('question-display').classList.add('hidden');
  }
  
  // 起卦时间
  const { solar, lunar } = getDateTimeStr(castTime);
  const timeEl = document.getElementById('cast-time-display');
  if (timeEl) {
    document.getElementById('cast-time-solar').textContent = solar;
    document.getElementById('cast-time-lunar').textContent = lunar ? `农历 ${lunar}` : '';
  }

  // 卦名 + 二进制编码
  document.getElementById('ben-gua-name').textContent = benName;
  document.getElementById('bian-gua-name').textContent = bianName;
  const benBin  = n.toString(2).padStart(6, '0');
  const bianBin = bianN.toString(2).padStart(6, '0');
  document.getElementById('ben-gua-bin').textContent  = benBin;
  document.getElementById('bian-gua-bin').textContent = bianBin;
  
  renderHexagramDiagram(document.getElementById('ben-gua-diagram'), benArray, targetIndex);
  renderHexagramDiagram(document.getElementById('bian-gua-diagram'), bianArray, -1);
  
  document.getElementById('moving-line-label').textContent = `第${movingLine}爻动`;
  
  // Populate 本卦 (25%) — hexagram-level interpretation of original hexagram
  document.getElementById('bengua-title').textContent = `本卦 · ${benName}`;
  document.getElementById('bengua-classic-text').innerHTML = formatText(benGuaCi.classicText);
  document.getElementById('bengua-baihua-text').innerHTML = formatText(benGuaCi.baihuaText);
  
  // Populate 变爻 (60%) — moving line interpretation
  document.getElementById('bianyao-title').textContent = `变爻 · ${benName} 第${movingLine}爻`;
  document.getElementById('bianyao-classic-text').innerHTML = formatText(bianYao.classicText);
  document.getElementById('bianyao-baihua-text').innerHTML = formatText(bianYao.baihuaText);
  
  // Populate 变卦 (15%) — hexagram-level interpretation of transformed hexagram
  document.getElementById('biangua-title').textContent = `变卦 · ${bianName}`;
  document.getElementById('biangua-classic-text').innerHTML = formatText(bianGuaCi.classicText);
  document.getElementById('biangua-baihua-text').innerHTML = formatText(bianGuaCi.baihuaText);
  
  // Reset all interp-block tabs to show classic by default
  ['bengua', 'bianyao', 'biangua'].forEach(group => switchGroupTab(group, 'classic'));
  
  // Reset notebook
  document.getElementById('note-reasoning').value = '';
  resetVerdictButtons();
  document.querySelector('.verdict-btn[data-verdict="pending"]').classList.add('active');
  document.getElementById('save-feedback').classList.add('hidden');
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Verdict ---
function setVerdict(v) {
  currentVerdict = v;
  resetVerdictButtons();
  document.querySelector(`.verdict-btn[data-verdict="${v}"]`).classList.add('active');
}

function resetVerdictButtons() {
  document.querySelectorAll('.verdict-btn').forEach(b => b.classList.remove('active'));
}

// --- Save Note ---
function saveCurrentNote() {
  if (!currentResult) return;
  
  currentResult.reasoning = document.getElementById('note-reasoning').value.trim();
  currentResult.verdict = currentVerdict;
  
  const records = loadRecords();
  
  // Check if already saved (update)
  const existingIdx = records.findIndex(r => r.id === currentResult.id);
  if (existingIdx >= 0) {
    records[existingIdx] = { ...currentResult };
  } else {
    records.unshift({ ...currentResult });
  }
  
  saveRecords(records);
  updateBadge();
  
  // Show feedback
  const fb = document.getElementById('save-feedback');
  fb.classList.remove('hidden');
  fb.textContent = '已保存';
  setTimeout(() => fb.classList.add('hidden'), 2000);
}

// --- Tab Switching (per interpretation block) ---
function switchGroupTab(group, type) {
  const block = document.getElementById(`block-${group}`);
  if (!block) return;
  block.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  block.querySelector(`.tab[data-tab="${group}-${type}"]`).classList.add('active');
  block.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`tab-${group}-${type}`).classList.add('active');
}

// --- Page Navigation ---
function showPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById(`page-${pageName}`).classList.remove('hidden');
  
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-btn[data-page="${pageName}"]`).classList.add('active');
  
  if (pageName === 'history') {
    renderHistory();
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Reset ---
function resetApp() {
  currentResult = null;
  currentVerdict = 'pending';
  document.getElementById('section-result').classList.add('hidden');
  document.getElementById('section-casting').classList.add('hidden');
  document.getElementById('section-input').classList.remove('hidden');
  document.getElementById('question-input').value = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Badge ---
function updateBadge() {
  const records = loadRecords();
  const badge = document.getElementById('record-count-badge');
  if (records.length > 0) {
    badge.textContent = records.length;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

// --- History Rendering ---
function renderHistory() {
  const records = loadRecords();
  const listEl = document.getElementById('history-list');
  const emptyEl = document.getElementById('history-empty');
  const clearBtn = document.getElementById('clear-btn');
  
  if (records.length === 0) {
    listEl.innerHTML = '';
    emptyEl.classList.remove('hidden');
    clearBtn.classList.add('hidden');
    renderStats(records);
    return;
  }
  
  emptyEl.classList.add('hidden');
  clearBtn.classList.remove('hidden');
  renderStats(records);
  
  listEl.innerHTML = records.map((r, idx) => {
    const date = new Date(r.timestamp);
    const { solar, lunar } = getDateTimeStr(date);
    const dateStr = lunar ? `${solar} · 农历${lunar}` : solar;
    
    const verdictClass = r.verdict === 'correct' ? 'v-correct' : r.verdict === 'wrong' ? 'v-wrong' : 'v-pending';
    const verdictText = r.verdict === 'correct' ? '准' : r.verdict === 'wrong' ? '不准' : '待验证';
    
    const miniHex = renderMiniHexagram(r.benArray, r.targetIndex);
    
    return `
      <div class="history-card" onclick="openRecord(${idx})">
        <div class="history-card-left">
          ${miniHex}
          <div class="history-card-info">
            <div class="history-card-gua">${r.benName} → ${r.bianName}</div>
            <div class="history-card-meta">第${r.movingLine}爻动 · ${dateStr}</div>
            ${r.question ? `<div class="history-card-question">${escapeHtml(r.question)}</div>` : ''}
          </div>
        </div>
        <div class="history-card-right">
          <span class="verdict-tag ${verdictClass}">${verdictText}</span>
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// --- Stats ---
function renderStats(records) {
  const total = records.length;
  const correct = records.filter(r => r.verdict === 'correct').length;
  const wrong = records.filter(r => r.verdict === 'wrong').length;
  const pending = records.filter(r => r.verdict === 'pending').length;
  
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-correct').textContent = correct;
  document.getElementById('stat-wrong').textContent = wrong;
  document.getElementById('stat-pending').textContent = pending;
  
  const judged = correct + wrong;
  const accSection = document.getElementById('accuracy-section');
  
  if (judged > 0) {
    accSection.style.display = 'block';
    const rate = Math.round((correct / judged) * 100);
    document.getElementById('accuracy-value').textContent = `${rate}%`;
    document.getElementById('accuracy-fill').style.width = `${rate}%`;
    document.getElementById('accuracy-note').textContent = `基于 ${judged} 次已判断的占卜（${correct} 准 / ${wrong} 不准）`;
  } else {
    accSection.style.display = 'none';
  }
}

// --- Record Detail Modal ---
function openRecord(idx) {
  const records = loadRecords();
  const r = records[idx];
  if (!r) return;
  
  const date = new Date(r.timestamp);
  const { solar, lunar } = getDateTimeStr(date);
  const dateStr = lunar ? `${solar}<br><span style="color:var(--accent);letter-spacing:2px;font-size:13px;">农历 ${lunar}</span>` : solar;
  
  const verdictClass = r.verdict === 'correct' ? 'v-correct' : r.verdict === 'wrong' ? 'v-wrong' : 'v-pending';
  const verdictText = r.verdict === 'correct' ? '准' : r.verdict === 'wrong' ? '不准' : '待验证';
  
  const miniHexBen = renderMiniHexagram(r.benArray, r.targetIndex);
  const miniHexBian = renderMiniHexagram(r.bianArray, -1);
  
  document.getElementById('modal-body').innerHTML = `
    <div class="modal-date">${dateStr}</div>
    ${r.question ? `<div class="modal-question">所问: ${escapeHtml(r.question)}</div>` : ''}
    
    <div class="modal-hex-row">
      <div class="modal-hex-col">
        <div class="modal-hex-label">本卦</div>
        <div class="modal-hex-name">${r.benName}</div>
        ${miniHexBen}
      </div>
      <div class="modal-hex-arrow">→</div>
      <div class="modal-hex-col">
        <div class="modal-hex-label">变卦</div>
        <div class="modal-hex-name">${r.bianName}</div>
        ${miniHexBian}
      </div>
    </div>
    <div class="modal-moving">第${r.movingLine}爻动</div>
    
    ${r.reasoning ? `
      <div class="modal-section">
        <div class="modal-section-title">我的解卦推理</div>
        <div class="modal-section-text">${escapeHtml(r.reasoning)}</div>
      </div>
    ` : ''}
    
    <div class="modal-section">
      <div class="modal-section-title">判断结果</div>
      <div class="modal-verdict-group">
        <button class="verdict-btn modal-v ${r.verdict === 'correct' ? 'active' : ''}" data-verdict="correct" onclick="updateRecordVerdict(${idx}, 'correct')">
          <span class="verdict-icon">✓</span> 准
        </button>
        <button class="verdict-btn modal-v ${r.verdict === 'wrong' ? 'active' : ''}" data-verdict="wrong" onclick="updateRecordVerdict(${idx}, 'wrong')">
          <span class="verdict-icon">✗</span> 不准
        </button>
        <button class="verdict-btn modal-v ${r.verdict === 'pending' ? 'active' : ''}" data-verdict="pending" onclick="updateRecordVerdict(${idx}, 'pending')">
          <span class="verdict-icon">…</span> 待验证
        </button>
      </div>
    </div>
    
    <div class="modal-section">
      <div class="modal-section-title">修改笔记</div>
      <textarea id="modal-reasoning" class="notebook-textarea" rows="3">${r.reasoning ? escapeHtml(r.reasoning) : ''}</textarea>
      <div class="modal-actions">
        <button class="save-note-btn modal-save" onclick="updateRecordNote(${idx})">保存修改</button>
        <button class="delete-record-btn" onclick="deleteRecord(${idx})">删除记录</button>
      </div>
      <div id="modal-feedback" class="save-feedback hidden">已保存</div>
    </div>
  `;
  
  document.getElementById('record-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('record-modal').classList.add('hidden');
  document.body.style.overflow = '';
  renderHistory();
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('record-modal')) {
    closeModal();
  }
}

function updateRecordVerdict(idx, verdict) {
  const records = loadRecords();
  if (records[idx]) {
    records[idx].verdict = verdict;
    saveRecords(records);
    // Update modal buttons
    document.querySelectorAll('.modal-v').forEach(b => b.classList.remove('active'));
    document.querySelector(`.modal-v[data-verdict="${verdict}"]`).classList.add('active');
    // Flash feedback
    const fb = document.getElementById('modal-feedback');
    fb.textContent = '判断已更新';
    fb.classList.remove('hidden');
    setTimeout(() => fb.classList.add('hidden'), 1500);
  }
}

function updateRecordNote(idx) {
  const records = loadRecords();
  if (records[idx]) {
    records[idx].reasoning = document.getElementById('modal-reasoning').value.trim();
    saveRecords(records);
    const fb = document.getElementById('modal-feedback');
    fb.textContent = '已保存';
    fb.classList.remove('hidden');
    setTimeout(() => fb.classList.add('hidden'), 1500);
  }
}

function deleteRecord(idx) {
  if (!confirm('确定要删除这条记录吗？')) return;
  const records = loadRecords();
  records.splice(idx, 1);
  saveRecords(records);
  updateBadge();
  closeModal();
}

function clearAllRecords() {
  if (!confirm('确定要清空所有占卜记录吗？此操作不可恢复。')) return;
  saveRecords([]);
  updateBadge();
  renderHistory();
}

// --- Keyboard Support ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement.id === 'question-input') {
    startDivination();
  }
  if (e.key === 'Escape') {
    closeModal();
  }
});

// --- Initialize ---
document.addEventListener('DOMContentLoaded', loadDatabases);
