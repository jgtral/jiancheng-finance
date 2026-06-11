// budget_planner/app.js

// --- Constants & Configuration ---
const PRESETS = {
  jiancheng: {
    name: "建成社區 114年預估現狀",
    balances: {
      currentAccount: 441332, // Based on April 115 財報
      publicReserve: 1262604  // Based on April 114 財報
    },
    collectionRate: 95,
    adjustmentRate: 0,
    adminCostMultiplier: 1.0,
    safetyLine: 500000,
    recurringIncome: [
      { id: "inc-1", name: "住戶管理費 (預期應收)", value: 216000, category: "management_fee" },
      { id: "inc-2", name: "車位清潔費與停車租金", value: 30000, category: "parking" },
      { id: "inc-3", name: "B1 商場/超市管理費 (正常繳納款)", value: 20000, category: "commercial" },
      { id: "inc-4", name: "銀行存款利息", value: 400, category: "interest" }
    ],
    recurringExpenses: [
      { id: "exp-1", name: "總幹事行政薪資", value: 41567, category: "personnel" },
      { id: "exp-2", name: "行政小幫手薪資", value: 13500, category: "personnel" },
      { id: "exp-3", name: "人事勞健保與勞退6%", value: 4830, category: "personnel" },
      { id: "exp-4", name: "電梯保養維護費 (九龍電梯)", value: 10500, category: "maintenance" },
      { id: "exp-5", name: "機電與消防設備保養 (閎景)", value: 6300, category: "maintenance" },
      { id: "exp-6", name: "公設大公電費與小公電費", value: 25000, category: "utilities" },
      { id: "exp-7", name: "管理室零用金與行政雜支", value: 7242, category: "admin" },
      { id: "exp-8", name: "昕保監視器租賃 (分期12期)", value: 27530, category: "loan" } // 12期分期
    ],
    specialEvents: [
      { id: "evt-1", name: "40萬消防公安修繕申報工程", value: 400000, type: "expense", monthOffset: 2, active: true },
      { id: "evt-2", name: "追回 B1 商場積欠管理費", value: 200000, type: "income", monthOffset: 4, active: true },
      { id: "evt-3", name: "龍祥電梯系統更新尾款50%", value: 165000, type: "expense", monthOffset: 6, active: true },
      { id: "evt-4", name: "水塔清洗與化糞池清理", value: 25000, type: "expense", monthOffset: 3, active: true }
    ]
  },
  crisis: {
    name: "危機情境 (收繳率下滑 & 重大超支)",
    balances: {
      currentAccount: 441332,
      publicReserve: 1262604
    },
    collectionRate: 75, // Severe drop in collection
    adjustmentRate: 0,
    adminCostMultiplier: 1.25, // Over-budgeting in administrative staff
    safetyLine: 800000,
    recurringIncome: [
      { id: "inc-1", name: "住戶管理費 (預期應收)", value: 216000, category: "management_fee" },
      { id: "inc-2", name: "車位清潔費與停車租金", value: 30000, category: "parking" },
      { id: "inc-3", name: "B1 商場/超市管理費 (正常繳納款)", value: 20000, category: "commercial" },
      { id: "inc-4", name: "銀行存款利息", value: 400, category: "interest" }
    ],
    recurringExpenses: [
      { id: "exp-1", name: "總幹事行政薪資", value: 41567, category: "personnel" },
      { id: "exp-2", name: "行政小幫手薪資", value: 13500, category: "personnel" },
      { id: "exp-3", name: "人事勞健保與勞退6%", value: 4830, category: "personnel" },
      { id: "exp-4", name: "電梯保養維護費 (九龍電梯)", value: 10500, category: "maintenance" },
      { id: "exp-5", name: "機電與消防設備保養 (閎景)", value: 6300, category: "maintenance" },
      { id: "exp-6", name: "公設大公電費與小公電費", value: 35000, category: "utilities" }, // utility spike
      { id: "exp-7", name: "管理室零用金與行政雜支", value: 10000, category: "admin" },
      { id: "exp-8", name: "昕保監視器租賃 (分期12期)", value: 27530, category: "loan" }
    ],
    specialEvents: [
      { id: "evt-1", name: "40萬消防公安修繕申報工程", value: 400000, type: "expense", monthOffset: 2, active: true },
      { id: "evt-2", name: "追回 B1 商場積欠管理費 (失敗)", value: 0, type: "income", monthOffset: 4, active: false },
      { id: "evt-3", name: "龍祥電梯系統更新尾款50%", value: 165000, type: "expense", monthOffset: 6, active: true },
      { id: "evt-4", name: "水塔清洗與化糞池清理", value: 25000, type: "expense", monthOffset: 3, active: true }
    ]
  },
  healthy: {
    name: "健全情境 (管理費調漲10% & 催收成功)",
    balances: {
      currentAccount: 441332,
      publicReserve: 1262604
    },
    collectionRate: 98, // Great collection
    adjustmentRate: 10, // 10% Increase
    adminCostMultiplier: 1.0,
    safetyLine: 500000,
    recurringIncome: [
      { id: "inc-1", name: "住戶管理費 (預期應收)", value: 216000, category: "management_fee" },
      { id: "inc-2", name: "車位清潔費與停車租金", value: 30000, category: "parking" },
      { id: "inc-3", name: "B1 商場/超市管理費 (正常繳納款)", value: 20000, category: "commercial" },
      { id: "inc-4", name: "銀行存款利息", value: 400, category: "interest" }
    ],
    recurringExpenses: [
      { id: "exp-1", name: "總幹事行政薪資", value: 41567, category: "personnel" },
      { id: "exp-2", name: "行政小幫手薪資", value: 13500, category: "personnel" },
      { id: "exp-3", name: "人事勞健保與勞退6%", value: 4830, category: "personnel" },
      { id: "exp-4", name: "電梯保養維護費 (九龍電梯)", value: 10500, category: "maintenance" },
      { id: "exp-5", name: "機電與消防設備保養 (閎景)", value: 6300, category: "maintenance" },
      { id: "exp-6", name: "公設大公電費與小公電費", value: 25000, category: "utilities" },
      { id: "exp-7", name: "管理室零用金與行政雜支", value: 7242, category: "admin" },
      { id: "exp-8", name: "昕保監視器租賃 (分期12期)", value: 27530, category: "loan" }
    ],
    specialEvents: [
      { id: "evt-1", name: "40萬消防公安修繕申報工程", value: 400000, type: "expense", monthOffset: 2, active: true },
      { id: "evt-2", name: "追回 B1 商場積欠管理費", value: 200000, type: "income", monthOffset: 4, active: true },
      { id: "evt-3", name: "龍祥電梯系統更新尾款50%", value: 165000, type: "expense", monthOffset: 6, active: true },
      { id: "evt-4", name: "水塔清洗與化糞池清理", value: 25000, type: "expense", monthOffset: 3, active: true }
    ]
  }
};

