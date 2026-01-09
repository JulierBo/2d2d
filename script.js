let selectedPersonId = null;

// UI elements
const personListDiv = document.getElementById('personList');
const betListDiv = document.getElementById('betList');
const addBetForm = document.getElementById('addBetForm');
const betModal = document.getElementById('betModal');
const closeModal = document.querySelector('.close');
const resultModal = document.getElementById('resultModal');
const closeResultModal = document.querySelector('.close-result');
const checkResultBtn = document.getElementById('checkResultBtn');
const winningForm = document.getElementById('winningForm');
const resultContent = document.getElementById('resultContent');

// Initialize the application
function init() {
    renderPersonList();
    renderBetList();
    setupEventListeners();
}

// Render person list
function renderPersonList() {
    personListDiv.innerHTML = '';
    namesData.forEach(person => {
        const personDiv = document.createElement('div');
        personDiv.className = `person-item ${selectedPersonId === person.id ? 'selected' : ''}`;
        personDiv.innerHTML = `
            <span>${person.name} (${person.multiplier})</span>
            <button class="btn-add-bet" data-id="${person.id}">+</button>
        `;
        personDiv.addEventListener('click', () => selectPerson(person.id));
        personListDiv.appendChild(personDiv);
    });
}

// Select a person
function selectPerson(id) {
    selectedPersonId = id;
    renderPersonList();
    renderBetList();
}

// Render bet list
function renderBetList() {
    betListDiv.innerHTML = '';
    const filteredBets = selectedPersonId 
        ? betsData.filter(bet => bet.personId === selectedPersonId)
        : betsData;
    
    if (filteredBets.length === 0) {
        betListDiv.innerHTML = '<p class="no-bets">အလောင်းစာရင်းမရှိပါ။</p>';
        return;
    }

    filteredBets.forEach(bet => {
        const betDiv = document.createElement('div');
        betDiv.className = 'bet-item';
        betDiv.innerHTML = `
            <div class="bet-header">
                <span class="bet-person">${bet.personName}</span>
                <span class="bet-date">${formatDate(bet.date)}</span>
            </div>
            <div class="bet-details">
                <span>နံပါတ်: ${bet.number}</span>
                <span>အမျိုးအစား: ${getBetTypeName(bet.type)}</span>
                <span>အလောင်း: ${formatNumber(bet.amount)} ကျပ်</span>
                <span>ထိုးကြေး: ${bet.multiplier}</span>
            </div>
            <button class="btn-delete-bet" data-id="${bet.id}">ဖျက်မယ်</button>
        `;
        betListDiv.appendChild(betDiv);
    });

    // Add delete event listeners
    document.querySelectorAll('.btn-delete-bet').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const betId = parseInt(this.getAttribute('data-id'));
            deleteBet(betId);
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Add bet buttons
    document.querySelectorAll('.btn-add-bet').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const personId = parseInt(this.getAttribute('data-id'));
            openBetModal(personId);
        });
    });

    // Modal close buttons
    closeModal.addEventListener('click', () => betModal.style.display = 'none');
    closeResultModal.addEventListener('click', () => resultModal.style.display = 'none');

    // Check result button
    checkResultBtn.addEventListener('click', openResultModal);

    // Winning form submission
    winningForm.addEventListener('submit', function(e) {
        e.preventDefault();
        checkWinning();
    });

    // Bet form submission
    addBetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewBet();
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === betModal) betModal.style.display = 'none';
        if (e.target === resultModal) resultModal.style.display = 'none';
    });
}

// Open bet modal
function openBetModal(personId) {
    selectedPersonId = personId;
    const person = namesData.find(p => p.id === personId);
    document.getElementById('betPersonName').textContent = person.name;
    document.getElementById('betMultiplier').textContent = person.multiplier;
    betModal.style.display = 'block';
    addBetForm.reset();
}

// Add new bet
function addNewBet() {
    const number = document.getElementById('betNumber').value;
    const type = document.getElementById('betType').value;
    const amount = parseInt(document.getElementById('betAmount').value);

    if (!number || !amount) {
        alert('ကျေးဇူးပြု၍ နံပါတ်နှင့် ပမာဏထည့်ပါ။');
        return;
    }

    const person = namesData.find(p => p.id === selectedPersonId);
    const newBet = {
        id: betsData.length > 0 ? Math.max(...betsData.map(b => b.id)) + 1 : 1,
        personId: selectedPersonId,
        personName: person.name,
        number: number,
        type: type,
        amount: amount,
        multiplier: person.multiplier,
        date: new Date().toISOString()
    };

    betsData.push(newBet);
    betModal.style.display = 'none';
    renderBetList();
    alert('အလောင်းထည့်ခြင်း အောင်မြင်ပါသည်။');
}

