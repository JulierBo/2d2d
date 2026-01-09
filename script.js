document.addEventListener('DOMContentLoaded', function() {
    // ဒေတာသိုလှောင်ရန်
    let namesData = [
        { id: 1, name: "ဦးကျော်မြင့်", amount: 50000 },
        { id: 2, name: "မောင်မျိုးအောင်", amount: 30000 },
        { id: 3, name: "ဒေါ်စန်းစန်း", amount: 75000 }
    ];
    
    let betsData = [];
    let selectedNumbers = [];
    let currentBetType = 'single'; // single, front, back, double
    let winningNumbers = {
        front: null,
        back: null,
        double: null
    };
    
    // DOM Elements
    const nameList = document.getElementById('nameList');
    const betTableBody = document.getElementById('betTableBody');
    const totalBetAmount = document.getElementById('totalBetAmount');
    const currentNumberDisplay = document.getElementById('currentNumberDisplay');
    const addNameModal = document.getElementById('addNameModal');
    const addNameBtn = document.getElementById('addNameBtn');
    const saveNewNameBtn = document.getElementById('saveNewNameBtn');
    const modalClose = document.querySelector('.modal-close');
    const cancelBtn = document.querySelector('.btn-cancel');
    const clearNamesBtn = document.getElementById('clearNamesBtn');
    const saveNamesBtn = document.getElementById('saveNamesBtn');
    const numberButtons = document.querySelectorAll('.number-btn');
    const deleteBtn = document.getElementById('deleteBtn');
    const resetBtn = document.getElementById('resetBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const copyBtn = document.getElementById('copyBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const clearBetsBtn = document.getElementById('clearBetsBtn');
    const betTypeButtons = document.querySelectorAll('.btn-bet-type');
    const frontResult = document.getElementById('frontResult');
    const backResult = document.getElementById('backResult');
    const doubleResult = document.getElementById('doubleResult');
    const setResultBtn = document.getElementById('setResultBtn');
    const clearResultBtn = document.getElementById('clearResultBtn');
    const historyDate = document.getElementById('historyDate');
    const viewHistoryBtn = document.getElementById('viewHistoryBtn');
    const historyDisplay = document.getElementById('historyDisplay');
    const frontBtn = document.getElementById('frontBtn');
    const backBtn = document.getElementById('backBtn');
    const doubleBtn = document.getElementById('doubleBtn');
    const singleBtn = document.getElementById('singleBtn');
    
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
                <div class="name-item" style="justify-content: center; color: #b0b0d0; font-style: italic;">
                    နာမည်စာရင်း မရှိပါ။ အသစ်ထည့်ပါ။
                </div>
            `;
            return;
        }
        
        namesData.forEach((person, index) => {
            const nameItem = document.createElement('div');
            nameItem.className = 'name-item';
            nameItem.innerHTML = `
                <div class="name-text">${person.name}</div>
                <div class="name-actions">
                    <button class="btn-name-action btn-edit" data-index="${index}">
                        <i class="fas fa-edit"></i> ပြင်မည်
                    </button>
                    <button class="btn-name-action btn-delete" data-index="${index}">
                        <i class="fas fa-trash"></i> ဖျက်မည်
                    </button>
                </div>
            `;
            nameList.appendChild(nameItem);
        });
        
        // ပြင်ဆင်ရန် ခလုတ်များ
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                editName(index);
            });
        });
        
        // ဖျက်ရန် ခလုတ်များ
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteName(index);
            });
        });
    }
    
    // ထိုးကြေးစာရင်းကို ပြသရန်
    function renderBets() {
        betTableBody.innerHTML = '';
        
        if (betsData.length === 0) {
            betTableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: #b0b0d0; font-style: italic; padding: 30px;">
                        ထိုးကြေးများ မရှိပါ။
                    </td>
                </tr>
            `;
            updateTotalBet();
            return;
        }
        
        betsData.forEach((bet, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bet.numbers.join(', ')}</td>
                <td>${getBetTypeText(bet.type)}</td>
                <td>${bet.amount.toLocaleString()} ကျပ်</td>
                <td>
                    <button class="btn-bet-action btn-bet-edit" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-bet-action btn-bet-delete" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            betTableBody.appendChild(row);
        });
        
        // ပြင်ဆင်ရန် ခလုတ်များ
        document.querySelectorAll('.btn-bet-edit').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                editBet(index);
            });
        });
        
        // ဖျက်ရန် ခလုတ်များ
        document.querySelectorAll('.btn-bet-delete').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteBet(index);
            });
        });
        
        updateTotalBet();
    }
    
    // ထိုးကြေးအမျိုးအစားကို စာသားဖြင့် ပြသရန်
    function getBetTypeText(type) {
        switch(type) {
            case 'single': return 'တစ်လုံးချင်း';
            case 'front': return 'ထိပ်';
            case 'back': return 'နောက်';
            case 'double': return 'အပူး';
            default: return type;
        }
    }
    
    // စုစုပေါင်းထိုးကြေးကို တွက်ချက်ရန်
    function updateTotalBet() {
        let total = 0;
        betsData.forEach(bet => {
            total += bet.amount;
        });
        totalBetAmount.textContent = `${total.toLocaleString()} ကျပ်`;
    }
    
    // နာမည်အသစ်ထည့်ရန်
    function addNewName() {
        const name = document.getElementById('newUserName').value.trim();
        const amount = parseInt(document.getElementById('newUserAmount').value);
        
        if (!name) {
            alert("ကျေးဇူးပြု၍ နာမည်ထည့်သွင်းပါ။");
            return;
        }
        
        if (isNaN(amount) || amount <= 0) {
            alert("ကျေးဇူးပြု၍ မှန်ကန်သော ငွေပမာဏထည့်သွင်းပါ။");
            return;
        }
        
        const newId = namesData.length > 0 ? Math.max(...namesData.map(p => p.id)) + 1 : 1;
        namesData.push({
            id: newId,
            name: name,
            amount: amount
        });
        
        renderNames();
        addNameModal.style.display = 'none';
        document.getElementById('newUserName').value = '';
        document.getElementById('newUserAmount').value = '1000';
        
        saveDataToLocalStorage();
        alert(`အသစ်ထည့်သွင်းခြင်း အောင်မြင်ပါသည်!\nအမည်: ${name}\nကြိုတင်ငွေ: ${amount.toLocaleString()} ကျပ်`);
    }
    
    // နာမည်ပြင်ဆင်ရန်
    function editName(index) {
        const person = namesData[index];
        const newName = prompt("အမည်အသစ်ထည့်ပါ:", person.name);
        
        if (newName !== null && newName.trim() !== '') {
            const newAmount = parseInt(prompt("ကြိုတင်ငွေအသစ်ထည့်ပါ (ကျပ်):", person.amount));
            
            if (!isNaN(newAmount) && newAmount > 0) {
                namesData[index] = {
                    ...person,
                    name: newName.trim(),
                    amount: newAmount
                };
                renderNames();
                saveDataToLocalStorage();
            }
        }
    }
    
    // နာမည်ဖျက်ရန်
    function deleteName(index) {
        if (confirm(`"${namesData[index].name}" ကို ဖျက်ရန် သေချာပါသလား?`)) {
            namesData.splice(index, 1);
            renderNames();
            saveDataToLocalStorage();
        }
    }
    
    // ထိုးကြေးပြင်ဆင်ရန်
    function editBet(index) {
        const bet = betsData[index];
        const newAmount = parseInt(prompt("ထိုးကြေးပမာဏအသစ်ထည့်ပါ (ကျပ်):", bet.amount));
        
        if (!isNaN(newAmount) && newAmount > 0) {
            betsData[index].amount = newAmount;
            renderBets();
            saveDataToLocalStorage();
        }
    }
    
    // ထိုးကြေးဖျက်ရန်
    function deleteBet(index) {
        if (confirm("ဤထိုးကြေးကို ဖျက်ရန် သေချာပါသလား?")) {
            betsData.splice(index, 1);
            renderBets();
            saveDataToLocalStorage();
        }
    }
    
    // ထိုးကြေးအမျိုးအစား ပြောင်းလဲရန်
    function setBetType(type) {
        currentBetType = type;
        betTypeButtons.forEach(btn => {
            if (btn.getAttribute('data-type') === type) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // ရွေးထားသော နံပါတ်များကို ရှင်းလင်းရန်
        selectedNumbers = [];
        updateCurrentNumberDisplay();
    }
    
    // လက်ရှိရွေးထားသော နံပါတ်များကို ပြသရန်
    function updateCurrentNumberDisplay() {
        if (selectedNumbers.length === 0) {
            currentNumberDisplay.textContent = '-';
            return;
        }
        
        let displayText = '';
        if (currentBetType === 'single') {
            displayText = selectedNumbers.join(', ');
        } else if (currentBetType === 'front') {
            displayText = selectedNumbers.map(num => `${num}ထိပ်`).join(', ');
        } else if (currentBetType === 'back') {
            displayText = selectedNumbers.map(num => `${num}နောက်`).join(', ');
        } else if (currentBetType === 'double') {
            displayText = selectedNumbers.map(num => {
                if (num.length === 1) return `0${num}`;
                return num;
            }).join(', ');
        }
        
        currentNumberDisplay.textContent = displayText;
    }
    
    // ထိုးကြေးအတည်ပြုရန်
    function confirmBet() {
        if (selectedNumbers.length === 0) {
            alert("ကျေးဇူးပြု၍ နံပါတ်ရွေးပါ။");
            return;
        }
        
        if (namesData.length === 0) {
            alert("ကျေးဇူးပြု၍ နာမည်စာရင်းထဲမှ နာမည်တစ်ခုရွေးပါ။");
            return;
        }
        
        // နာမည်ရွေးရန် dialog
        let nameOptions = namesData.map((person, index) => `${index + 1}. ${person.name}`).join('\n');
        const nameIndex = parseInt(prompt(`နာမည်ရွေးပါ:\n${nameOptions}`)) - 1;
        
        if (isNaN(nameIndex) || nameIndex < 0 || nameIndex >= namesData.length) {
            alert("မှားယွင်းသော ရွေးချယ်မှုဖြစ်သည်။");
            return;
        }
        
        const selectedPerson = namesData[nameIndex];
        
        // ထိုးကြေးပမာဏမေးရန်
        const amount = parseInt(prompt(`ထိုးကြေးပမာဏထည့်ပါ (ကျပ်):\n${selectedPerson.name} ၏ ကျန်ငွေ: ${selectedPerson.amount.toLocaleString()} ကျပ်`, "100"));
        
        if (isNaN(amount) || amount <= 0) {
            alert("မှားယွင်းသော ငွေပမာဏဖြစ်သည်။");
            return;
        }
        
        if (amount > selectedPerson.amount) {
            alert("ကြိုတင်ငွေမလုံလောက်ပါ။");
            return;
        }
        
        // နာမည်စာရင်းမှ ငွေနုတ်ရန်
        namesData[nameIndex].amount -= amount;
        
        // ထိုးကြေးစာရင်းတွင် ထည့်ရန်
        const newBet = {
            id: betsData.length > 0 ? Math.max(...betsData.map(b => b.id)) + 1 : 1,
            personId: selectedPerson.id,
            personName: selectedPerson.name,
            numbers: [...selectedNumbers],
            type: currentBetType,
            amount: amount,
            date: new Date().toISOString()
        };
        
        betsData.push(newBet);
        
        // ရွေးထားသော နံပါတ်များကို ရှင်းလင်းရန်
        selectedNumbers = [];
        updateCurrentNumberDisplay();
        
        // UI ကို အပ်ဒိတ်လုပ်ရန်
        renderNames();
        renderBets();
        saveDataToLocalStorage();
        
        alert(`အောင်မြင်ပါသည်!\n${selectedPerson.name} အတွက် ${amount.toLocaleString()} ကျပ် ထိုးကြေးအတည်ပြုပြီးပါပြီ။`);
    }
    
    // ပေါက်ဂဏန်းသတ်မှတ်ရန်
    function setWinningNumbers() {
        const front = frontResult.value.trim();
        const back = backResult.value.trim();
        const double = doubleResult.value.trim();
        
        if (!front && !back && !double) {
            alert("ကျေးဇူးပြု၍ ပေါက်ဂဏန်းတစ်ခုခုထည့်ပါ။");
            return;
        }
        
        winningNumbers.front = front || null;
        winningNumbers.back = back || null;
        winningNumbers.double = double || null;
        
        saveDataToLocalStorage();
        alert("ပေါက်ဂဏန်းများ သတ်မှတ်ပြီးပါပြီ။");
    }
    
    // ရက်လိုက်သမိုင်းကြည့်ရန်
    function viewHistory() {
        const selectedDate = historyDate.value;
        
        if (!selectedDate) {
            alert("ကျေးဇူးပြု၍ ရက်စွဲရွေးပါ။");
            return;
        }
        
        const dateObj = new Date(selectedDate);
        const dateStr = dateObj.toLocaleDateString('my-MM');
        
        // ရွေးထားသောရက်စွဲနှင့် ကိုက်ညီသော ထိုးကြေးများကို ရှာရန်
        const filteredBets = betsData.filter(bet => {
            const betDate = new Date(bet.date).toDateString();
            return betDate === dateObj.toDateString();
        });
        
        if (filteredBets.length === 0) {
            historyDisplay.innerHTML = `
                <div class="history-placeholder">
                    ${dateStr} ရက်နေ့တွင် ထိုးကြေးများ မရှိပါ။
                </div>
            `;
            return;
        }
        
        let historyHTML = `<h4 style="margin-bottom: 15px; color: #e94560;">${dateStr} ရက်နေ့၏ ထိုးကြေးများ</h4>`;
        historyHTML += `<div style="display: flex; flex-direction: column; gap: 10px;">`;
        
        filteredBets.forEach(bet => {
            historyHTML += `
                <div style="background: rgba(74, 74, 109, 0.5); padding: 10px; border-radius: 8px;">
                    <div><strong>${bet.personName}</strong></div>
                    <div>နံပါတ်များ: ${bet.numbers.join(', ')} (${getBetTypeText(bet.type)})</div>
                    <div>ပမာဏ: ${bet.amount.toLocaleString()} ကျပ်</div>
                </div>
            `;
        });
        
        historyHTML += `</div>`;
        historyDisplay.innerHTML = historyHTML;
    }
    
    // အစပြုရန်
    function init() {
        // ဒေတာများကို ပြန်လည်ရယူရန်
        loadDataFromLocalStorage();
        
        // UI ကို ပြသရန်
        renderNames();
        renderBets();
        updateCurrentNumberDisplay();
        
        // ယနေ့ရက်စွဲကို ပုံသေထားရန်
        const today = new Date().toISOString().split('T')[0];
        historyDate.value = today;
        
        // Event Listeners
        addNameBtn.addEventListener('click', function() {
            addNameModal.style.display = 'flex';
        });
        
        saveNewNameBtn.addEventListener('click', addNewName);
        
        modalClose.addEventListener('click', function() {
            addNameModal.style.display = 'none';
        });
        
        cancelBtn.addEventListener('click', function() {
            addNameModal.style.display = 'none';
        });
        
        clearNamesBtn.addEventListener('click', function() {
            if (confirm("နာမည်စာရင်းအားလုံးကို ဖျက်ရန် သေချာပါသလား?")) {
                namesData = [];
                renderNames();
                saveDataToLocalStorage();
            }
        });
        
        saveNamesBtn.addEventListener('click', function() {
            saveDataToLocalStorage();
            alert("နာမည်စာရင်းများ သိမ်းဆည်းပြီးပါပြီ။");
        });
        
        // ဂဏန်းခလုတ်များ
        numberButtons.forEach(button => {
            button.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                
                // အပူးအတွက် နံပါတ်စစ်ဆေးခြင်း
                if (currentBetType === 'double') {
                    if (value.length > 2) {
                        alert("အပူးအတွက် နံပါတ် ၂လုံးထက် မပိုရပါ။");
                        return;
                    }
                    
                    // 00 သို့မဟုတ် 0-99 အထိသာ ခွင့်ပြုသည်
                    if (value.length === 1 && parseInt(value) > 9) {
                        alert("အပူးအတွက် 0-99 အထိသာ ခွင့်ပြုသည်။");
                        return;
                    }
                }
                
                // ထိပ်နှင့်နောက်အတွက် နံပါတ်စစ်ဆေးခြင်း
                if (currentBetType === 'front' || currentBetType === 'back') {
                    if (value.length > 1 || parseInt(value) > 9) {
                        alert("ထိပ်/နောက်အတွက် 0-9 အထိသာ ခွင့်ပြုသည်။");
                        return;
                    }
                }
                
                selectedNumbers.push(value);
                updateCurrentNumberDisplay();
            });
        });
        
        deleteBtn.addEventListener('click', function() {
            if (selectedNumbers.length > 0) {
                selectedNumbers.pop();
                updateCurrentNumberDisplay();
            }
        });
        
        resetBtn.addEventListener('click', function() {
            selectedNumbers = [];
            updateCurrentNumberDisplay();
        });
        
        confirmBtn.addEventListener('click', confirmBet);
        
        selectAllBtn.addEventListener('click', function() {
            if (currentBetType === 'front' || currentBetType === 'back') {
                // 0-9 အားလုံးရွေးရန်
                selectedNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                updateCurrentNumberDisplay();
            } else if (currentBetType === 'double') {
                alert("အပူးအတွက် အားလုံးရွေးခြင်း မလုပ်ဆောင်နိုင်ပါ။");
            } else {
                alert("တစ်လုံးချင်းအတွက် အားလုံးရွေးခြင်း မလုပ်ဆောင်နိုင်ပါ။");
            }
        });
        
        copyBtn.addEventListener('click', function() {
            if (betsData.length === 0) {
                alert("ကူးယူရန် ထိုးကြေးများ မရှိပါ။");
                return;
            }
            
            const copyData = JSON.stringify(betsData);
            navigator.clipboard.writeText(copyData)
                .then(() => alert("ထိုးကြေးများ ကူးယူပြီးပါပြီ။"))
                .catch(err => alert("ကူးယူရာတွင် အမှားတစ်ခုဖြစ်သည်။"));
        });
        
        pasteBtn.addEventListener('click', function() {
            navigator.clipboard.readText()
                .then(text => {
                    try {
                        const pastedData = JSON.parse(text);
                        if (Array.isArray(pastedData)) {
                            betsData = pastedData;
                            renderBets();
                            saveDataToLocalStorage();
                            alert("ထိုးကြေးများ ကူးထည့်ပြီးပါပြီ။");
                        } else {
                            alert("မှားယွင်းသော ဒေတာဖြစ်သည်။");
                        }
                    } catch (e) {
                        alert("မှားယွင်းသော ဒေတာဖြစ်သည်။");
                    }
                })
                .catch(err => alert("ကူးထည့်ရာတွင် အမှားတစ်ခုဖြစ်သည်။"));
        });
        
        clearBetsBtn.addEventListener('click', function() {
            if (confirm("ထိုးကြေးစာရင်းအားလုံးကို ဖျက်ရန် သေချာပါသလား?")) {
                betsData = [];
                renderBets();
                saveDataToLocalStorage();
            }
        });
        
        // ထိုးကြေးအမျိုးအစား ခလုတ်များ
        betTypeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                setBetType(type);
            });
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
            alert("ပေါက်ဂဏန်းများ ရှင်းလင်းပြီးပါပြီ။");
        });
        
        // ရက်လိုက်ပြန်ကြည့်ရန်
        viewHistoryBtn.addEventListener('click', viewHistory);
        
        // ထိပ်၊ နောက်၊ အပူး ခလုတ်များအတွက် အထူးလုပ်ဆောင်ချက်များ
        frontBtn.addEventListener('click', function() {
            setBetType('front');
        });
        
        backBtn.addEventListener('click', function() {
            setBetType('back');
        });
        
        doubleBtn.addEventListener('click', function() {
            setBetType('double');
        });
        
        singleBtn.addEventListener('click', function() {
            setBetType('single');
        });
    }
    
    // အပလီကေးရှင်းကို စတင်ခြင်း
    init();
});