// --- Application State ---
let state = {
  theme: 'dark',
  balances: {
    currentAccount: 441332,
    publicReserve: 1262604
  },
  collectionRate: 95,
  adjustmentRate: 0,
  adminCostMultiplier: 1.0,
  safetyLine: 500000,
  recurringIncome: [],
  recurringExpenses: [],
  specialEvents: [],
  scenarios: [],
  activeScenarioIndex: null
};

// --- Chart References ---
let cashflowChart = null;

// --- Helper Functions ---
function formatCurrency(val) {
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(val);
}

function getMonthLabels(startMonthOffset = 0, count = 24) {
  const labels = [];
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + startMonthOffset);
  
  for (let i = 0; i < count; i++) {
    const yy = String(currentDate.getFullYear()).slice(-2);
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    labels.push(`${yy}/${mm}`);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return labels;
}

// --- Simulation Core ---
function runSimulation() {
  const monthsToSimulate = 24;
  const data = [];
  
  let currentCash = state.balances.currentAccount;
  let currentReserve = state.balances.publicReserve;
  
  for (let m = 1; m <= monthsToSimulate; m++) {
    // 1. Calculate Monthly Income
    let monthlyIncome = 0;
    state.recurringIncome.forEach(item => {
      if (item.category === 'management_fee') {
        // Apply adjustment rate & collection rate
        const rawFee = item.value;
        const adjustedFee = rawFee * (1 + state.adjustmentRate / 100);
        const collectedFee = adjustedFee * (state.collectionRate / 100);
        monthlyIncome += collectedFee;
      } else {
        monthlyIncome += item.value;
      }
    });
    
    // 2. Calculate Monthly Expense
    let monthlyExpense = 0;
    state.recurringExpenses.forEach(item => {
      // Lease payment "昕保租賃(新光監視器)" is 12 periods, assume it ends after month 10 (as it was second period in March 115)
      // For simplicity, if id is exp-8 (lease) and month is past month 10, do not include it.
      if (item.id === 'exp-8' && m > 10) {
        return; 
      }
      
      if (item.category === 'personnel') {
        monthlyExpense += item.value * state.adminCostMultiplier;
      } else {
        monthlyExpense += item.value;
      }
    });
    
    // 3. Apply Special Events for this month
    let eventIncome = 0;
    let eventExpense = 0;
    const activeEventsThisMonth = state.specialEvents.filter(e => e.active && parseInt(e.monthOffset) === m);
    
    activeEventsThisMonth.forEach(evt => {
      if (evt.type === 'income') {
        eventIncome += evt.value;
      } else {
        eventExpense += evt.value;
      }
    });
    
    const totalIncome = monthlyIncome + eventIncome;
    const totalExpense = monthlyExpense + eventExpense;
    const netFlow = totalIncome - totalExpense;
    
    // 4. Update Balances
    currentCash += netFlow;
    
    // Auto-Replenish current account from Public Reserve if current cash goes negative
    let transferred = 0;
    if (currentCash < 0 && currentReserve > 0) {
      const needed = Math.abs(currentCash);
      transferred = Math.min(needed, currentReserve);
      currentReserve -= transferred;
      currentCash += transferred;
    }
    
    data.push({
      month: m,
      label: getMonthLabels(0, 24)[m-1],
      recurringIncome: monthlyIncome,
      eventIncome: eventIncome,
      totalIncome: totalIncome,
      recurringExpense: monthlyExpense,
      eventExpense: eventExpense,
      totalExpense: totalExpense,
      netFlow: netFlow,
      endingCash: currentCash,
      endingReserve: currentReserve,
      totalAssets: currentCash + currentReserve,
      replenishedFromReserve: transferred
    });
  }
  
  return data;
}

