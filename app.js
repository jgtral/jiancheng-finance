// budget_planner/app.js

// --- Constants & Configuration ---
const PRESETS = {
  jiancheng: {
    name: "建成社區 114年預估現狀",
    balances: {
      currentAccount: 441332, // Based on April 115 財報
      publicReserve: 0  // Based on April 114 財報
    },
    collectionRate: 95,
    adjustmentRate: 0,
    adminCostMultiplier: 1.0,
    safetyLine: 0,
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
      { id: "evt-b1-recover", name: "追回 B1 商場積欠管理費", value: 200000, type: "income", monthOffset: 4, active: true },
      { id: "evt-elevator-tail", name: "龍祥電梯系統更新尾款50%", value: 165000, type: "expense", monthOffset: 6, active: true },
      { id: "evt-sewer-clean", name: "水塔清洗與化糞池清理", value: 25000, type: "expense", monthOffset: 3, active: true },
      { id: "evt-new-1", name: "11F~15F消防灑水測試(機組送電)", value: 80000, type: "expense", monthOffset: 2, active: true },
      { id: "evt-new-2", name: "B2授信總機迴路未連接查修工程", value: 4500, type: "expense", monthOffset: 3, active: true },
      { id: "evt-new-3", name: "B3消防室泡沫機組控制異常檢修", value: 12000, type: "expense", monthOffset: 2, active: true },
      { id: "evt-new-4", name: "B3第69車位廢水池右泵浦逆止閥修復", value: 14000, type: "expense", monthOffset: 3, active: true },
      { id: "evt-new-5", name: "B3龍江3號防火門鏽蝕更新", value: 40000, type: "expense", monthOffset: 4, active: true },
      { id: "evt-new-6", name: "龍祥大門上方採光罩破損更新", value: 35000, type: "expense", monthOffset: 4, active: true },
      { id: "evt-new-7", name: "車道鐵板發出聲響夜間擾民改善工程", value: 1000, type: "expense", monthOffset: 1, active: true },
      { id: "evt-new-8", name: "龍江/龍祥11F~15F管道間防火檢修口", value: 300000, type: "expense", monthOffset: 7, active: true },
      { id: "evt-new-9", name: "B1/B2/B3 防火泥填塞工程", value: 250000, type: "expense", monthOffset: 8, active: true },
      { id: "evt-new-10", name: "安全門下方門檻剷平及順平工程", value: 40000, type: "expense", monthOffset: 5, active: true },
      { id: "evt-new-11", name: "機車停車格劃設與編號分配", value: 40000, type: "expense", monthOffset: 5, active: true },
      { id: "evt-new-12", name: "管理室門窗紗窗及遮光窗簾(西曬改善)", value: 2000, type: "expense", monthOffset: 1, active: true },
      { id: "evt-new-13", name: "評估管理室窗戶外推小平台可行性", value: 2000, type: "expense", monthOffset: 1, active: true },
      { id: "evt-new-14", name: "B2授信總機室門配鎖管理", value: 1000, type: "expense", monthOffset: 1, active: true },
      { id: "evt-new-15", name: "B1漏水處理(連續壁漏水損害B2/B3牆)", value: 2000000, type: "expense", monthOffset: 10, active: false }, // Inactive by default
      { id: "evt-new-16", name: "慶泰-龍祥花台與出入口空鼓地磚重鋪", value: 50000, type: "expense", monthOffset: 6, active: true }
    ]
  },
  crisis: {
    name: "危機情境 (收繳率下滑 & 重大超支)",
    balances: {
      currentAccount: 441332,
      publicReserve: 0
    },
    collectionRate: 75, // Severe drop in collection
    adjustmentRate: 0,
    adminCostMultiplier: 1.25, // Over-budgeting in administrative staff
    safetyLine: 0,
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
      { id: "evt-b1-recover", name: "追回 B1 商場積欠管理費 (失敗)", value: 0, type: "income", monthOffset: 4, active: false },
      { id: "evt-elevator-tail", name: "龍祥電梯系統更新尾款50%", value: 165000, type: "expense", monthOffset: 6, active: true },
      { id: "evt-sewer-clean", name: "水塔清洗與化糞池清理", value: 25000, type: "expense", monthOffset: 3, active: true },
      { id: "evt-new-1", name: "11F~15F消防灑水測試(機組送電)", value: 80000, type: "expense", monthOffset: 2, active: true },
      { id: "evt-new-2", name: "B2授信總機迴路未連接查修工程", value: 4500, type: "expense", monthOffset: 3, active: true },
      { id: "evt-new-3", name: "B3消防室泡沫機組控制異常檢修", value: 12000, type: "expense", monthOffset: 2, active: true },
      { id: "evt-new-4", name: "B3第69車位廢水池右泵浦逆止閥修復", value: 14000, type: "expense", monthOffset: 3, active: true },
      { id: "evt-new-5", name: "B3龍江3號防火門鏽蝕更新", value: 40000, type: "expense", monthOffset: 4, active: true },
      { id: "evt-new-6", name: "龍祥大門上方採光罩破損更新", value: 35000, type: "expense", monthOffset: 4, active: true },
      { id: "evt-new-7", name: "車道鐵板發出聲響夜間擾民改善工程", value: 1000, type: "expense", monthOffset: 1, active: true },
      { id: "evt-new-8", name: "龍江/龍祥11F~15F管道間防火檢修口", value: 300000, type: "expense", monthOffset: 7, active: true },
      { id: "evt-new-9", name: "B1/B2/B3 防火泥填塞工程", value: 250000, type: "expense", monthOffset: 8, active: true },
      { id: "evt-new-10", name: "安全門下方門檻剷平及順平工程", value: 40000, type: "expense", monthOffset: 5, active: true },
      { id: "evt-new-11", name: "機車停車格劃設與編號分配", value: 40000, type: "expense", monthOffset: 5, active: true },
      { id: "evt-new-12", name: "管理室門窗紗窗及遮光窗簾(西曬改善)", value: 2000, type: "expense", monthOffset: 1, active: true },
      { id: "evt-new-13", name: "評估管理室窗戶外推小平台可行性", value: 2000, type: "expense", monthOffset: 1, active: true },
      { id: "evt-new-14", name: "B2授信總機室門配鎖管理", value: 1000, type: "expense", monthOffset: 1, active: true },
      { id: "evt-new-15", name: "B1漏水處理(連續壁漏水損害B2/B3牆)", value: 2000000, type: "expense", monthOffset: 10, active: true }, // Active in crisis!
      { id: "evt-new-16", name: "慶泰-龍祥花台與出入口空鼓地磚重鋪", value: 50000, type: "expense", monthOffset: 6, active: true }
    ]
  },
  healthy: {
    name: "健全情境 (管理費調漲10% & 催收成功)",
    balances: {
      currentAccount: 441332,
      publicReserve: 0
    },
    collectionRate: 98, // Great collection
    adjustmentRate: 10, // 10% Increase
    adminCostMultiplier: 1.0,
    safetyLine: 0,
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
      { id: "evt-b1-recover", name: "追回 B1 商場積欠管理費", value: 200000, type: "income", monthOffset: 4, active: true },
      { id: "evt-elevator-tail", name: "龍祥電梯系統更新尾款50%", value: 165000, type: "expense", monthOffset: 6, active: true },
      { id: "evt-sewer-clean", name: "水塔清洗與化糞池清理", value: 25000, type: "expense", monthOffset: 3, active: true },
      { id: "evt-new-1", name: "11F~15F消防灑水測試(機組送電)", value: 80000, type: "expense", monthOffset: 2, active: true },
      { id: "evt-new-2", name: "B2授信總機迴路未連接查修工程", value: 4500, type: "expense", monthOffset: 3, active: true },
      { id: "evt-new-3", name: "B3消防室泡沫機組控制異常檢修", value: 12000, type: "expense", monthOffset: 2, active: true },
      { id: "evt-new-4", name: "B3第69車位廢水池右泵浦逆止閥修復", value: 14000, type: "expense", monthOffset: 3, active: true },
      { id: "evt-new-5", name: "B3龍江3號防火門鏽蝕更新", value: 40000, type: "expense", monthOffset: 4, active: true },
      { id: "evt-new-6", name: "龍祥大門上方採光罩破損更新", value: 35000, type: "expense", monthOffset: 4, active: true },
      { id: "evt-new-7", name: "車道鐵板發出聲響夜間擾民改善工程", value: 1000, type: "expense", monthOffset: 1, active: true },
      { id: "evt-new-8", name: "龍江/龍祥11F~15F管道間防火檢修口", value: 300000, type: "expense", monthOffset: 7, active: true },
      { id: "evt-new-9", name: "B1/B2/B3 防火泥填塞工程", value: 250000, type: "expense", monthOffset: 8, active: true },
      { id: "evt-new-10", name: "安全門下方門檻剷平及順平工程", value: 40000, type: "expense", monthOffset: 5, active: true },
      { id: "evt-new-11", name: "機車停車格劃設與編號分配", value: 40000, type: "expense", monthOffset: 5, active: true },
      { id: "evt-new-12", name: "管理室門窗紗窗及遮光窗簾(西曬改善)", value: 2000, type: "expense", monthOffset: 1, active: true },
      { id: "evt-new-13", name: "評估管理室窗戶外推小平台可行性", value: 2000, type: "expense", monthOffset: 1, active: true },
      { id: "evt-new-14", name: "B2授信總機室門配鎖管理", value: 1000, type: "expense", monthOffset: 1, active: true },
      { id: "evt-new-15", name: "B1漏水處理(連續壁漏水損害B2/B3牆)", value: 2000000, type: "expense", monthOffset: 10, active: false }, // Inactive in healthy
      { id: "evt-new-16", name: "慶泰-龍祥花台與出入口空鼓地磚重鋪", value: 50000, type: "expense", monthOffset: 6, active: true }
    ]
  }
};