// Delete bet
function deleteBet(betId) {
    if (confirm('ဤအလောင်းကို ဖျက်မှာသေချာပါသလား?')) {
        betsData = betsData.filter(bet => bet.id !== betId);
        renderBetList();
    }
}

// Open result modal
function openResultModal() {
    resultModal.style.display = 'block';
    winningForm.reset();
}

// Check winning numbers
function checkWinning() {
    winningNumbers.front = document.getElementById('frontNumber').value;
    winningNumbers.back = document.getElementById('backNumber').value;
    winningNumbers.double = document.getElementById('doubleNumber').value;

    let results = [];
    let totalWinning = 0;

    betsData.forEach(bet => {
        const person = namesData.find(p => p.id === bet.personId);
        let isWin = false;
        let winAmount = 0;
        let winType = '';

        // Check based on bet type
        switch(bet.type) {
            case 'single':
                if (bet.number === winningNumbers.front || 
                    bet.number === winningNumbers.back) {
                    isWin = true;
                    winAmount = bet.amount * bet.multiplier;
                    winType = bet.number === winningNumbers.front ? 'ထိပ်' : 'ပိတ်';
                }
                break;
            case 'front':
                if (bet.number === winningNumbers.front) {
                    isWin = true;
                    winAmount = bet.amount * bet.multiplier;
                    winType = 'ထိပ်';
                }
                break;
            case 'back':
                if (bet.number === winningNumbers.back) {
                    isWin = true;
                    winAmount = bet.amount * bet.multiplier;
                    winType = 'ပိတ်';
                }
                break;
            case 'double':
                if (bet.number === winningNumbers.double) {
                    isWin = true;
                    winAmount = bet.amount * bet.multiplier;
                    winType = 'ဒဲ့';
                }
                break;
            case 'apa':
                const lastTwoDigits = winningNumbers.double ? winningNumbers.double.slice(-2) : '';
                if (bet.number === lastTwoDigits) {
                    isWin = true;
                    winAmount = bet.amount * bet.multiplier;
                    winType = 'အပါ';
                }
                break;
        }

        if (isWin) {
            results.push({
                personName: bet.personName,
                number: bet.number,
                type: getBetTypeName(bet.type),
                amount: bet.amount,
                winAmount: winAmount,
                winType: winType
            });
            totalWinning += winAmount;
        }
    });

    displayResults(results, totalWinning);
}