// --- UI Sync Functions ---
function updateDashboard() {
  const results = runSimulation();
  const lastMonth = results[results.length - 1];
  
  // Calculate Avg Net Flow
  const totalNet = results.reduce((sum, r) => sum + r.netFlow, 0);
  const avgNet = totalNet / results.length;
  
  // Update Cards
  document.getElementById('kpi-total-cash').innerText = formatCurrency(lastMonth.totalAssets);
  document.getElementById('kpi-current-cash').innerText = formatCurrency(lastMonth.endingCash);
  document.getElementById('kpi-reserve-cash').innerText = formatCurrency(lastMonth.endingReserve);
  
  const netEl = document.getElementById('kpi-avg-net');
  netEl.innerText = formatCurrency(avgNet);
  if (avgNet >= 0) {
    netEl.className = 'kpi-value text-success';
  } else {
    netEl.className = 'kpi-value text-danger';
  }
  
  // Security Indicator
  const minAssets = Math.min(...results.map(r => r.totalAssets));
  const statusEl = document.getElementById('safety-status');
  const safetyVal = parseInt(state.safetyLine);
  
  if (minAssets < 0) {
    statusEl.innerHTML = `<span class="text-danger"><i data-lucide="alert-triangle"></i> 財務破產風險 (會透支)</span>`;
  } else if (minAssets < safetyVal) {
    statusEl.innerHTML = `<span class="text-warning"><i data-lucide="alert-circle"></i> 低於安全準備金水位</span>`;
  } else {
    statusEl.innerHTML = `<span class="text-success"><i data-lucide="check-circle"></i> 財務狀況安全</span>`;
  }
  
  // Admin Budget Tracker alert (based on CP950 doubts about $300k admin salary rate)
  // Let's calculate the projected 12-month administrative personnel spending
  const annualPersonnelExpense = results.slice(0, 12).reduce((sum, r) => {
    // personnel is part of monthly recurring expense, specifically:
    // exp-1 ($41567) + exp-2 ($13500) + exp-3 ($4830) = $59,897
    // Let's fetch the exact personnel item values from state
    let monthlyPersonnel = 0;
    state.recurringExpenses.forEach(item => {
      if (item.category === 'personnel') {
        monthlyPersonnel += item.value * state.adminCostMultiplier;
      }
    });
    return sum + monthlyPersonnel;
  }, 0);
  
  const adminAlertEl = document.getElementById('admin-budget-warning');
  if (annualPersonnelExpense > 300000) {
    const overrun = annualPersonnelExpense - 300000;
    adminAlertEl.innerHTML = `<i data-lucide="alert-circle"></i> 預警：年度行政人事費用預估為 ${formatCurrency(annualPersonnelExpense)}，已超出預算限額 $300,000 (超支 ${formatCurrency(overrun)})！`;
    adminAlertEl.style.display = 'flex';
  } else {
    adminAlertEl.style.display = 'none';
  }
  
  lucide.createIcons();
  
  // Update charts
  renderChart(results);
}