// --- Application State ---
let state = {
  theme: 'dark',
  balances: {
    currentAccount: 441332,
    publicReserve: 0
  },
  monthsToSimulate: 12, // Default to 12 months
  safetyLine: 0,
  whatIfParams: [], // Dynamic parameter sliders array
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
  const monthsToSimulate = state.monthsToSimulate || 12;
  const data = [];
  
  let currentCash = state.balances.currentAccount;
  let currentReserve = state.balances.publicReserve;
  
  for (let m = 1; m <= monthsToSimulate; m++) {
    // 1. Calculate Monthly Income
    let monthlyIncome = 0;
    state.recurringIncome.forEach(item => {
      let multiplier = 1;
      
      if (item.category === 'management_fee') {
        // Management fee collection
        let collectionRate = 95;
        const collectionParam = state.whatIfParams.find(p => p.target === 'management_fee_collection');
        if (collectionParam) collectionRate = collectionParam.value;
        
        // Management fee rate adjustment
        let adjRate = 0;
        const adjParam = state.whatIfParams.find(p => p.target === 'management_fee_rate');
        if (adjParam) adjRate = adjParam.value;
        
        // Any custom multipliers affecting management_fee or all_income
        state.whatIfParams.forEach(p => {
          if (p.id !== 'param-collection' && p.id !== 'param-fee-adj') {
            if (p.target === 'management_fee' || p.target === 'all_income') {
              multiplier *= (p.value / 100);
            }
          }
        });
        
        const rawFee = item.value;
        const adjustedFee = rawFee * (1 + adjRate / 100);
        const collectedFee = adjustedFee * (collectionRate / 100) * multiplier;
        monthlyIncome += collectedFee;
      } else {
        // Apply parameters that target this category or all_income
        state.whatIfParams.forEach(p => {
          if (p.target === item.category || p.target === 'all_income') {
            multiplier *= (p.value / 100);
          }
        });
        monthlyIncome += item.value * multiplier;
      }
    });
    
    // 2. Calculate Monthly Expense
    let monthlyExpense = 0;
    state.recurringExpenses.forEach(item => {
      // Lease payment "昕保租賃(新光監視器)" is 12 periods, assume it ends after month 10 (as it was second period in March 115)
      if (item.id === 'exp-8' && m > 10) {
        return; 
      }
      
      let multiplier = 1;
      state.whatIfParams.forEach(p => {
        if (p.target === item.category || p.target === 'all_expenses') {
          multiplier *= (p.value / 100);
        }
      });
      
      monthlyExpense += item.value * multiplier;
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
      label: getMonthLabels(0, monthsToSimulate)[m-1],
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
  let totalPersonnelExpense = 0;
  results.forEach(r => {
    let monthlyPersonnel = 0;
    state.recurringExpenses.forEach(item => {
      if (item.category === 'personnel') {
        let multiplier = 1;
        state.whatIfParams.forEach(p => {
          if (p.target === 'personnel' || p.target === 'all_expenses') {
            multiplier *= (p.value / 100);
          }
        });
        monthlyPersonnel += item.value * multiplier;
      }
    });
    totalPersonnelExpense += monthlyPersonnel;
  });
  
  const annualPersonnelExpense = (totalPersonnelExpense / state.monthsToSimulate) * 12;
  
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
  renderSimulationDetailsTable(results);
}

function renderChart(results) {
  const ctx = document.getElementById('cashflowChartCanvas').getContext('2d');
  
  const labels = results.map(r => r.label);
  const totalAssetsData = results.map(r => r.totalAssets);
  const currentCashData = results.map(r => r.endingCash);
  const reserveCashData = results.map(r => r.endingReserve);
  const netFlowData = results.map(r => r.netFlow);
  
  // Create safety line datasets
  const safetyLineData = Array(results.length).fill(state.safetyLine);
  
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
  state.monthsToSimulate = preset.monthsToSimulate || 12;
  state.safetyLine = preset.safetyLine ?? 500000;
  
  // Initialize default whatIfParams dynamically from preset
  state.whatIfParams = [
    { id: 'param-collection', name: '管理費實質收繳率', target: 'management_fee_collection', min: 50, max: 100, default: 95, value: preset.collectionRate ?? 95, unit: '%' },
    { id: 'param-fee-adj', name: '管理費收費標準調整', target: 'management_fee_rate', min: -20, max: 50, default: 0, value: preset.adjustmentRate ?? 0, unit: '%' },
    { id: 'param-admin-multi', name: '行政與總幹事薪資乘數', target: 'personnel', min: 80, max: 150, default: 100, value: Math.round((preset.adminCostMultiplier ?? 1.0) * 100), unit: '%' }
  ];
  
  if (preset.whatIfParams) {
    state.whatIfParams = JSON.parse(JSON.stringify(preset.whatIfParams));
  }
  
  state.recurringIncome = JSON.parse(JSON.stringify(preset.recurringIncome));
  state.recurringExpenses = JSON.parse(JSON.stringify(preset.recurringExpenses));
  state.specialEvents = JSON.parse(JSON.stringify(preset.specialEvents));
  
  syncStateToInputs();
  renderIncomeTable();
  renderExpenseTable();
  renderWhatIfSliders();
  renderEventsTimeline();
  updateEventMonthDropdown();
  updateDashboard();
  showToast(`已載入預設案: ${preset.name}`, 'success');
}

function syncStateToInputs() {
  document.getElementById('input-current-balance').value = state.balances.currentAccount;
  document.getElementById('input-reserve-balance').value = state.balances.publicReserve;
  document.getElementById('input-safety-line').value = state.safetyLine;
  document.getElementById('select-simulate-months').value = state.monthsToSimulate || 12;
}

function updateEventMonthDropdown() {
  const select = document.getElementById('input-event-month');
  if (!select) return;
  select.innerHTML = '';
  const labels = getMonthLabels(0, state.monthsToSimulate);
  for (let i = 1; i <= state.monthsToSimulate; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.text = `第 ${i} 個月 (${labels[i - 1]})`;
    select.appendChild(option);
  }
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
  
  const monthsToSimulate = state.monthsToSimulate || 12;
  const monthLabels = getMonthLabels(0, monthsToSimulate);
  
  for (let m = 1; m <= monthsToSimulate; m++) {
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
               data-id="${evt.id}"
               onclick="openEditEventModal('${evt.id}')">
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
      if (idx !== -1 && targetMonth >= 1 && targetMonth <= state.monthsToSimulate) {
        state.specialEvents[idx].monthOffset = targetMonth;
        renderEventsTimeline();
        updateDashboard();
        showToast(`已移動項目至 ${getMonthLabels(0, state.monthsToSimulate)[targetMonth - 1]}`, 'success');
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

// --- Dynamic What-If Sliders Handling ---
function renderWhatIfSliders() {
  const container = document.getElementById('whatif-sliders-container');
  if (!container) return;
  container.innerHTML = '';
  
  state.whatIfParams.forEach(p => {
    const div = document.createElement('div');
    div.className = 'slider-group';
    
    let valStr = `${p.value}%`;
    if (p.target === 'management_fee_rate' && p.value >= 0) {
      valStr = `+${p.value}%`;
    }
    
    div.innerHTML = `
      <div class="slider-header">
        <div class="slider-header-left">
          <button class="slider-delete-btn" onclick="deleteWhatIfParam('${p.id}')" title="刪除此參數">
            <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
          </button>
          <span>${p.name}</span>
        </div>
        <span class="slider-val" id="val-slider-${p.id}">${valStr}</span>
      </div>
      <input type="range" class="slider-control whatif-slider" 
             data-id="${p.id}" 
             min="${p.min}" 
             max="${p.max}" 
             value="${p.value}">
      <div class="slider-labels">
        <span>${p.min}%</span>
        <span>${p.default}% (預設)</span>
        <span>${p.max}%</span>
      </div>
    `;
    container.appendChild(div);
  });
  
  // Bind dynamic sliders event
  container.querySelectorAll('.whatif-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const id = e.target.getAttribute('data-id');
      const val = parseInt(e.target.value);
      
      const idx = state.whatIfParams.findIndex(p => p.id === id);
      if (idx !== -1) {
        state.whatIfParams[idx].value = val;
        
        const p = state.whatIfParams[idx];
        let valStr = `${val}%`;
        if (p.target === 'management_fee_rate' && val >= 0) {
          valStr = `+${val}%`;
        }
        document.getElementById(`val-slider-${p.id}`).innerText = valStr;
        
        updateDashboard();
      }
    });
  });
  
  lucide.createIcons();
}

function deleteWhatIfParam(id) {
  state.whatIfParams = state.whatIfParams.filter(p => p.id !== id);
  renderWhatIfSliders();
  updateDashboard();
  showToast('已刪除調校參數', 'warning');
}

function openAddWhatIfModal() {
  const modal = document.getElementById('modal-add-whatif');
  document.getElementById('input-whatif-name').value = '';
  document.getElementById('input-whatif-min').value = '50';
  document.getElementById('input-whatif-max').value = '150';
  document.getElementById('input-whatif-default').value = '100';
  modal.classList.add('active');
}

function closeAddWhatIfModal() {
  document.getElementById('modal-add-whatif').classList.remove('active');
}

function submitAddWhatIf() {
  const name = document.getElementById('input-whatif-name').value.trim();
  const target = document.getElementById('input-whatif-target').value;
  const min = parseInt(document.getElementById('input-whatif-min').value) || 0;
  const max = parseInt(document.getElementById('input-whatif-max').value) || 200;
  const defaultValue = parseInt(document.getElementById('input-whatif-default').value) || 100;
  
  if (!name) {
    showToast('請輸入參數名稱', 'warning');
    return;
  }
  
  const newParam = {
    id: `param-custom-${Date.now()}`,
    name: name,
    target: target,
    min: min,
    max: max,
    default: defaultValue,
    value: defaultValue
  };
  
  state.whatIfParams.push(newParam);
  renderWhatIfSliders();
  closeAddWhatIfModal();
  updateDashboard();
  showToast('已新增自訂財務參數', 'success');
}

// --- Scenario Management ---
function renderScenarios() {
  const container = document.getElementById('scenarios-container');
  container.innerHTML = '';
  
  for (let i = 0; i < 3; i++) {
    const sc = state.scenarios[i];
    if (sc) {
      const collectionParam = sc.state.whatIfParams ? sc.state.whatIfParams.find(p => p.target === 'management_fee_collection') : null;
      const adjParam = sc.state.whatIfParams ? sc.state.whatIfParams.find(p => p.target === 'management_fee_rate') : null;
      const collectionVal = collectionParam ? collectionParam.value : 95;
      const adjVal = adjParam ? adjParam.value : 0;
      
      const div = document.createElement('div');
      div.className = `scenario-item ${sc.compared ? 'active' : ''}`;
      div.innerHTML = `
        <div>
          <h5>${sc.name}</h5>
          <p class="scenario-desc">預測期數: ${sc.state.monthsToSimulate || 12}月 | 收繳: ${collectionVal}% | 調幅: ${adjVal}% | 安全線: ${formatCurrency(sc.state.safetyLine)}</p>
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
      monthsToSimulate: state.monthsToSimulate,
      safetyLine: state.safetyLine,
      whatIfParams: state.whatIfParams,
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
  state.monthsToSimulate = sc.state.monthsToSimulate || 12;
  state.safetyLine = sc.state.safetyLine ?? 500000;
  
  if (sc.state.whatIfParams) {
    state.whatIfParams = JSON.parse(JSON.stringify(sc.state.whatIfParams));
  } else {
    state.whatIfParams = [
      { id: 'param-collection', name: '管理費實質收繳率', target: 'management_fee_collection', min: 50, max: 100, default: 95, value: sc.state.collectionRate ?? 95, unit: '%' },
      { id: 'param-fee-adj', name: '管理費收費標準調整', target: 'management_fee_rate', min: -20, max: 50, default: 0, value: sc.state.adjustmentRate ?? 0, unit: '%' },
      { id: 'param-admin-multi', name: '行政與總幹事薪資乘數', target: 'personnel', min: 80, max: 150, default: 100, value: Math.round((sc.state.adminCostMultiplier ?? 1.0) * 100), unit: '%' }
    ];
  }
  
  state.recurringIncome = JSON.parse(JSON.stringify(sc.state.recurringIncome));
  state.recurringExpenses = JSON.parse(JSON.stringify(sc.state.recurringExpenses));
  state.specialEvents = JSON.parse(JSON.stringify(sc.state.specialEvents));
  
  syncStateToInputs();
  renderIncomeTable();
  renderExpenseTable();
  renderWhatIfSliders();
  renderEventsTimeline();
  updateEventMonthDropdown();
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
  document.getElementById('modal-event-header-title').innerText = type === 'income' ? '新增重大單次收入' : '新增重大單次支出';
  document.getElementById('input-event-id').value = '';
  document.getElementById('input-event-name').value = '';
  document.getElementById('input-event-value').value = '';
  document.getElementById('input-event-type').value = type;
  document.getElementById('input-event-month').value = month;
  modal.classList.add('active');
}

function openEditEventModal(id) {
  const evt = state.specialEvents.find(x => x.id === id);
  if (!evt) return;
  
  const modal = document.getElementById('modal-add-event');
  document.getElementById('modal-event-header-title').innerText = '編輯重大項目 / 調整時程';
  document.getElementById('input-event-id').value = evt.id;
  document.getElementById('input-event-name').value = evt.name;
  document.getElementById('input-event-value').value = evt.value;
  document.getElementById('input-event-type').value = evt.type;
  document.getElementById('input-event-month').value = evt.monthOffset;
  modal.classList.add('active');
}

function closeAddEventModal() {
  document.getElementById('modal-add-event').classList.remove('active');
}

function submitAddEvent() {
  const id = document.getElementById('input-event-id').value;
  const name = document.getElementById('input-event-name').value.trim();
  const value = parseFloat(document.getElementById('input-event-value').value) || 0;
  const type = document.getElementById('input-event-type').value;
  const monthOffset = parseInt(document.getElementById('input-event-month').value) || 1;
  
  if (!name) {
    showToast('請輸入項目名稱', 'warning');
    return;
  }
  
  if (id) {
    // Edit Mode
    const idx = state.specialEvents.findIndex(x => x.id === id);
    if (idx !== -1) {
      state.specialEvents[idx].name = name;
      state.specialEvents[idx].value = value;
      state.specialEvents[idx].type = type;
      state.specialEvents[idx].monthOffset = monthOffset;
      showToast('項目已更新', 'success');
    }
  } else {
    // Add Mode
    const newEvent = {
      id: `evt-${Date.now()}`,
      name: name,
      value: value,
      type: type,
      monthOffset: monthOffset,
      active: true
    };
    state.specialEvents.push(newEvent);
    showToast('已加入時間軸', 'success');
  }
  
  renderEventsTimeline();
  closeAddEventModal();
  updateDashboard();
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
    monthsToSimulate: state.monthsToSimulate,
    safetyLine: state.safetyLine,
    whatIfParams: state.whatIfParams,
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
        state.monthsToSimulate = imported.monthsToSimulate ?? 12;
        state.safetyLine = imported.safetyLine ?? 500000;
        
        if (imported.whatIfParams) {
          state.whatIfParams = imported.whatIfParams;
        } else {
          state.whatIfParams = [
            { id: 'param-collection', name: '管理費實質收繳率', target: 'management_fee_collection', min: 50, max: 100, default: 95, value: imported.collectionRate ?? 95, unit: '%' },
            { id: 'param-fee-adj', name: '管理費收費標準調整', target: 'management_fee_rate', min: -20, max: 50, default: 0, value: imported.adjustmentRate ?? 0, unit: '%' },
            { id: 'param-admin-multi', name: '行政與總幹事薪資乘數', target: 'personnel', min: 80, max: 150, default: 100, value: Math.round((imported.adminCostMultiplier ?? 1.0) * 100), unit: '%' }
          ];
        }
        
        state.recurringIncome = imported.recurringIncome;
        state.recurringExpenses = imported.recurringExpenses;
        state.specialEvents = imported.specialEvents ?? [];
        
        syncStateToInputs();
        renderIncomeTable();
        renderExpenseTable();
        renderWhatIfSliders();
        renderEventsTimeline();
        updateEventMonthDropdown();
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
  
  // 4. Listen to Predict Months select
  document.getElementById('select-simulate-months').addEventListener('change', (e) => {
    state.monthsToSimulate = parseInt(e.target.value);
    updateDashboard();
    renderEventsTimeline();
    updateEventMonthDropdown();
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

// --- Detail Table Rendering ---
function renderSimulationDetailsTable(results) {
  const tbody = document.querySelector('#table-simulation-details tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  results.forEach(r => {
    const m = r.month;
    const label = r.label;
    
    // 1. Recurring Incomes
    state.recurringIncome.forEach(item => {
      let multiplier = 1;
      let finalVal = 0;
      
      if (item.category === 'management_fee') {
        let collectionRate = 95;
        const collectionParam = state.whatIfParams.find(p => p.target === 'management_fee_collection');
        if (collectionParam) collectionRate = collectionParam.value;
        
        let adjRate = 0;
        const adjParam = state.whatIfParams.find(p => p.target === 'management_fee_rate');
        if (adjParam) adjRate = adjParam.value;
        
        state.whatIfParams.forEach(p => {
          if (p.id !== 'param-collection' && p.id !== 'param-fee-adj') {
            if (p.target === 'management_fee' || p.target === 'all_income') {
              multiplier *= (p.value / 100);
            }
          }
        });
        
        const rawFee = item.value;
        const adjustedFee = rawFee * (1 + adjRate / 100);
        finalVal = adjustedFee * (collectionRate / 100) * multiplier;
      } else {
        state.whatIfParams.forEach(p => {
          if (p.target === item.category || p.target === 'all_income') {
            multiplier *= (p.value / 100);
          }
        });
        finalVal = item.value * multiplier;
      }
      
      if (finalVal > 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${label}</td>
          <td><span class="text-success">[經常性收入]</span> ${item.name}</td>
          <td class="text-amount-income">+${formatCurrency(finalVal)}</td>
        `;
        tbody.appendChild(tr);
      }
    });
    
    // 2. Special Event Incomes (Major Incomes)
    const activeIncomeEvents = state.specialEvents.filter(e => e.active && e.type === 'income' && parseInt(e.monthOffset) === m);
    activeIncomeEvents.forEach(evt => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${label}</td>
        <td><span class="text-success">[單次重大收入]</span> ${evt.name}</td>
        <td class="text-amount-income">+${formatCurrency(evt.value)}</td>
      `;
      tbody.appendChild(tr);
    });
    
    // 3. Recurring Expenses
    state.recurringExpenses.forEach(item => {
      if (item.id === 'exp-8' && m > 10) {
        return; 
      }
      
      let multiplier = 1;
      state.whatIfParams.forEach(p => {
        if (p.target === item.category || p.target === 'all_expenses') {
          multiplier *= (p.value / 100);
        }
      });
      
      const finalVal = item.value * multiplier;
      
      if (finalVal > 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${label}</td>
          <td><span class="text-danger">[經常性支出]</span> ${item.name}</td>
          <td class="text-amount-expense">-${formatCurrency(finalVal)}</td>
        `;
        tbody.appendChild(tr);
      }
    });
    
    // 4. Special Event Expenses (Major Repairs/Projects)
    const activeExpenseEvents = state.specialEvents.filter(e => e.active && e.type === 'expense' && parseInt(e.monthOffset) === m);
    activeExpenseEvents.forEach(evt => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${label}</td>
        <td><span class="text-danger">[單次重大支出]</span> ${evt.name}</td>
        <td class="text-amount-expense">-${formatCurrency(evt.value)}</td>
      `;
      tbody.appendChild(tr);
    });
    
    // 5. Monthly Summary Row
    const summaryTr = document.createElement('tr');
    summaryTr.className = 'month-divider-row';
    const netFlowStr = r.netFlow >= 0 ? `+${formatCurrency(r.netFlow)}` : `-${formatCurrency(Math.abs(r.netFlow))}`;
    const netFlowClass = r.netFlow >= 0 ? 'text-amount-income' : 'text-amount-expense';
    summaryTr.innerHTML = `
      <td>${label} (月結)</td>
      <td><strong>當月收支相抵：<span class="${netFlowClass}">${netFlowStr}</span></strong> | 期末活存：${formatCurrency(r.endingCash)} | 公積金定存：${formatCurrency(r.endingReserve)}</td>
      <td><strong>總資產：${formatCurrency(r.totalAssets)}</strong></td>
    `;
    tbody.appendChild(summaryTr);
  });
}