// Display results
function displayResults(results, totalWinning) {
    resultContent.innerHTML = '';

    if (results.length === 0) {
        resultContent.innerHTML = '<p class="no-win">မည်သူမျှ မနိုင်ပါ။</p>';
        return;
    }

    const resultDiv = document.createElement('div');
    resultDiv.className = 'results';

    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="result-header">
                <strong>${result.personName}</strong>
                <span class="win-type">${result.winType}</span>
            </div>
            <div class="result-details">
                <span>နံပါတ်: ${result.number} (${result.type})</span>
                <span>အလောင်း: ${formatNumber(result.amount)} ကျပ်</span>
                <span class="win-amount">နိုင်ငွေ: ${formatNumber(result.winAmount)} ကျပ်</span>
            </div>
        `;
        resultDiv.appendChild(resultItem);
    });

    const totalDiv = document.createElement('div');
    totalDiv.className = 'total-winning';
    totalDiv.innerHTML = `<strong>စုစုပေါင်းနိုင်ငွေ: ${formatNumber(totalWinning)} ကျပ်</strong>`;
    
    resultContent.appendChild(resultDiv);
    resultContent.appendChild(totalDiv);
}

// Helper functions
function getBetTypeName(type) {
    const typeNames = {
        'single': 'စိန်း',
        'front': 'ထိပ်',
        'back': 'ပိတ်',
        'double': 'ဒဲ့',
        'apa': 'အပါ'
    };
    return typeNames[type] || type;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Initialize the app
init();
// UI ထိန်းချုပ်ရန် function များ
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// လူအသစ်ထည့်သွင်းရန်
function addNewPerson() {
    const personName = prompt('အမည်ထည့်ပါ:');
    if (!personName) return;
    
    const multiplier = prompt('ထိုးကြေးထည့်ပါ (8 သို့မဟုတ် 9):');
    if (!['8', '9'].includes(multiplier)) {
        showNotification('ထိုးကြေးသည် 8 သို့မဟုတ် 9 ဖြစ်ရမည်။', 'error');
        return;
    }
    
    const newPerson = {
        id: namesData.length > 0 ? Math.max(...namesData.map(p => p.id)) + 1 : 1,
        name: personName,
        multiplier: parseInt(multiplier)
    };
    
    namesData.push(newPerson);
    renderPersonList();
    showNotification('လူအသစ်ထည့်သွင်းခြင်းအောင်မြင်ပါသည်။', 'success');
}

// လူစာရင်းဖျက်ရန်
function deletePerson(personId) {
    if (confirm('ဤသူကို စာရင်းမှ ဖျက်မှာသေချာပါသလား? သူ၏အလောင်းများလည်း ဖျက်သွားပါမည်။')) {
        // သက်ဆိုင်ရာအလောင်းများကိုဖျက်
        betsData = betsData.filter(bet => bet.personId !== personId);
        
        // လူစာရင်းမှဖျက်
        namesData = namesData.filter(person => person.id !== personId);
        
        if (selectedPersonId === personId) {
            selectedPersonId = null;
        }
        
        renderPersonList();
        renderBetList();
        showNotification('လူစာရင်းဖျက်ခြင်းအောင်မြင်ပါသည်။', 'success');
    }
}

// စုစုပေါင်းအလောင်းငွေတွက်ရန်
function calculateTotalBets() {
    const total = betsData.reduce((sum, bet) => sum + bet.amount, 0);
    return total;
}

// စုစုပေါင်းနိုင်ငွေတွက်ရန်
function calculateTotalWinnings() {
    if (!winningNumbers.front && !winningNumbers.back && !winningNumbers.double) {
        return 0;
    }
    
    let total = 0;
    betsData.forEach(bet => {
        const person = namesData.find(p => p.id === bet.personId);
        let winAmount = 0;
        
        switch(bet.type) {
            case 'single':
                if (bet.number === winningNumbers.front || bet.number === winningNumbers.back) {
                    winAmount = bet.amount * bet.multiplier;
                }
                break;
            case 'front':
                if (bet.number === winningNumbers.front) {
                    winAmount = bet.amount * bet.multiplier;
                }
                break;
            case 'back':
                if (bet.number === winningNumbers.back) {
                    winAmount = bet.amount * bet.multiplier;
                }
                break;
            case 'double':
                if (bet.number === winningNumbers.double) {
                    winAmount = bet.amount * bet.multiplier;
                }
                break;
            case 'apa':
                const lastTwoDigits = winningNumbers.double ? winningNumbers.double.slice(-2) : '';
                if (bet.number === lastTwoDigits) {
                    winAmount = bet.amount * bet.multiplier;
                }
                break;
        }
        
        total += winAmount;
    });
    
    return total;
}

// ဒေတာသိမ်းဆည်းရန် (Local Storage)
function saveDataToLocalStorage() {
    const data = {
        names: namesData,
        bets: betsData,
        winningNumbers: winningNumbers
    };
    localStorage.setItem('bettingAppData', JSON.stringify(data));
    showNotification('ဒေတာများသိမ်းဆည်းပြီးပါပြီ။', 'success');
}

// ဒေတာပြန်လည်ခေါ်ယူရန်
function loadDataFromLocalStorage() {
    const savedData = localStorage.getItem('bettingAppData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            namesData = data.names || namesData;
            betsData = data.bets || betsData;
            winningNumbers = data.winningNumbers || winningNumbers;
            
            renderPersonList();
            renderBetList();
            showNotification('ဒေတာများပြန်လည်ခေါ်ယူပြီးပါပြီ။', 'success');
        } catch (e) {
            showNotification('ဒေတာခေါ်ယူရာတွင်အမှားတစ်ခုရှိနေပါသည်။', 'error');
        }
    }
}

// ဒေတာရှင်းလင်းရန်
function clearAllData() {
    if (confirm('ဒေတာအားလုံးကို ရှင်းမှာသေချာပါသလား? ဤလုပ်ဆောင်ချက်ကို ပြန်လည်ရယူ၍မရပါ။')) {
        localStorage.removeItem('bettingAppData');
        namesData = [
            { id: 1, name: "ဦးကျော်မြင့်", multiplier: 8 },
            { id: 2, name: "မောင်မျိုးအောင်", multiplier: 9 },
            { id: 3, name: "ဒေါ်စန်းစန်း", multiplier: 8 },
            { id: 4, name: "ဦးအောင်မင်း", multiplier: 8 },
            { id: 5, name: "မောင်သူရ", multiplier: 9 }
        ];
        betsData = [];
        winningNumbers = { front: null, back: null, double: null };
        selectedPersonId = null;
        
        renderPersonList();
        renderBetList();
        showNotification('ဒေတာအားလုံးရှင်းလင်းပြီးပါပြီ။', 'success');
    }
}

// အထူးနံပါတ်များအတွက်စစ်ဆေးခြင်း
function validateBetNumber(number, type) {
    const num = number.trim();
    
    if (type === 'apa') {
        // အပါအတွက် 2 လုံး
        if (num.length !== 2 || isNaN(num)) {
            return false;
        }
    } else if (type === 'double') {
        // ဒဲ့အတွက် 3 လုံး
        if (num.length !== 3 || isNaN(num)) {
            return false;
        }
    } else {
        // ထိပ်/ပိတ်/စိန်းအတွက် 2 လုံး
        if (num.length !== 2 || isNaN(num)) {
            return false;
        }
    }
    
    return true;
}

// စာရင်းဇယားပြသရန်
function showStatistics() {
    const totalBets = calculateTotalBets();
    const totalWinnings = calculateTotalWinnings();
    const totalBetsCount = betsData.length;
    const totalPeople = namesData.length;
    
    let statsHTML = `
        <div class="stats-container">
            <h3>စာရင်းဇယား</h3>
            <div class="stats-item">
                <span>စုစုပေါင်းလူဦးရေ:</span>
                <strong>${totalPeople} ဦး</strong>
            </div>
            <div class="stats-item">
                <span>စုစုပေါင်းအလောင်းအရေအတွက်:</span>
                <strong>${totalBetsCount} ခု</strong>
            </div>
            <div class="stats-item">
                <span>စုစုပေါင်းအလောင်းငွေ:</span>
                <strong>${formatNumber(totalBets)} ကျပ်</strong>
            </div>
            <div class="stats-item">
                <span>စုစုပေါင်းနိုင်ငွေ:</span>
                <strong>${formatNumber(totalWinnings)} ကျပ်</strong>
            </div>
    `;
    
    // လူတစ်ဦးချင်းစီ၏စာရင်း
    namesData.forEach(person => {
        const personBets = betsData.filter(bet => bet.personId === person.id);
        const personTotal = personBets.reduce((sum, bet) => sum + bet.amount, 0);
        const personWinTotal = calculatePersonWinnings(person.id);
        
        if (personBets.length > 0) {
            statsHTML += `
                <div class="person-stats">
                    <strong>${person.name}</strong>
                    <div>အလောင်း: ${formatNumber(personTotal)} ကျပ်</div>
                    <div>နိုင်ငွေ: ${formatNumber(personWinTotal)} ကျပ်</div>
                    <div>အရေအတွက်: ${personBets.length} ခု</div>
                </div>
            `;
        }
    });
    
    statsHTML += '</div>';
    
    // Statistics modal ဖန်တီးပြီးပြသခြင်း
    const statsModal = document.createElement('div');
    statsModal.id = 'statsModal';
    statsModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const statsContent = document.createElement('div');
    statsContent.className = 'stats-content';
    statsContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        width: 90%;
    `;
    
    statsContent.innerHTML = statsHTML;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'ပိတ်မယ်';
    closeBtn.style.cssText = `
        margin-top: 20px;
        padding: 10px 20px;
        background: #f44336;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        width: 100%;
    `;
    closeBtn.onclick = () => statsModal.remove();
    
    statsContent.appendChild(closeBtn);
    statsModal.appendChild(statsContent);
    document.body.appendChild(statsModal);
    
    // Click outside to close
    statsModal.onclick = (e) => {
        if (e.target === statsModal) {
            statsModal.remove();
        }
    };
}