function renderChart(results) {
  const ctx = document.getElementById('cashflowChartCanvas').getContext('2d');
  
  const labels = results.map(r => r.label);
  const totalAssetsData = results.map(r => r.totalAssets);
  const currentCashData = results.map(r => r.endingCash);
  const reserveCashData = results.map(r => r.endingReserve);
  const netFlowData = results.map(r => r.netFlow);
  
  // Create safety line datasets
  const safetyLineData = Array(24).fill(state.safetyLine);
  
  // Scenario comparisons datasets
  const comparisonDatasets = [];
  
  // If we are comparing, let's plot active compared scenarios
  state.scenarios.forEach((sc, idx) => {
    if (sc.compared) {
      // Temporarily switch state, simulate, and switch back
      const originalState = JSON.stringify(state);
      state = JSON.parse(JSON.stringify(sc.state));
      const scResults = runSimulation();
      state = JSON.parse(originalState);
      
      comparisonDatasets.push({
        label: `對比: ${sc.name}`,
        data: scResults.map(r => r.totalAssets),
        borderColor: getScenarioColor(idx),
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 2,
        fill: false,
        yAxisID: 'y'
      });
    }
  });
  
  if (cashflowChart) {
    cashflowChart.destroy();
  }
  
  const datasets = [
    {
      type: 'line',
      label: '預估總資產 (活存+公積金)',
      data: totalAssetsData,
      borderColor: state.theme === 'dark' ? '#a78bfa' : '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderWidth: 3,
      pointBackgroundColor: '#8b5cf6',
      pointHoverRadius: 6,
      fill: true,
      tension: 0.2,
      yAxisID: 'y'
    },
    {
      type: 'line',
      label: '安全準備金水位',
      data: safetyLineData,
      borderColor: 'rgba(239, 68, 68, 0.6)',
      borderWidth: 1.5,
      borderDash: [4, 4],
      pointRadius: 0,
      fill: false,
      yAxisID: 'y'
    },
    ...comparisonDatasets,
    {
      type: 'bar',
      label: '月淨現金流',
      data: netFlowData,
      backgroundColor: netFlowData.map(val => val >= 0 ? 'rgba(16, 185, 129, 0.45)' : 'rgba(239, 68, 68, 0.45)'),
      borderColor: netFlowData.map(val => val >= 0 ? '#10b981' : '#ef4444'),
      borderWidth: 1.5,
      borderRadius: 4,
      yAxisID: 'y2'
    }
  ];
  
  cashflowChart = new Chart(ctx, {
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: state.theme === 'dark' ? '#94a3b8' : '#475569',
            font: { family: 'Outfit', size: 11 }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += formatCurrency(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: state.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
          },
          ticks: {
            color: state.theme === 'dark' ? '#64748b' : '#94a3b8',
            font: { size: 10 }
          }
        },
        y: {
          position: 'left',
          grid: {
            color: state.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
          },
          ticks: {
            color: state.theme === 'dark' ? '#94a3b8' : '#475569',
            callback: function(value) {
              return value >= 10000 ? (value / 10000) + ' 萬' : value;
            }
          },
          title: {
            display: true,
            text: '累計資產規模 (NTD)',
            color: state.theme === 'dark' ? '#94a3b8' : '#475569'
          }
        },
        y2: {
          position: 'right',
          grid: {
            drawOnChartArea: false
          },
          ticks: {
            color: state.theme === 'dark' ? '#94a3b8' : '#475569',
            callback: function(value) {
              return value >= 10000 || value <= -10000 ? (value / 10000) + ' 萬' : value;
            }
          },
          title: {
            display: true,
            text: '單月淨流量 (NTD)',
            color: state.theme === 'dark' ? '#94a3b8' : '#475569'
          }
        }
      }
    }
  });
}

function getScenarioColor(idx) {
  const colors = ['#f59e0b', '#0ea5e9', '#ec4899', '#10b981'];
  return colors[idx % colors.length];
}

// --- Data Presets and State Synchronization ---
function loadPreset(presetName) {
  const preset = PRESETS[presetName];
  if (!preset) return;
  
  state.balances = { ...preset.balances };
  state.collectionRate = preset.collectionRate;
  state.adjustmentRate = preset.adjustmentRate;
  state.adminCostMultiplier = preset.adminCostMultiplier;
  state.safetyLine = preset.safetyLine || 500000;
  
  state.recurringIncome = JSON.parse(JSON.stringify(preset.recurringIncome));
  state.recurringExpenses = JSON.parse(JSON.stringify(preset.recurringExpenses));
  state.specialEvents = JSON.parse(JSON.stringify(preset.specialEvents));
  
  syncStateToInputs();
  renderIncomeTable();
  renderExpenseTable();
  renderEventsTimeline();
  updateDashboard();
  showToast(`已載入預設案: ${preset.name}`, 'success');
}

function syncStateToInputs() {
  document.getElementById('input-current-balance').value = state.balances.currentAccount;
  document.getElementById('input-reserve-balance').value = state.balances.publicReserve;
  document.getElementById('input-safety-line').value = state.safetyLine;
  
  // Sliders
  document.getElementById('slider-collection-rate').value = state.collectionRate;
  document.getElementById('val-collection-rate').innerText = `${state.collectionRate}%`;
  
  document.getElementById('slider-adj-rate').value = state.adjustmentRate;
  document.getElementById('val-adj-rate').innerText = `${state.adjustmentRate >= 0 ? '+' : ''}${state.adjustmentRate}%`;
  
  document.getElementById('slider-admin-multiplier').value = state.adminCostMultiplier;
  document.getElementById('val-admin-multiplier').innerText = `${Math.round(state.adminCostMultiplier * 100)}%`;
}

// --- Tables Rendering ---
function renderIncomeTable() {
  const tbody = document.querySelector('#table-income tbody');
  tbody.innerHTML = '';
  
  state.recurringIncome.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-semibold">${item.name}</td>
      <td>
        <span class="badge ${item.category === 'management_fee' ? 'text-success' : 'text-muted'}">
          ${getCategoryLabel(item.category)}
        </span>
      </td>
      <td>
        <div class="input-wrapper">
          <span class="input-prefix">$</span>
          <input type="number" class="form-control has-prefix cell-input" data-id="${item.id}" data-type="income" value="${item.value}">
        </div>
      </td>
      <td>
        <div class="cell-actions">
          <button class="btn-table-action delete" onclick="deleteItem('${item.id}', 'income')">
            <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  // Bind live inputs
  tbody.querySelectorAll('.cell-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = e.target.getAttribute('data-id');
      const val = parseFloat(e.target.value) || 0;
      const index = state.recurringIncome.findIndex(x => x.id === id);
      if (index !== -1) {
        state.recurringIncome[index].value = val;
        updateDashboard();
      }
    });
  });
  
  lucide.createIcons();
}

