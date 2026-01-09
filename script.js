document.addEventListener('DOMContentLoaded', function() {
    // မူရင်းဒေတာများ
    const initialHistoryData = [
        { name: "Mahay Nsum", amount: 172.40 },
        { name: "Acuh", amount: 45.00 },
        { name: "niorer", amount: 8.60 },
        { name: "Darŋ ŁAwie", amount: 62.00 },
        { name: "Name Pum", amount: 52.00 },
        { name: "agen", amount: 22.00 },
        { name: "Seed let", amount: 9.00 },
        { name: "Sold let", amount: 4.00 },
        { name: "bood nouter", amount: 77.00 },
        { name: "bickustust", amount: 2.00 },
        { name: "ronded", amount: 1276.00 }
    ];
    
    const initialNumbers = [7, 8, 8, 9, 9, 9, 4, 2, 5, 6, 3, 66];
    
    // DOM element များ
    const numbersDisplay = document.getElementById('numbersDisplay');
    const historyTableBody = document.getElementById('historyTableBody');
    const totalAmountElement = document.getElementById('totalAmount');
    const deleteBtn = document.getElementById('deleteBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const submitBtn = document.getElementById('submitBtn');
    const backToAppBtn = document.getElementById('backToAppBtn');
    const addModal = document.getElementById('addModal');
    const saveNewBtn = document.getElementById('saveNewBtn');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelModalBtn = document.querySelector('.btn-cancel');
    const keyButtons = document.querySelectorAll('.key:not(.del)');
    const userNameInput = document.getElementById('userName');
    const userRoleSelect = document.getElementById('userRole');
    const customNameInput = document.getElementById('customName');
    
    // နောက်ခံဒေတာများ
    let selectedNumbers = [...initialNumbers];
    let historyData = [...initialHistoryData];
    let totalAmount = 23;
    
    // နံပါတ်များကို ပြသရန်
    function renderNumbers() {
        numbersDisplay.innerHTML = '';
        
        if (selectedNumbers.length === 0) {
            numbersDisplay.innerHTML = '<div class="empty-message">နံပါတ်များ ထည့်သွင်းပါ</div>';
            return;
        }
        
        selectedNumbers.forEach((number, index) => {
            const numberBadge = document.createElement('div');
            numberBadge.className = 'number-badge';
            numberBadge.innerHTML = `
                ${number}
                <button class="remove-number" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            numbersDisplay.appendChild(numberBadge);
        });
        
        // နံပါတ်ဖျက်ရန် ခလုတ်များ
        document.querySelectorAll('.remove-number').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeNumber(index);
            });
        });
    }
    
    // သမိုင်းဇယားကို ပြသရန်
    function renderHistory() {
        historyTableBody.innerHTML = '';
        
        historyData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.amount.toLocaleString()} ကျပ်</td>
                <td>
                    <button class="action-btn edit-btn" data-index="${index}">
                        <i class="fas fa-edit"></i> ပြင်မည်
                    </button>
                    <button class="action-btn delete-btn" data-index="${index}">
                        <i class="fas fa-trash-alt"></i> ဖျက်မည်
                    </button>
                </td>
            `;
            historyTableBody.appendChild(row);
        });
        
        // ပြင်ဆင်ရန် ခလုတ်များ
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                editHistoryItem(index);
            });
        });
        
        // ဖျက်ရန် ခလုတ်များ
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteHistoryItem(index);
            });
        });
    }
    
    // စုစုပေါင်းကို အပ်ဒိတ်လုပ်ရန်
    function updateTotal() {
        totalAmountElement.textContent = `${totalAmount.toLocaleString()} ကျပ်`;
    }
    
    // နံပါတ်ထည့်ရန်
    function addNumber(number) {
        selectedNumbers.push(number);
        renderNumbers();
    }
    
    // နံပါတ်ဖျက်ရန်
    function removeNumber(index) {
        selectedNumbers.splice(index, 1);
        renderNumbers();
    }
    
    // သမိုင်းအရာတစ်ခုကို ပြင်ဆင်ရန်
    function editHistoryItem(index) {
        const item = historyData[index];
        const newName = prompt("အမည်အသစ်ထည့်ပါ:", item.name);
        
        if (newName !== null && newName.trim() !== '') {
            const newAmount = parseFloat(prompt("ငွေပမာဏအသစ်ထည့်ပါ (ကျပ်):", item.amount));
            
            if (!isNaN(newAmount)) {
                historyData[index] = {
                    name: newName.trim(),
                    amount: newAmount
                };
                renderHistory();
            }
        }
    }
    
    // သမိုင်းအရာတစ်ခုကို ဖျက်ရန်
    function deleteHistoryItem(index) {
        if (confirm("ဤအရာကို ဖျက်ရန် သေချာပါသလား?")) {
            historyData.splice(index, 1);
            renderHistory();
        }
    }
    
    // အသစ်ထည့်ရန် modal ဖွင့်ရန်
    function openAddModal() {
        document.getElementById('newName').value = '';
        document.getElementById('newAmount').value = '';
        addModal.style.display = 'flex';
    }
    
    // အစပြုရန်
    function init() {
        // နံပါတ်များကို ပြသခြင်း
        renderNumbers();
        
        // သမိုင်းဇယားကို ပြသခြင်း
        renderHistory();
        
        // စုစုပေါင်းကို ပြသခြင်း
        updateTotal();
        
        // နံပါတ်ခလုတ်များ
        keyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                addNumber(value);
            });
        });
        
        // ဖျက်ရန် ခလုတ်
        deleteBtn.addEventListener('click', function() {
            if (selectedNumbers.length > 0) {
                selectedNumbers.pop();
                renderNumbers();
            }
        });
        
        // အားလုံးဖျက်ရန် ခလုတ်
        clearAllBtn.addEventListener('click', function() {
            if (confirm("နံပါတ်အားလုံးကို ဖျက်ရန် သေချာပါသလား?")) {
                selectedNumbers = [];
                renderNumbers();
            }
        });
        
        // အတည်ပြုရန် ခလုတ်
        submitBtn.addEventListener('click', function() {
            if (selectedNumbers.length === 0) {
                alert("ကျေးဇူးပြု၍ နံပါတ်များ ထည့်သွင်းပါ။");
                return;
            }
            
            const numbersString = selectedNumbers.join(', ');
            const amount = selectedNumbers.length * 100; // နမူနာတွက်ချက်မှု
            totalAmount += amount;
            
            alert(`အောင်မြင်ပါသည်!\nနံပါတ်များ: ${numbersString}\nထပ်တိုးငွေပမာဏ: ${amount.toLocaleString()} ကျပ်`);
            
            updateTotal();
            selectedNumbers = [];
            renderNumbers();
        });
        
        // အက်ပ်သို့ ပြန်သွားရန် ခလုတ်
        backToAppBtn.addEventListener('click', function() {
            alert("အက်ပ်သို့ ပြန်သွားပါမည်...");
            // အက်ပ်သို့ ပြန်သွားရန် ကုဒ်များ ဤနေရာတွင် ထည့်သွင်းနိုင်သည်
        });
        
        // Modal အတွက် ကုဒ်များ
        closeModalBtn.addEventListener('click', function() {
            addModal.style.display = 'none';
        });
        
        cancelModalBtn.addEventListener('click', function() {
            addModal.style.display = 'none';
        });
        
        // အသစ်သိမ်းရန် ခလုတ်
        saveNewBtn.addEventListener('click', function() {
            const newName = document.getElementById('newName').value.trim();
            const newAmount = parseFloat(document.getElementById('newAmount').value);
            
            if (!newName) {
                alert("ကျေးဇူးပြု၍ အမည်ထည့်သွင်းပါ။");
                return;
            }
            
            if (isNaN(newAmount) || newAmount <= 0) {
                alert("ကျေးဇူးပြု၍ မှန်ကန်သော ငွေပမာဏထည့်သွင်းပါ။");
                return;
            }
            
            historyData.push({
                name: newName,
                amount: newAmount
            });
            
            renderHistory();
            addModal.style.display = 'none';
            
            alert(`အသစ်ထည့်သွင်းခြင်း အောင်မြင်ပါသည်!\nအမည်: ${newName}\nငွေပမာဏ: ${newAmount.toLocaleString()} ကျပ်`);
        });
        
        // သမိုင်းဇယားကို နှိပ်၍ အသစ်ထည့်ရန် modal ဖွင့်ခြင်း
        historyTableBody.addEventListener('click', function(e) {
            if (e.target.tagName === 'TD' && e.target.cellIndex === 1) {
                openAddModal();
            }
        });
        
        // မူရင်းဒေတာများကို သိမ်းဆည်းခြင်း
        userNameInput.value = "noub abb8";
        userRoleSelect.value = "admin";
        customNameInput.value = "WinningNum";
        
        // စာသားများကို မြန်မာဘာသာပြန်ခြင်း
        document.querySelectorAll('button, label, th, td').forEach(element => {
            const text = element.textContent;
            // ဤနေရာတွင် စာသားပြန်ဆိုမှုများ လုပ်ဆောင်နိုင်သည်
        });
    }
    
    // အပလီကေးရှင်းကို စတင်ခြင်း
    init();
});