// လူတစ်ဦးချင်းနိုင်ငွေတွက်ခြင်း
function calculatePersonWinnings(personId) {
    if (!winningNumbers.front && !winningNumbers.back && !winningNumbers.double) {
        return 0;
    }
    
    let total = 0;
    const personBets = betsData.filter(bet => bet.personId === personId);
    const person = namesData.find(p => p.id === personId);
    
    personBets.forEach(bet => {
        let winAmount = 0;
        
        switch(bet.type) {
            case 'single':
                if (bet.number === winningNumbers.front || bet.number === winningNumbers.back) {
                    winAmount = bet.amount * person.multiplier;
                }
                break;
            case 'front':
                if (bet.number === winningNumbers.front) {
                    winAmount = bet.amount * person.multiplier;
                }
                break;
            case 'back':
                if (bet.number === winningNumbers.back) {
                    winAmount = bet.amount * person.multiplier;
                }
                break;
            case 'double':
                if (bet.number === winningNumbers.double) {
                    winAmount = bet.amount * person.multiplier;
                }
                break;
            case 'apa':
                const lastTwoDigits = winningNumbers.double ? winningNumbers.double.slice(-2) : '';
                if (bet.number === lastTwoDigits) {
                    winAmount = bet.amount * person.multiplier;
                }
                break;
        }
        
        total += winAmount;
    });
    
    return total;
}