function renderExpenseTable() {
  const tbody = document.querySelector('#table-expense tbody');
  tbody.innerHTML = '';
  
  state.recurringExpenses.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-semibold">${item.name}</td>
      <td>
        <span class="badge">${getCategoryLabel(item.category)}</span>
      </td>
      <td>
        <div class="input-wrapper">
          <span class="input-prefix">$</span>
          <input type="number" class="form-control has-prefix cell-input" data-id="${item.id}" data-type="expense" value="${item.value}">
        </div>
      </td>
      <td>
        <div class="cell-actions">
          <button class="btn-table-action delete" onclick="deleteItem('${item.id}', 'expense')">
            <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  // Bind live inputs
  tbody.querySelectorAll('.cell-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = e.target.getAttribute('data-id');
      const val = parseFloat(e.target.value) || 0;
      const index = state.recurringExpenses.findIndex(x => x.id === id);
      if (index !== -1) {
        state.recurringExpenses[index].value = val;
        updateDashboard();
      }
    });
  });
  
  lucide.createIcons();
}

function getCategoryLabel(cat) {
  const dict = {
    management_fee: "住戶管理費",
    parking: "停車清潔費",
    commercial: "商場管理費",
    interest: "存款利息",
    personnel: "行政人事",
    maintenance: "維護保養",
    utilities: "公設水電",
    admin: "行政雜支",
    loan: "合約分期",
    other: "其他項目"
  };
  return dict[cat] || "未分类";
}

function deleteItem(id, type) {
  if (type === 'income') {
    state.recurringIncome = state.recurringIncome.filter(x => x.id !== id);
    renderIncomeTable();
  } else {
    state.recurringExpenses = state.recurringExpenses.filter(x => x.id !== id);
    renderExpenseTable();
  }
  updateDashboard();
  showToast('項目已刪除', 'warning');
}

// --- Special Events Timeline Rendering ---
function renderEventsTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) return;
  container.innerHTML = '';
  
  const monthLabels = getMonthLabels(0, 24);
  
  for (let m = 1; m <= 24; m++) {
    const monthLabel = monthLabels[m - 1];
    const monthEvents = state.specialEvents.filter(e => parseInt(e.monthOffset) === m);
    
    const slotDiv = document.createElement('div');
    slotDiv.className = 'month-slot';
    slotDiv.dataset.month = m;
    
    let eventsHtml = '';
    if (monthEvents.length === 0) {
      eventsHtml = `<div class="month-events-empty">拖曳項目至此</div>`;
    } else {
      monthEvents.forEach(evt => {
        eventsHtml += `
          <div class="event-pill ${evt.type}" 
               draggable="true" 
               data-id="${evt.id}">
            <span class="event-pill-info" title="${evt.name} (${evt.type === 'income' ? '單次收入' : '單次支出'}: ${formatCurrency(evt.value)})">
              ${evt.name} (${evt.type === 'income' ? '+' : '-'}${Math.round(evt.value/1000)}k)
            </span>
            <button class="btn-pill-delete" onclick="event.stopPropagation(); deleteEvent('${evt.id}')">&times;</button>
          </div>
        `;
      });
    }
    
    slotDiv.innerHTML = `
      <div class="month-header">
        <span class="month-name">${monthLabel}</span>
        <div class="month-actions">
          <button class="btn-mini inc" title="在此月新增單次收入" onclick="openAddEventModalDirect(${m}, 'income')">
            +收
          </button>
          <button class="btn-mini exp" title="在此月新增單次支出" onclick="openAddEventModalDirect(${m}, 'expense')">
            +支
          </button>
        </div>
      </div>
      <div class="month-events" id="dropzone-month-${m}">
        ${eventsHtml}
      </div>
    `;
    container.appendChild(slotDiv);
  }
  
  initDragAndDrop();
  lucide.createIcons();
}

