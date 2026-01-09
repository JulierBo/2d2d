document.addEventListener('DOMContentLoaded', function() {
    // ဒေတာသိုလှောင်ရန်
    let namesData = [
        { id: 1, name: "ဦးကျော်မြင့်", multiplier: 8 },
        { id: 2, name: "မောင်မျိုးအောင်", multiplier: 9 },
        { id: 3, name: "ဒေါ်စန်းစန်း", multiplier: 8 }
    ];
    
    let betsData = [
        // နမူနာဒေတာ
        { id: 1, personId: 1, personName: "ဦးကျော်မြင့်", number: "1", type: "front", amount: 1000, multiplier: 8, date: new Date().toISOString() },
        { id: 2, personId: 1, personName: "ဦးကျော်မြင့်", number: "15", type: "apa", amount: 500, multiplier: 8, date: new Date().toISOString() },
        { id: 3, personId: 2, personName: "မောင်မျိုးအောင်", number: "5", type: "back", amount: 2000, multiplier: 9, date: new Date().toISOString() },
        { id: 4, personId: 2, personName: "မောင်မျိုးအောင်", number: "25", type: "apa", amount: 1500, multiplier: 9, date: new Date().toISOString() },
        { id: 5, personId: 3, personName: "ဒေါ်စန်းစန်း", number: "11", type: "double", amount: 3000, multiplier: 8, date: new Date().toISOString() },
        { id: 6, personId: 3, personName: "ဒေါ်စန်းစန်း", number: "36", type: "apa", amount: 1200, multiplier: 8, date: new Date().toISOString() },
        { id: 7, personId: 1, personName: "ဦးကျော်မြင့်", number: "12", type: "single", amount: 800, multiplier: 8, date: new Date().toISOString() }
    ];
    
    let winningNumbers = {
        front: null,
        back: null,
        double: null
    };
    
    let selectedPersonId = null;
    let currentBetType = "single"; // single, front, back, double, apa
    let selectedNumber = "";
    
    // DOM Elements
    const nameList = document.getElementById('nameList');
    const tableBody = document.getElementById('tableBody');
    const totalBetAmount = document.getElementById('totalBetAmount');
    const totalWinAmount = document.getElementById('totalWinAmount');
    const netAmount = document.getElementById('netAmount');
    const currentDateTime = document.getElementById('currentDateTime');
    const resultDate = document.getElementById('resultDate');
    const addNameModal = document.getElementById('addNameModal');
    const detailModal = document.getElementById('detailModal');
    const addNameBtn = document.getElementById('addNameBtn');
    const saveNewNameBtn = document.getElementById('saveNewNameBtn');
    const modalClose = document.querySelectorAll('.modal-close');
    const cancelBtn = document.querySelector('.btn-cancel');
    const clearNamesBtn = document.getElementById('clearNamesBtn');
    const exportBtn = document.getElementById('exportBtn');
    const numberButtons = document.querySelectorAll('.number-btn');
    const deleteBtn = document.getElementById('deleteBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const frontBtn = document.getElementById('frontBtn');
    const backBtn = document.getElementById('backBtn');
    const doubleBtn = document.getElementById('doubleBtn');
    const apaBtn = document.getElementById('apaBtn');
    const singleBtn = document.getElementById('singleBtn');
    const frontResult = document.getElementById('frontResult');
    const backResult = document.getElementById('backResult');
    const doubleResult = document.getElementById('doubleResult');
    const setResultBtn = document.getElementById('setResultBtn');
    const clearResultBtn = document.getElementById('clearResultBtn');
    const resultStatus = document.getElementById('resultStatus');
    const tableTypeSelect = document.getElementById('tableTypeSelect');
    const refreshBtn = document.getElementById('refreshBtn');
    const betAmount = document.getElementById('betAmount');
    const multiplierInput = document.getElementById('multiplier');
    const multiplierInfo = document.getElementById('multiplierInfo');
    const currentSelectionText = document.getElementById('currentSelectionText');
    const currentBetTypeText = document.getElementById('currentBetTypeText');
    const quickSetButtons = document.querySelectorAll('.btn-quick-set');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const detailName = document.getElementById('detailName');
    const detailTotalBet = document.getElementById('detailTotalBet');
    const detailTotalWin = document.getElementById('detailTotalWin');
    const detailNetAmount = document.getElementById('detailNetAmount');
    const detailTableBody = document.getElementById('detailTableBody');
    const winnersSummary = document.getElementById('winnersSummary');
    
    // မူလဒေတာများကို သိမ်းဆည်းရန်
    function saveDataToLocalStorage() {
        localStorage.setItem('kkuser2d_names', JSON.stringify(namesData));
        localStorage.setItem('kkuser2d_bets', JSON.stringify(betsData));
        localStorage.setItem('kkuser2d_winningNumbers', JSON.stringify(winningNumbers));
    }
    
    // ဒေတာများကို ပြန်လည်ရယူရန်
    function loadDataFromLocalStorage() {
        const savedNames = localStorage.getItem('kkuser2d_names');
        const savedBets = localStorage.getItem('kkuser2d_bets');
        const savedWinningNumbers = localStorage.getItem('kkuser2d_winningNumbers');
        
        if (savedNames) namesData = JSON.parse(savedNames);
        if (savedBets) betsData = JSON.parse(savedBets);
        if (savedWinningNumbers) winningNumbers = JSON.parse(savedWinningNumbers);
        
        // ပေါက်ဂဏန်းများကို ပြသရန်
        if (winningNumbers.front !== null) frontResult.value = winningNumbers.front;
        if (winningNumbers.back !== null) backResult.value = winningNumbers.back;
        if (winningNumbers.double !== null) doubleResult.value = winningNumbers.double;
        
        // ပေါက်ဂဏန်းအခြေအနေကို အပ်ဒိတ်လုပ်ရန်
        updateResultStatus();
    }
    
    // ပေါက်ဂဏန်းအခြေအနေကို အပ်ဒိတ်လုပ်ရန်
    function updateResultStatus() {
        if (!winningNumbers.front && !winningNumbers.back && !winningNumbers.double) {
            resultStatus.textContent = "ပေါက်ဂဏန်း မသတ်မှတ်ရသေး";
            resultStatus.style.color = "#f39c12";
        } else {
            let statusText = "";
            if (winningNumbers.front) statusText += `ထိပ်: ${winningNumbers.front} `;
            if (winningNumbers.back) statusText += `နောက်: ${winningNumbers.back} `;
            if (winningNumbers.double) statusText += `အပူး: ${winningNumbers.double}`;
            resultStatus.textContent = statusText;
            resultStatus.style.color = "#2ecc71";
        }
    }
    
    // နာမည်စာရင်းကို ပြသရန်
    function renderNames() {
        nameList.innerHTML = '';
        
        if (namesData.length === 0) {
            nameList.innerHTML = `
                <div class="name-item" style="justify-content: center; color: #aaa; font-style: italic; padding: 20px;">
                    နာမည်စာရင်း မရှိပါ။ အသစ်ထည့်ပါ။
                </div>
            `;
            return;
        }
        
        namesData.forEach((person) => {
            // ဤသူအတွက် စုစုပေါင်းထိုးငွေကို တွက်ချက်ရန်
            const personBets = betsData.filter(bet => bet.personId === person.id);
            const totalBet = personBets.reduce((sum, bet) => sum + bet.amount, 0);
            
            const nameItem = document.createElement('div');
            nameItem.className = `name-item ${selectedPersonId === person.id ? 'active' : ''}`;
            nameItem.innerHTML = `
                <div class="name-text">${person.name}</div>
                <div class="name-stats">${totalBet.toLocaleString()} ကျပ် (${person.multiplier}ဆ)</div>
                <div class="name-actions">
                    <button class="btn-name-action btn-view" data-id="${person.id}">
                        <i class="fas fa-eye"></i> ကြည့်မည်
                    </button>
                    <button class="btn-name-action btn-delete" data-id="${person.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            nameList.appendChild(nameItem);
            
            // နာမည်ကို နှိပ်လျှင် ရွေးချယ်ရန်
            nameItem.addEventListener('click', function(e) {
                if (!e.target.closest('.name-actions')) {
                    selectedPersonId = person.id;
                    
                    // ရွေးထားသော လူ၏ အဆကို ပြသရန်
                    const selectedPerson = namesData.find(p => p.id === selectedPersonId);
                    if (selectedPerson) {
                        multiplierInput.value = selectedPerson.multiplier;
                        multiplierInfo.textContent = `${selectedPerson.multiplier}ဆ`;
                    }
                    
                    renderNames();
                    updateCurrentSelection();
                }
            });
        });
        
        // ကြည့်ရန် ခလုတ်များ
        document.querySelectorAll('.btn-view').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const personId = parseInt(this.getAttribute('data-id'));
                viewPersonDetails(personId);
            });
        });
        
        // ဖျက်ရန် ခလုတ်များ
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const personId = parseInt(this.getAttribute('data-id'));
                deleteName(personId);
            });
        });
    }
    
    // စာရင်းဇယားကို ပြသရန်
    function renderTable(tableType = "all") {
        tableBody.innerHTML = '';
        
        // ပေါက်သူများစာရင်းကို ရှင်းလင်းရန်
        winnersSummary.innerHTML = '';
        
        // စာရင်းဇယားအတွက် ဒေတာများကို စီရန်
        let tableData = [];
        
        if (tableType === "all") {
            tableData = [...betsData];
        } else {
            tableData = betsData.filter(bet => bet.type === tableType);
        }
        
        if (tableData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; color: #aaa; font-style: italic; padding: 30px;">
                        ${tableType === "all" ? "စာရင်းများ မရှိပါ။" : getBetTypeText(tableType) + " စာရင်းများ မရှိပါ။"}
                    </td>
                </tr>
            `;
            return;
        }
        
        // ရလဒ်တွက်ချက်ရန်
        const winningFront = winningNumbers.front;
        const winningBack = winningNumbers.back;
        const winningDouble = winningNumbers.double;
        
        tableData.forEach((bet) => {
            const row = document.createElement('tr');
            
            // ရလဒ်တွက်ချက်ရန်
            let result = "စောင့်ဆိုင်း";
            let winAmount = 0;
            let isWin = false;
            let resultClass = "waiting-cell";
            
            // ပေါက်ဂဏန်းသတ်မှတ်ထားပါက တွက်ချက်ရန်
            if (winningFront || winningBack || winningDouble) {
                if (bet.type === "front" && winningFront === bet.number) {
                    result = "ပေါက်ပါသည်";
                    winAmount = bet.amount * bet.multiplier;
                    isWin = true;
                    resultClass = "win-cell";
                    
                    // ပေါက်သူများစာရင်းတွင် ထည့်ရန်
                    addToWinnersList(bet.personName, winAmount, `${bet.number}ထိပ်`);
                } else if (bet.type === "back" && winningBack === bet.number) {
                    result = "ပေါက်ပါသည်";
                    winAmount = bet.amount * bet.multiplier;
                    isWin = true;
                    resultClass = "win-cell";
                    
                    // ပေါက်သူများစာရင်းတွင် ထည့်ရန်
                    addToWinnersList(bet.personName, winAmount, `${bet.number}နောက်`);
                } else if (bet.type === "double" && winningDouble === bet.number) {
                    result = "ပေါက်ပါသည်";
                    winAmount = bet.amount * bet.multiplier;
                    isWin = true;
                    resultClass = "win-cell";
                    
                    // ပေါက်သူများစာရင်းတွင် ထည့်ရန်
                    addToWinnersList(bet.personName, winAmount, `${bet.number}`);
                } else if (bet.type === "single") {
                    // တစ်လုံးချင်းအတွက် ရလဒ်တွက်ချက်ရန်
                    if (winningFront && winningBack) {
                        const combinedNumber = winningFront + winningBack;
                        if (bet.number === combinedNumber) {
                            result = "ပေါက်ပါသည်";
                            winAmount = bet.amount * bet.multiplier;
                            isWin = true;
                            resultClass = "win-cell";
                            
                            // ပေါက်သူများစာရင်းတွင် ထည့်ရန်
                            addToWinnersList(bet.personName, winAmount, `${bet.number}`);
                        } else {
                            result = "မပေါက်ပါ";
                            resultClass = "loss-cell";
                        }
                    }
                } else if (bet.type === "apa") {
                    // အပါအတွက် ရလဒ်တွက်ချက်ရန်
                    if (winningBack) {
                        const lastDigit = bet.number.slice(-1);
                        if (winningBack === lastDigit) {
                            result = "ပေါက်ပါသည်";
                            winAmount = bet.amount * bet.multiplier;
                            isWin = true;
                            resultClass = "win-cell";
                            
                            // ပေါက်သူများစာရင်းတွင် ထည့်ရန်
                            addToWinnersList(bet.personName, winAmount, `${bet.number}အပါ`);
                        } else {
                            result = "မပေါက်ပါ";
                            resultClass = "loss-cell";
                        }
                    }
                } else {
                    result = "မပေါက်ပါ";
                    resultClass = "loss-cell";
                }
            }
            
            const netResult = winAmount - bet.amount;
            
            row.innerHTML = `
                <td>${bet.personName}</td>
                <td>${formatNumberDisplay(bet.number, bet.type)}</td>
                <td>${getBetTypeText(bet.type)}</td>
                <td>${bet.multiplier}ဆ</td>
                <td>${bet.amount.toLocaleString()} ကျပ်</td>
                <td class="${resultClass}">${result}</td>
                <td>${winAmount > 0 ? winAmount.toLocaleString() + " ကျပ်" : "-"}</td>
                <td class="${netResult >= 0 ? 'net-win' : 'net-loss'}">${netResult >= 0 ? '+' : ''}${netResult.toLocaleString()} ကျပ်</td>
            `;
            tableBody.appendChild(row);
        });
        
        updateTotals();
        updateSpecialTables();
    }
    
    // ပေါက်သူများစာရင်းတွင် ထည့်ရန်
    function addToWinnersList(personName, winAmount, betInfo) {
        // ဤသူအတွက် ရှိပြီးသားလားစစ်ရန်
        let existingWinner = null;
        const winnerItems = winnersSummary.querySelectorAll('.winner-item');
        
        winnerItems.forEach(item => {
            const nameElement = item.querySelector('.winner-name');
            if (nameElement && nameElement.textContent.includes(personName)) {
                existingWinner = item;
            }
        });
        
        if (existingWinner) {
            // ရှိပြီးသားဆိုရင် စုစုပေါင်းထည့်ရန်
            const amountElement = existingWinner.querySelector('.winner-amount');
            const currentAmount = parseInt(amountElement.textContent.replace(/[^0-9]/g, ''));
            const newAmount = currentAmount + winAmount;
            amountElement.textContent = `${newAmount.toLocaleString()} ကျပ်`;
        } else {
            // အသစ်ထည့်ရန်
            const winnerItem = document.createElement('div');
            winnerItem.className = 'winner-item';
            winnerItem.innerHTML = `
                <div class="winner-name">${personName}</div>
                <div class="winner-amount">${winAmount.toLocaleString()} ကျပ်</div>
            `;
            winnersSummary.appendChild(winnerItem);
        }
    }
    
    // နံပါတ်ပြသမှုကို ဖော်မတ်လုပ်ရန်
    function formatNumberDisplay(number, type) {
        switch(type) {
            case "front": return `${number}ထိပ်`;
            case "back": return `${number}နောက်`;
            case "double": return number.length === 1 ? `0${number}` : number;
            case "apa": return `${number}အပါ`;
            default: return number;
        }
    }
    
    // ထိုးကြေးအမျိုးအစားကို စာသားဖြင့် ပြသရန်
    function getBetTypeText(type) {
        switch(type) {
            case "single": return "တစ်လုံးချင်း";
            case "front": return "ထိပ်";
            case "back": return "နောက်";
            case "double": return "အပူး";
            case "apa": return "အပါ";
            default: return type;
        }
    }
    
    // စုစုပေါင်းငွေများကို အပ်ဒိတ်လုပ်ရန်
    function updateTotals() {
        let totalBet = 0;
        let totalWin = 0;
        
        betsData.forEach(bet => {
            totalBet += bet.amount;
            
            // ထွက်ငွေတွက်ချက်ရန် (ပေါက်ဂဏန်းသတ်မှတ်ထားမှသာ)
            if (winningNumbers.front || winningNumbers.back || winningNumbers.double) {
                if (bet.type === "front" && winningNumbers.front === bet.number) {
                    totalWin += bet.amount * bet.multiplier;
                } else if (bet.type === "back" && winningNumbers.back === bet.number) {
                    totalWin += bet.amount * bet.multiplier;
                } else if (bet.type === "double" && winningNumbers.double === bet.number) {
                    totalWin += bet.amount * bet.multiplier;
                } else if (bet.type === "single") {
                    const combinedNumber = winningNumbers.front + winningNumbers.back;
                    if (bet.number
