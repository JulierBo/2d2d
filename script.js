document.addEventListener('DOMContentLoaded', function() {
    // ဒေတာသိုလှောင်ရန်
    let namesData = [
        { id: 1, name: "ဦးကျော်မြင့်" },
        { id: 2, name: "မောင်မျိုးအောင်" },
        { id: 3, name: "ဒေါ်စန်းစန်း" }
    ];
    
    let betsData = [
        // နမူနာဒေတာ
        { id: 1, personId: 1, personName: "ဦးကျော်မြင့်", number: "1", type: "front", amount: 1000, date: new Date().toISOString() },
        { id: 2, personId: 1, personName: "ဦးကျော်မြင့်", number: "15", type: "apa", amount: 500, date: new Date().toISOString() },
        { id: 3, personId: 2, personName: "မောင်မျိုးအောင်", number: "5", type: "back", amount: 2000, date: new Date().toISOString() },
        { id: 4, personId: 2, personName: "မောင်မျိုးအောင်", number: "25", type: "apa", amount: 1500, date: new Date().toISOString() },
        { id: 5, personId: 3, personName: "ဒေါ်စန်းစန်း", number: "11", type: "double", amount: 3000, date: new Date().toISOString() },
        { id: 6, personId: 3, personName: "ဒေါ်စန်းစန်း", number: "36", type: "apa", amount: 1200, date: new Date().toISOString() }
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
    const calculateBtn = document.getElementById('calculateBtn');
    const tableTypeSelect = document.getElementById('tableTypeSelect');
    const refreshBtn = document.getElementById('refreshBtn');
    const betAmount = document.getElementById('betAmount');
    const currentSelectionText = document.getElementById('currentSelectionText');
    const currentBetTypeText = document.getElementById('currentBetTypeText');
    const quickSetButtons = document.querySelectorAll('.btn-quick-set');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const detailName = document.getElementById('detailName');
    const detailTotalBet = document.getElementById('detailTotalBet');
    const detailTotalWin = document.getElementById('detailTotalWin');
    const detailNetAmount = document.getElementById('detailNetAmount');
    const detailTableBody = document.getElementById('detailTableBody');
    
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
                <div class="name-stats">${totalBet.toLocaleString()} ကျပ်</div>
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
                    <td colspan="6" style="text-align: center; color: #aaa; font-style: italic; padding: 30px;">
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
            let result = "မပေါက်ပါ";
            let winAmount = 0;
            let isWin = false;
            
            if (bet.type === "front" && winningFront === bet.number) {
                result = "ပေါက်ပါသည်";
                winAmount = bet.amount * 9; // ထိပ်အတွက် 9ဆ
                isWin = true;
            } else if (bet.type === "back" && winningBack === bet.number) {
                result = "ပေါက်ပါသည်";
                winAmount = bet.amount * 9; // နောက်အတွက် 9ဆ
                isWin = true;
            } else if (bet.type === "double" && winningDouble === bet.number) {
                result = "ပေါက်ပါသည်";
                winAmount = bet.amount * 85; // အပူးအတွက် 85ဆ
                isWin = true;
            } else if (bet.type === "single") {
                // တစ်လုံးချင်းအတွက် ရလဒ်တွက်ချက်ရန်
                const combinedNumber = winningFront + winningBack;
                if (bet.number === combinedNumber) {
                    result = "ပေါက်ပါသည်";
                    winAmount = bet.amount * 85; // တစ်လုံးချင်းအတွက် 85ဆ
                    isWin = true;
                }
            } else if (bet.type === "apa") {
                // အပါအတွက် ရလဒ်တွက်ချက်ရန်
                const lastDigit = bet.number.slice(-1);
                if (winningBack === lastDigit) {
                    result = "ပေါက်ပါသည်";
                    winAmount = bet.amount * 9; // အပါအတွက် 9ဆ
                    isWin = true;
                }
            }
            
            const netResult = winAmount - bet.amount;
            
            row.innerHTML = `
                <td>${bet.personName}</td>
                <td>${formatNumberDisplay(bet.number, bet.type)}</td>
                <td>${getBetTypeText(bet.type)}</td>
                <td>${bet.amount.toLocaleString()} ကျပ်</td>
                <td class="${isWin ? 'win-cell' : 'loss-cell'}">${result}</td>
                <td class="${netResult >= 0 ? 'net-win' : 'net-loss'}">${netResult >= 0 ? '+' : ''}${netResult.toLocaleString()} ကျပ်</td>
            `;
            tableBody.appendChild(row);
        });
        
        updateTotals();
        updateSpecialTables();
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
            
            // ထွက်ငွေတွက်ချက်ရန်
            if (bet.type === "front" && winningNumbers.front === bet.number) {
                totalWin += bet.amount * 9;
            } else if (bet.type === "back" && winningNumbers.back === bet.number) {
                totalWin += bet.amount * 9;
            } else if (bet.type === "double" && winningNumbers.double === bet.number) {
                totalWin += bet.amount * 85;
            } else if (bet.type === "single") {
                const combinedNumber = winningNumbers.front + winningNumbers.back;
                if (bet.number === combinedNumber) {
                    totalWin += bet.amount * 85;
                }
            } else if (bet.type === "apa") {
                const lastDigit = bet.number.slice(-1);
                if (winningNumbers.back === lastDigit) {
                    totalWin += bet.amount * 9;
                }
            }
        });
        
        const net = totalWin - totalBet;
        
        totalBetAmount.textContent = `${totalBet.toLocaleString()} ကျပ်`;
        totalWinAmount.textContent = `${totalWin.toLocaleString()} ကျပ်`;
        netAmount.textContent = `${net >= 0 ? '+' : ''}${net.toLocaleString()} ကျပ်`;
        
        // အသားတင်ရလဒ်အား အရောင်ပြောင်းရန်
        if (net >= 0) {
            netAmount.style.color = '#2ecc71';
        } else {
            netAmount.style.color = '#e74c3c';
        }
    }
    
    // အထူးစာရင်းဇယားများကို အပ်ဒိတ်လုပ်ရန်
    function updateSpecialTables() {
        // ထိပ်များအတွက် စုစုပေါင်းထိုးငွေများ (0-9)
        for (let i = 0; i <= 9; i++) {
            const frontTotal = betsData
                .filter(bet => bet.type === "front" && bet.number === i.toString())
                .reduce((sum, bet) => sum + bet.amount, 0);
            
            const elementId = `front${i}Total`;
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = `${frontTotal.toLocaleString()} ကျပ်`;
            }
        }
        
        // နောက်များအတွက် စုစုပေါင်းထိုးငွေများ (0-9)
        for (let i = 0; i <= 9; i++) {
            const backTotal = betsData
                .filter(bet => bet.type === "back" && bet.number === i.toString())
                .reduce((sum, bet) => sum + bet.amount, 0);
            
            const elementId = `back${i}Total`;
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = `${backTotal.toLocaleString()} ကျပ်`;
            }
        }
        
        // အပူးများအတွက် စုစုပေါင်းထိုးငွေများ (00-33)
        for (let i = 0; i <= 33; i++) {
            const numStr = i < 10 ? `0${i}` : i.toString();
            const doubleTotal = betsData
                .filter(bet => bet.type === "double" && bet.number === numStr)
                .reduce((sum, bet) => sum + bet.amount, 0);
            
            const elementId = `double${numStr}Total`;
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = `${doubleTotal.toLocaleString()} ကျပ်`;
            }
        }
        
        // အပါများအတွက် စုစုပေါင်းထိုးငွေများ (0-9)
        for (let i = 0; i <= 9; i++) {
            // အပါအတွက် နောက်ဆုံးဂဏန်း i ဖြစ်သော ထိုးကြေးများကို စုစုပေါင်းရန်
            const apaTotal = betsData
                .filter(bet => bet.type === "apa" && bet.number.slice(-1) === i.toString())
                .reduce((sum, bet) => sum + bet.amount, 0);
            
            const elementId = `apa${i}Total`;
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = `${apaTotal.toLocaleString()} ကျပ်`;
            }
        }
    }
    
    // လက်ရှိရွေးချယ်မှုကို အပ်ဒိတ်လုပ်ရန်
    function updateCurrentSelection() {
        let displayText = "ရွေးချယ်ထားသော နံပါတ်: ";
        
        if (selectedNumber) {
            displayText += formatNumberDisplay(selectedNumber, currentBetType);
        } else {
            displayText += "-";
        }
        
        currentSelectionText.textContent = displayText;
        currentBetTypeText.textContent = `အမျိုးအစား: ${getBetTypeText(currentBetType)}`;
        
        // ရွေးထားသော နာမည်ကို ပြသရန်
        if (selectedPersonId) {
            const person = namesData.find(p => p.id === selectedPersonId);
            if (person) {
                currentSelectionText.textContent += ` | နာမည်: ${person.name}`;
            }
        }
    }
    
    // နာမည်အသစ်ထည့်ရန်
    function addNewName() {
        const name = document.getElementById('newUserName').value.trim();
        
        if (!name) {
            alert("ကျေးဇူးပြု၍ နာမည်ထည့်သွင်းပါ။");
            return;
        }
        
        const newId = namesData.length > 0 ? Math.max(...namesData.map(p => p.id)) + 1 : 1;
        namesData.push({
            id: newId,
            name: name
        });
        
        renderNames();
        addNameModal.style.display = 'none';
        document.getElementById('newUserName').value = '';
        
        saveDataToLocalStorage();
        alert(`အသစ်ထည့်သွင်းခြင်း အောင်မြင်ပါသည်!\nအမည်: ${name}`);
    }
    
    // နာမည်ဖျက်ရန်
    function deleteName(personId) {
        const person = namesData.find(p => p.id === personId);
        if (!person) return;
        
        if (confirm(`"${person.name}" ကို ဖျက်ရန် သေချာပါသလား?\n(ဤသူ၏ ထိုးကြေးမှတ်တမ်းများလည်း ဖျက်သွားပါမည်။)`)) {
            // နာမည်ဖျက်ရန်
            namesData = namesData.filter(p => p.id !== personId);
            
            // ဤသူနှင့်ဆိုင်သော ထိုးကြေးများကို ဖျက်ရန်
            betsData = betsData.filter(bet => bet.personId !== personId);
            
            renderNames();
            renderTable(tableTypeSelect.value);
            saveDataToLocalStorage();
        }
    }
    
    // လူတစ်ဦးချင်းစီ၏ အသေးစိတ်စာရင်းကို ကြည့်ရန်
    function viewPersonDetails(personId) {
        const person = namesData.find(p => p.id === personId);
        if (!person) return;
        
        // အသေးစိတ်စာရင်းများကို ရယူရန်
        const personBets = betsData.filter(bet => bet.personId === personId);
        
        // စုစုပေါင်းငွေများ တွက်ချက်ရန်
        let totalBet = 0;
        let totalWin = 0;
        
        detailTableBody.innerHTML = '';
        
        if (personBets.length === 0) {
            detailTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: #aaa; font-style: italic; padding: 20px;">
                        ထိုးကြေးများ မရှိပါ။
                    </td>
                </tr>
            `;
        } else {
            personBets.forEach(bet => {
                // ရလဒ်တွက်ချက်ရန်
                let result = "မပေါက်ပါ";
                let winAmount = 0;
                
                if (bet.type === "front" && winningNumbers.front === bet.number) {
                    result = "ပေါက်ပါသည်";
                    winAmount = bet.amount * 9;
                } else if (bet.type === "back" && winningNumbers.back === bet.number) {
                    result = "ပေါက်ပါသည်";
                    winAmount = bet.amount * 9;
                } else if (bet.type === "double" && winningNumbers.double === bet.number) {
                    result = "ပေါက်ပါသည်";
                    winAmount = bet.amount * 85;
                } else if (bet.type === "single") {
                    const combinedNumber = winningNumbers.front + winningNumbers.back;
                    if (bet.number === combinedNumber) {
                        result = "ပေါက်ပါသည်";
                        winAmount = bet.amount * 85;
                    }
                } else if (bet.type === "apa") {
                    const lastDigit = bet.number.slice(-1);
                    if (winningNumbers.back === lastDigit) {
                        result = "ပေါက်ပါသည်";
                        winAmount = bet.amount * 9;
                    }
                }
                
                totalBet += bet.amount;
                totalWin += winAmount;
                
                const date = new Date(bet.date);
                const dateStr = date.toLocaleDateString('my-MM') + ' ' + date.toLocaleTimeString('my-MM', { hour: '2-digit', minute: '2-digit' });
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatNumberDisplay(bet.number, bet.type)}</td>
                    <td>${getBetTypeText(bet.type)}</td>
                    <td>${bet.amount.toLocaleString()} ကျပ်</td>
                    <td class="${winAmount > 0 ? 'win-cell' : 'loss-cell'}">${result}</td>
                    <td>${winAmount.toLocaleString()} ကျပ်</td>
                    <td>${dateStr}</td>
                `;
                detailTableBody.appendChild(row);
            });
        }
        
        const net = totalWin - totalBet;
        
        detailName.textContent = person.name;
        detailTotalBet.textContent = `${totalBet.toLocaleString()} ကျပ်`;
        detailTotalWin.textContent = `${totalWin.toLocaleString()} ကျပ်`;
        detailNetAmount.textContent = `${net >= 0 ? '+' : ''}${net.toLocaleString()} ကျပ်`;
        
        if (net >= 0) {
            detailNetAmount.style.color = '#2ecc71';
        } else {
            detailNetAmount.style.color = '#e74c3c';
        }
        
        detailModal.style.display = 'flex';
    }
    
    // ထိုးကြေးထည့်သွင်းရန်
    function addBet() {
        if (!selectedPersonId) {
            alert("ကျေးဇူးပြု၍ နာမည်ရွေးပါ။");
            return;
        }
        
        if (!selectedNumber) {
            alert("ကျေးဇူးပြု၍ နံပါတ်ရွေးပါ။");
            return;
        }
        
        // အပါအတွက် စစ်ဆေးရန်
        if (currentBetType === "apa") {
            if (selectedNumber.length < 2) {
                alert("အပါအတွက် အနည်းဆုံး ၂ လုံးထည့်ပါ (ဥပမာ: 15, 27)။");
                return;
            }
            const lastDigit = selectedNumber.slice(-1);
            if (isNaN(lastDigit) || parseInt(lastDigit) < 0 || parseInt(lastDigit) > 9) {
                alert("အပါအတွက် နောက်ဆုံးဂဏန်းသည် 0-9 ဖြစ်ရပါမည်။");
                return;
            }
        }
        
        const amount = parseInt(betAmount.value);
        if (isNaN(amount) || amount <= 0) {
            alert("မှန်ကန်သော ငွေပမာဏထည့်ပါ။");
            return;
        }
        
        const person = namesData.find(p => p.id === selectedPersonId);
        if (!person) return;
        
        const newId = betsData.length > 0 ? Math.max(...betsData.map(b => b.id)) + 1 : 1;
        const newBet = {
            id: newId,
            personId: selectedPersonId,
            personName: person.name,
            number: selectedNumber,
            type: currentBetType,
            amount: amount,
            date: new Date().toISOString()
        };
        
        betsData.push(newBet);
        
        // ရွေးချယ်မှုများကို ရှင်းလင်းရန်
        selectedNumber = "";
        updateCurrentSelection();
        
        // UI ကို အပ်ဒိတ်လုပ်ရန်
        renderTable(tableTypeSelect.value);
        saveDataToLocalStorage();
        
        alert(`ထည့်သွင်းခြင်း အောင်မြင်ပါသည်!\n${person.name} - ${formatNumberDisplay(newBet.number, newBet.type)} - ${amount.toLocaleString()} ကျပ်`);
    }
    
    // ပေါက်ဂဏန်းသတ်မှတ်ရန်
    function setWinningNumbers() {
        const front = frontResult.value.trim();
        const back = backResult.value.trim();
        const double = doubleResult.value.trim();
        
        // အနည်းဆုံး တစ်ခုခုထည့်ရန်
        if (!front && !back && !double) {
            alert("ကျေးဇူးပြု၍ ပေါက်ဂဏန်းတစ်ခုခုထည့်ပါ။");
            return;
        }
        
        // ထိပ်နှင့်နောက်အတွက် စစ်ဆေးရန်
        if (front && (front.length !== 1 || isNaN(front) || parseInt(front) < 0 || parseInt(front) > 9)) {
            alert("ထိပ်ဂဏန်းအတွက် 0-9 အထိသာ ခွင့်ပြုသည်။");
            return;
        }
        
        if (back && (back.length !== 1 || isNaN(back) || parseInt(back) < 0 || parseInt(back) > 9)) {
            alert("နောက်ဂဏန်းအတွက် 0-9 အထိသာ ခွင့်ပြုသည်။");
            return;
        }
        
        // အပူးအတွက် စစ်ဆေးရန်
        if (double && (double.length > 2 || isNaN(double) || parseInt(double) < 0 || parseInt(double) > 99)) {
            alert("အပူးဂဏန်းအတွက် 00-99 အထိသာ ခွင့်ပြုသည်။");
            return;
        }
        
        winningNumbers.front = front || null;
        winningNumbers.back = back || null;
        winningNumbers.double = double || null;
        
        saveDataToLocalStorage();
        renderTable(tableTypeSelect.value);
        alert("ပေါက်ဂဏန်းများ သတ်မှတ်ပြီးပါပြီ။\nရလဒ်များကို ပြန်လည်တွက်ချက်ပါမည်။");
    }
    
    // စာရင်းများကို Export လုပ်ရန်
    function exportData() {
        if (betsData.length === 0) {
            alert("Export လုပ်ရန် ဒေတာများ မရှိပါ။");
            return;
        }
        
        // CSV format ဖြင့် ဒေတာများကို ပြင်ဆင်ရန်
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "နာမည်,နံပါတ်,အမျိုးအစား,ပမာဏ(ကျပ်),ရက်စွဲ\n";
        
        betsData.forEach(bet => {
            const date = new Date(bet.date);
            const dateStr = date.toLocaleDateString('my-MM');
            const row = [
                `"${bet.personName}"`,
                `"${formatNumberDisplay(bet.number, bet.type)}"`,
                `"${getBetTypeText(bet.type)}"`,
                bet.amount,
                `"${dateStr}"`
            ].join(',');
            csvContent += row + "\n";
        });
        
        // ဖိုင်အမည်
        const date = new Date();
        const fileName = `kkuser2d_export_${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}.csv`;
        
        // Download link ဖန်တီးရန်
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert(`ဒေတာများ Export လုပ်ပြီးပါပြီ။\nဖိုင်အမည်: ${fileName}`);
    }
    
    // ရက်စွဲနှင့်အချိန်ကို အပ်ဒိတ်လုပ်ရန်
    function updateDateTime() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('my-MM', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        });
        const timeStr = now.toLocaleTimeString('my-MM');
        currentDateTime.textContent = `${dateStr} ${timeStr}`;
        resultDate.textContent = `ရက်စွဲ: ${now.toLocaleDateString('my-MM')}`;
    }
    
    // အထူးစာရင်းဇယားများအတွက် HTML ဖန်တီးရန်
    function createSpecialTableHTML() {
        // ထိပ်စာရင်းအတွက်
        const frontTab = document.getElementById('front-tab');
        let frontHTML = '<div class="front-summary">';
        for (let i = 0; i <= 9; i++) {
            frontHTML += `
                <div class="summary-row">
                    <span>${i} ထိပ်</span>
                    <span class="summary-amount" id="front${i}Total">0 ကျပ်</span>
                </div>
            `;
        }
        frontHTML += '</div>';
        frontTab.innerHTML = frontHTML;
        
        // နောက်စာရင်းအတွက်
        const backTab = document.getElementById('back-tab');
        let backHTML = '<div class="back-summary">';
        for (let i = 0; i <= 9; i++) {
            backHTML += `
                <div class="summary-row">
                    <span>${i} နောက်</span>
                    <span class="summary-amount" id="back${i}Total">0 ကျပ်</span>
                </div>
            `;
        }
        backHTML += '</div>';
        backTab.innerHTML = backHTML;
        
        // အပူးစာရင်းအတွက် (00-33)
        const doubleTab = document.getElementById('double-tab');
        let doubleHTML = '<div class="double-summary">';
        for (let i = 0; i <= 33; i++) {
            const numStr = i < 10 ? `0${i}` : i.toString();
            doubleHTML += `
                <div class="summary-row">
                    <span>${numStr}</span>
                    <span class="summary-amount" id="double${numStr}Total">0 ကျပ်</span>
                </div>
            `;
        }
        doubleHTML += '</div>';
        doubleTab.innerHTML = doubleHTML;
        
        // အပါစာရင်းအတွက် (0-9)
        const apaTab = document.getElementById('apa-tab');
        let apaHTML = '<div class="apa-summary">';
        for (let i = 0; i <= 9; i++) {
            apaHTML += `
                <div class="summary-row">
                    <span>${i} အပါ</span>
                    <span class="summary-amount" id="apa${i}Total">0 ကျပ်</span>
                </div>
            `;
        }
        apaHTML += '</div>';
        apaTab.innerHTML = apaHTML;
    }
    
    // အစပြုရန်
    function init() {
        // ဒေတာများကို ပြန်လည်ရယူရန်
        loadDataFromLocalStorage();
        
        // အထူးစာရင်းဇယားများအတွက် HTML ဖန်တီးရန်
        createSpecialTableHTML();
        
        // UI ကို ပြသရန်
        renderNames();
        renderTable();
        updateDateTime();
        updateCurrentSelection();
        
        // ရက်စွဲနှင့်အချိန်ကို စက္ကန့်တိုင်း အပ်ဒိတ်လုပ်ရန်
        setInterval(updateDateTime, 1000);
        
        // Event Listeners
        addNameBtn.addEventListener('click', function() {
            addNameModal.style.display = 'flex';
            document.getElementById('newUserName').focus();
        });
        
        saveNewNameBtn.addEventListener('click', addNewName);
        
        modalClose.forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                addNameModal.style.display = 'none';
                detailModal.style.display = 'none';
            });
        });
        
        cancelBtn.addEventListener('click', function() {
            addNameModal.style.display = 'none';
        });
        
        clearNamesBtn.addEventListener('click', function() {
            if (confirm("နာမည်စာရင်းအားလုံးကို ဖျက်ရန် သေချာပါသလား?\n(ထိုးကြေးမှတ်တမ်းများလည်း ဖျက်သွားပါမည်။)")) {
                namesData = [];
                betsData = [];
                renderNames();
                renderTable();
                saveDataToLocalStorage();
            }
        });
        
        exportBtn.addEventListener('click', exportData);
        
        // ဂဏန်းခလုတ်များ
        numberButtons.forEach(button => {
            button.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                
                // ထိပ်နှင့်နောက်အတွက် စစ်ဆေးရန်
                if ((currentBetType === "front" || currentBetType === "back") && value.length > 1) {
                    alert("ထိပ်/နောက်အတွက် 0-9 အထိသာ ခွင့်ပြုသည်။");
                    return;
                }
                
                // အပူးအတွက် စစ်ဆေးရန်
                if (currentBetType === "double" && value.length > 2) {
                    alert("အပူးအတွက် 0-99 အထိသာ ခွင့်ပြုသည်။");
                    return;
                }
                
                selectedNumber += value;
                updateCurrentSelection();
            });
        });
        
        deleteBtn.addEventListener('click', function() {
            if (selectedNumber.length > 0) {
                selectedNumber = selectedNumber.slice(0, -1);
                updateCurrentSelection();
            }
        });
        
        clearAllBtn.addEventListener('click', function() {
            selectedNumber = "";
            updateCurrentSelection();
        });
        
        confirmBtn.addEventListener('click', addBet);
        
        // ထိုးကြေးအမျိုးအစား ခလုတ်များ
        frontBtn.addEventListener('click', function() {
            currentBetType = "front";
            selectedNumber = "";
            updateCurrentSelection();
        });
        
        backBtn.addEventListener('click', function() {
            currentBetType = "back";
            selectedNumber = "";
            updateCurrentSelection();
        });
        
        doubleBtn.addEventListener('click', function() {
            currentBetType = "double";
            selectedNumber = "";
            updateCurrentSelection();
        });
        
        apaBtn.addEventListener('click', function() {
            currentBetType = "apa";
            selectedNumber = "";
            updateCurrentSelection();
        });
        
        singleBtn.addEventListener('click', function() {
            currentBetType = "single";
            selectedNumber = "";
            updateCurrentSelection();
        });
        
        // ပေါက်ဂဏန်း ခလုတ်များ
        setResultBtn.addEventListener('click', setWinningNumbers);
        
        clearResultBtn.addEventListener('click', function() {
            frontResult.value = '';
            backResult.value = '';
            doubleResult.value = '';
            winningNumbers.front = null;
            winningNumbers.back = null;
            winningNumbers.double = null;
            saveDataToLocalStorage();
            renderTable(tableTypeSelect.value);
            alert("ပေါက်ဂဏန်းများ ရှင်းလင်းပြီးပါပြီ။");
        });
        
        calculateBtn.addEventListener('click', function() {
            renderTable(tableTypeSelect.value);
            alert("ရလဒ်များကို ပြန်လည်တွက်ချက်ပြီးပါပြီ။");
        });
        
        // စာရင်းဇယားထိန်းချုပ်မှုများ
        tableTypeSelect.addEventListener('change', function() {
            renderTable(this.value);
        });
        
        refreshBtn.addEventListener('click', function() {
            renderTable(tableTypeSelect.value);
        });
        
        // အလျင်အမြန်သတ်မှတ်ရန် ခလုတ်များ
        quickSetButtons.forEach(button => {
            button.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                const value = this.getAttribute('data-value');
                
                if (type === "front") {
                    frontResult.value = value;
                } else if (type === "back") {
                    backResult.value = value;
                } else if (type === "double") {
                    doubleResult.value = value;
                }
            });
        });
        
        // Tab ခလုတ်များ
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Tab များကို အသက်သွင်းရန်
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Tab content များကို ပြသရန်
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // အထူးစာရင်းဇယားများကို ပြသရန်
        updateSpecialTables();
    }
    
    // အပလီကေးရှင်းကို စတင်ခြင်း
    init();
});