function initDragAndDrop() {
  const pills = document.querySelectorAll('.event-pill');
  const slots = document.querySelectorAll('.month-slot');
  
  pills.forEach(pill => {
    pill.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', pill.getAttribute('data-id'));
      pill.classList.add('dragging');
    });
    
    pill.addEventListener('dragend', () => {
      pill.classList.remove('dragging');
    });
  });
  
  slots.forEach(slot => {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    
    slot.addEventListener('dragenter', (e) => {
      e.preventDefault();
      slot.classList.add('drag-over');
    });
    
    slot.addEventListener('dragleave', () => {
      slot.classList.remove('drag-over');
    });
    
    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('drag-over');
      
      const eventId = e.dataTransfer.getData('text/plain');
      const targetMonth = parseInt(slot.getAttribute('data-month'));
      
      const idx = state.specialEvents.findIndex(x => x.id === eventId);
      if (idx !== -1 && targetMonth >= 1 && targetMonth <= 24) {
        state.specialEvents[idx].monthOffset = targetMonth;
        renderEventsTimeline();
        updateDashboard();
        showToast(`已移動項目至 ${getMonthLabels(0, 24)[targetMonth - 1]}`, 'success');
      }
    });
  });
}

function deleteEvent(id) {
  state.specialEvents = state.specialEvents.filter(x => x.id !== id);
  renderEventsTimeline();
  updateDashboard();
  showToast('重大事件已刪除', 'warning');
}

// --- Scenario Management ---
function renderScenarios() {
  const container = document.getElementById('scenarios-container');
  container.innerHTML = '';
  
  for (let i = 0; i < 3; i++) {
    const sc = state.scenarios[i];
    if (sc) {
      const div = document.createElement('div');
      div.className = `scenario-item ${sc.compared ? 'active' : ''}`;
      div.innerHTML = `
        <div>
          <h5>${sc.name}</h5>
          <p class="scenario-desc">收繳率: ${sc.state.collectionRate}% | 調幅: ${sc.state.adjustmentRate}% | 安全線: ${formatCurrency(sc.state.safetyLine)}</p>
        </div>
        <div class="scenario-foot">
          <div class="scenario-actions">
            <button class="btn btn-secondary btn-icon-only" title="載入此情境" onclick="loadScenario(${i})">
              <i data-lucide="download" style="width: 14px; height: 14px;"></i>
            </button>
            <button class="btn ${sc.compared ? 'btn-primary' : 'btn-secondary'} btn-icon-only" title="加入圖表對比" onclick="toggleCompareScenario(${i})">
              <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
          <button class="btn-table-action delete" title="刪除情境" onclick="deleteScenario(${i})">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
      `;
      container.appendChild(div);
    } else {
      const div = document.createElement('div');
      div.className = 'scenario-empty';
      div.onclick = () => openSaveScenarioModal();
      div.innerHTML = `
        <i data-lucide="plus-circle" style="width: 20px; height: 20px;"></i>
        <span>新增規劃情境</span>
      `;
      container.appendChild(div);
    }
  }
  
  lucide.createIcons();
}

function openSaveScenarioModal() {
  const modal = document.getElementById('modal-save-scenario');
  document.getElementById('input-scenario-name').value = `情境規劃 ${state.scenarios.length + 1}`;
  modal.classList.add('active');
}

function closeSaveScenarioModal() {
  document.getElementById('modal-save-scenario').classList.remove('active');
}

function saveCurrentAsScenario() {
  const name = document.getElementById('input-scenario-name').value.trim() || `情境規劃 ${state.scenarios.length + 1}`;
  
  if (state.scenarios.length >= 3) {
    showToast('最多僅能儲存 3 個對比情境', 'warning');
    return;
  }
  
  state.scenarios.push({
    name: name,
    compared: true, // Auto show in comparison
    state: JSON.parse(JSON.stringify({
      balances: state.balances,
      collectionRate: state.collectionRate,
      adjustmentRate: state.adjustmentRate,
      adminCostMultiplier: state.adminCostMultiplier,
      safetyLine: state.safetyLine,
      recurringIncome: state.recurringIncome,
      recurringExpenses: state.recurringExpenses,
      specialEvents: state.specialEvents
    }))
  });
  
  closeSaveScenarioModal();
  renderScenarios();
  updateDashboard();
  showToast(`成功儲存情境: ${name}`, 'success');
}

function loadScenario(index) {
  const sc = state.scenarios[index];
  if (!sc) return;
  
  state.balances = JSON.parse(JSON.stringify(sc.state.balances));
  state.collectionRate = sc.state.collectionRate;
  state.adjustmentRate = sc.state.adjustmentRate;
  state.adminCostMultiplier = sc.state.adminCostMultiplier;
  state.safetyLine = sc.state.safetyLine || 500000;
  
  state.recurringIncome = JSON.parse(JSON.stringify(sc.state.recurringIncome));
  state.recurringExpenses = JSON.parse(JSON.stringify(sc.state.recurringExpenses));
  state.specialEvents = JSON.parse(JSON.stringify(sc.state.specialEvents));
  
  syncStateToInputs();
  renderIncomeTable();
  renderExpenseTable();
  renderEventsTimeline();
  updateDashboard();
  showToast(`已套用情境: ${sc.name}`, 'success');
}

function toggleCompareScenario(index) {
  if (state.scenarios[index]) {
    state.scenarios[index].compared = !state.scenarios[index].compared;
    renderScenarios();
    updateDashboard();
  }
}

function deleteScenario(index) {
  state.scenarios.splice(index, 1);
  renderScenarios();
  updateDashboard();
  showToast('情境已刪除', 'warning');
}