// Control buttons များထည့်သွင်းခြင်း
function addControlButtons() {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'control-buttons';
    controlsDiv.style.cssText = `
        display: flex;
        gap: 10px;
        margin: 20px 0;
        flex-wrap: wrap;
        justify-content: center;
    `;
    
    const buttons = [
        { text: 'လူအသစ်ထည့်မယ်', action: addNewPerson, color: '#4CAF50' },
        { text: 'စာရင်းဇယား', action: showStatistics, color: '#2196F3' },
        { text: 'ဒေတာသိမ်းမယ်', action: saveDataToLocalStorage, color: '#FF9800' },
        { text: 'ဒေတာခေါ်မယ်', action: loadDataFromLocalStorage, color: '#9C27B0' },
        { text: 'အားလုံးရှင်းမယ်', action: clearAllData, color: '#f44336' }
    ];
    
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.text;
        button.style.cssText = `
            padding: 10px 15px;
            background: ${btn.color};
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            flex: 1;
            min-width: 150px;
        `;
        button.onclick = btn.action;
        controlsDiv.appendChild(button);
    });
    
    // Insert controls after the header
    const header = document.querySelector('header');
    header.insertAdjacentElement('afterend', controlsDiv);
}

// CSS animation ထည့်သွင်းခြင်း
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .person-item.selected {
            background-color: #e3f2fd;
            border-left: 4px solid #2196F3;
        }
        
        .bet-item {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        
        .bet-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .win-amount {
            color: #4CAF50;
            font-weight: bold;
        }
        
        .no-bets, .no-win {
            text-align: center;
            color: #888;
            padding: 40px;
            font-style: italic;
        }
        
        .stats-container {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        
        .stats-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
        }
        
        .person-stats {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid #4CAF50;
        }
        
        .result-item {
            background: #e8f5e9;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            border-left: 4px solid #4CAF50;
        }
        
        .win-type {
            background: #4CAF50;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
        }
        
        .btn-delete-bet {
            background: #f44336;
            color: white;
            border: none;
            padding: 5px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
            float: right;
        }
        
        .btn-delete-bet:hover {
            background: #d32f2f;
        }
        
        .btn-add-bet {
            background: #4CAF50;
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
        }
        
        .btn-add-bet:hover {
            background: #45a049;
        }
        
        .total-winning {
            background: #4CAF50;
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
            font-size: 18px;
        }
    `;
    document.head.appendChild(style);
}

// စတင်လုပ်ဆောင်ခြင်း
function enhancedInit() {
    init(); // မူလ init function ကိုခေါ်
    addStyles();
    addControlButtons();
    
    // စာမျက်နှာတင်၍ Local Storage မှဒေတာခေါ်ယူ
    window.addEventListener('load', () => {
        setTimeout(loadDataFromLocalStorage, 1000);
    });
    
    // စာမျက်နှာမှထွက်ခွာခါနီးတွင် ဒေတာသိမ်းဆည်း
    window.addEventListener('beforeunload', (e) => {
        saveDataToLocalStorage();
    });
}

// Enhanced initialization ကိုစတင်ခြင်း
enhancedInit();