// --- Modals logic for adding items ---
function openAddItemModal(type) {
  const modal = document.getElementById('modal-add-item');
  document.getElementById('modal-item-type').value = type;
  document.getElementById('modal-add-item-title').innerText = type === 'income' ? '新增經常性收入' : '新增經常性支出';
  
  // Set categories based on type
  const catSelect = document.getElementById('input-item-category');
  catSelect.innerHTML = '';
  
  if (type === 'income') {
    catSelect.innerHTML = `
      <option value="management_fee">住戶管理費</option>
      <option value="parking">車位清潔費/租金</option>
      <option value="commercial">商場管理費</option>
      <option value="interest">定期利息</option>
      <option value="other">其他收入</option>
    `;
  } else {
    catSelect.innerHTML = `
      <option value="personnel">行政與人事</option>
      <option value="maintenance">公共機電消防保養</option>
      <option value="utilities">大公小公電費</option>
      <option value="admin">管理行政雜支</option>
      <option value="loan">分期合約款</option>
      <option value="other">其他支出</option>
    `;
  }
  
  document.getElementById('input-item-name').value = '';
  document.getElementById('input-item-value').value = '';
  modal.classList.add('active');
}

function closeAddItemModal() {
  document.getElementById('modal-add-item').classList.remove('active');
}

function submitAddItem() {
  const type = document.getElementById('modal-item-type').value;
  const name = document.getElementById('input-item-name').value.trim();
  const value = parseFloat(document.getElementById('input-item-value').value) || 0;
  const category = document.getElementById('input-item-category').value;
  
  if (!name) {
    showToast('請輸入項目名稱', 'warning');
    return;
  }
  
  const newItem = {
    id: `custom-${type}-${Date.now()}`,
    name: name,
    value: value,
    category: category
  };
  
  if (type === 'income') {
    state.recurringIncome.push(newItem);
    renderIncomeTable();
  } else {
    state.recurringExpenses.push(newItem);
    renderExpenseTable();
  }
  
  closeAddItemModal();
  updateDashboard();
  showToast('經常性項目已新增', 'success');
}

// --- Modal major events logic ---
function openAddEventModal() {
  const modal = document.getElementById('modal-add-event');
  document.getElementById('input-event-name').value = '';
  document.getElementById('input-event-value').value = '';
  document.getElementById('input-event-month').value = '3';
  modal.classList.add('active');
}

function openAddEventModalDirect(month, type) {
  const modal = document.getElementById('modal-add-event');
  document.getElementById('input-event-name').value = '';
  document.getElementById('input-event-value').value = '';
  document.getElementById('input-event-type').value = type;
  document.getElementById('input-event-month').value = month;
  modal.classList.add('active');
}

function closeAddEventModal() {
  document.getElementById('modal-add-event').classList.remove('active');
}

function submitAddEvent() {
  const name = document.getElementById('input-event-name').value.trim();
  const value = parseFloat(document.getElementById('input-event-value').value) || 0;
  const type = document.getElementById('input-event-type').value;
  const monthOffset = parseInt(document.getElementById('input-event-month').value) || 1;
  
  if (!name) {
    showToast('請輸入修繕或工程名稱', 'warning');
    return;
  }
  
  const newEvent = {
    id: `evt-${Date.now()}`,
    name: name,
    value: value,
    type: type,
    monthOffset: monthOffset,
    active: true
  };
  
  state.specialEvents.push(newEvent);
  renderEventsTimeline();
  closeAddEventModal();
  updateDashboard();
  showToast('重大修繕/工程已加入時間軸', 'success');
}

// --- Import/Export Operations ---
function exportToCSV() {
  const results = runSimulation();
  let csv = '編號,月份,預估經常性收入(NTD),預估單次收入(NTD),總收入(NTD),經常性支出(NTD),單次工程修繕支出(NTD),總支出(NTD),單月淨現金流(NTD),期末活期餘額(NTD),公積金定期存款(NTD),社區總資產(NTD),定存調撥活存(NTD)\n';
  
  results.forEach(r => {
    csv += `${r.month},"${r.label}",${r.recurringIncome.toFixed(0)},${r.eventIncome.toFixed(0)},${r.totalIncome.toFixed(0)},${r.recurringExpense.toFixed(0)},${r.eventExpense.toFixed(0)},${r.totalExpense.toFixed(0)},${r.netFlow.toFixed(0)},${r.endingCash.toFixed(0)},${r.endingReserve.toFixed(0)},${r.totalAssets.toFixed(0)},${r.replenishedFromReserve.toFixed(0)}\n`;
  });
  
  // Download CSV
  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel Chinese compatibility
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `建成社區財務現金流預測報告_${new Date().toLocaleDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('已匯出 CSV 預測報表', 'success');
}

function exportJSONConfig() {
  const config = {
    balances: state.balances,
    collectionRate: state.collectionRate,
    adjustmentRate: state.adjustmentRate,
    adminCostMultiplier: state.adminCostMultiplier,
    safetyLine: state.safetyLine,
    recurringIncome: state.recurringIncome,
    recurringExpenses: state.recurringExpenses,
    specialEvents: state.specialEvents
  };
  
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `建成社區財務規劃設定檔_${new Date().toLocaleDateString()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('已匯出 JSON 設定檔', 'success');
}

function triggerImportJSON() {
  document.getElementById('input-file-import').click();
}

function importJSONConfig(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const imported = JSON.parse(evt.target.result);
      
      if (imported.balances && imported.recurringIncome && imported.recurringExpenses) {
        state.balances = imported.balances;
        state.collectionRate = imported.collectionRate ?? 95;
        state.adjustmentRate = imported.adjustmentRate ?? 0;
        state.adminCostMultiplier = imported.adminCostMultiplier ?? 1.0;
        state.safetyLine = imported.safetyLine ?? 500000;
        state.recurringIncome = imported.recurringIncome;
        state.recurringExpenses = imported.recurringExpenses;
        state.specialEvents = imported.specialEvents ?? [];
        
        syncStateToInputs();
        renderIncomeTable();
        renderExpenseTable();
        renderEventsTimeline();
        updateDashboard();
        showToast('設定檔導入成功', 'success');
      } else {
        showToast('JSON 格式不符規劃器規範', 'danger');
      }
    } catch(err) {
      showToast('導入失敗: JSON 解析錯誤', 'danger');
    }
  };
  reader.readAsText(file);
}

// --- UI Feedback (Toast Alerts) ---
function showToast(message, type = 'primary') {
  const toast = document.getElementById('toast-alert');
  const textContainer = toast.querySelector('.toast-text');
  
  toast.className = `alert-popup ${type} active`;
  textContainer.innerText = message;
  
  // Icon update
  const iconMap = {
    success: 'check-circle',
    warning: 'alert-triangle',
    danger: 'alert-circle',
    primary: 'info',
    info: 'info'
  };
  const iconName = iconMap[type] || 'info';
  
  const iconContainer = toast.querySelector('.toast-icon-wrapper');
  iconContainer.innerHTML = `<i data-lucide="${iconName}"></i>`;
  lucide.createIcons();
  
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// --- Theme Toggler ---
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  body.setAttribute('data-theme', newTheme);
  state.theme = newTheme;
  
  const themeBtn = document.getElementById('btn-toggle-theme');
  if (newTheme === 'light') {
    themeBtn.innerHTML = `<i data-lucide="moon"></i>`;
  } else {
    themeBtn.innerHTML = `<i data-lucide="sun"></i>`;
  }
  lucide.createIcons();
  
  // Rerender chart to apply new text colors
  updateDashboard();
}

// --- Initialization & Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Preset Loading
  loadPreset('jiancheng');
  
  // 2. Setup theme toggle
  document.getElementById('btn-toggle-theme').addEventListener('click', toggleTheme);
  
  // 3. Listen to Starting Balances inputs
  document.getElementById('input-current-balance').addEventListener('change', (e) => {
    state.balances.currentAccount = parseFloat(e.target.value) || 0;
    updateDashboard();
  });
  document.getElementById('input-reserve-balance').addEventListener('change', (e) => {
    state.balances.publicReserve = parseFloat(e.target.value) || 0;
    updateDashboard();
  });
  document.getElementById('input-safety-line').addEventListener('change', (e) => {
    state.safetyLine = parseFloat(e.target.value) || 0;
    updateDashboard();
  });
  
  // 4. Slider event listeners
  const sliderCollection = document.getElementById('slider-collection-rate');
  sliderCollection.addEventListener('input', (e) => {
    state.collectionRate = parseInt(e.target.value);
    document.getElementById('val-collection-rate').innerText = `${state.collectionRate}%`;
    updateDashboard();
  });
  
  const sliderAdj = document.getElementById('slider-adj-rate');
  sliderAdj.addEventListener('input', (e) => {
    state.adjustmentRate = parseInt(e.target.value);
    document.getElementById('val-adj-rate').innerText = `${state.adjustmentRate >= 0 ? '+' : ''}${state.adjustmentRate}%`;
    updateDashboard();
  });
  
  const sliderAdmin = document.getElementById('slider-admin-multiplier');
  sliderAdmin.addEventListener('input', (e) => {
    state.adminCostMultiplier = parseFloat(e.target.value);
    document.getElementById('val-admin-multiplier').innerText = `${Math.round(state.adminCostMultiplier * 100)}%`;
    updateDashboard();
  });
  
  // 5. Preset loader listener
  document.getElementById('select-preset').addEventListener('change', (e) => {
    loadPreset(e.target.value);
  });
  
  // 6. Tabs switching logic
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      
      // Update tab buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update tab contents
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(`tab-${tabName}`).classList.add('active');
    });
  });
  
  // Render initial scenarios
  renderScenarios();
  
  // Initial Lucide compilation
  lucide.createIcons();
});
