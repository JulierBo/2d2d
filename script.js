let currentInputMode = "num"; // "num" သို့မဟုတ် "amt"
let bettingEntries = JSON.parse(localStorage.getItem('my2DRecords')) || [];

// Page စဖွင့်ချိန်မှာ Data တွေကို ဆွဲထုတ်ပြမယ်
renderTable();

function appendValue(val) {
    const numField = document.getElementById('displayNum');
    const amtField = document.getElementById('displayAmt');

    if (currentInputMode === "num") {
        if (numField.value.length < 2) numField.value += val; // 2D မို့ ၂ လုံးပဲ လက်ခံမယ်
        if (numField.value.length === 2) currentInputMode = "amt"; // ၂ လုံးပြည့်ရင် ငွေပမာဏဆီ အလိုအလျောက်ပြောင်း
    } else {
        amtField.value += val;
    }
}

function toggleInputType() {
    currentInputMode = (currentInputMode === "num") ? "amt" : "num";
    alert("ယခု " + (currentInputMode === "num" ? "ဂဏန်း" : "ငွေပမာဏ") + " ရိုက်ထည့်နိုင်ပါပြီ");
}

function clearLast() {
    document.getElementById('displayNum').value = "";
    document.getElementById('displayAmt').value = "";
    currentInputMode = "num";
}

function saveEntry() {
    const name = document.getElementById('userName').value || "အမည်မရှိ";
    const num = document.getElementById('displayNum').value;
    const amt = document.getElementById('displayAmt').value;

    if (num === "" || amt === "") {
        alert("ဂဏန်းနှင့် ငွေပမာဏ ပြည့်စုံအောင် ထည့်ပါ။");
        return;
    }

    const entry = { name, num, amt: parseInt(amt) };
    bettingEntries.push(entry);

    // LocalStorage မှာ သိမ်းမယ်
    localStorage.setItem('my2DRecords', JSON.stringify(bettingEntries));

    // UI အသစ်ပြန်ပြမယ်
    renderTable();
    clearLast();
}

function renderTable() {
    const list = document.getElementById('dataList');
    const totalDisp = document.getElementById('totalPriceDisplay');
    list.innerHTML = "";
    let total = 0;

    bettingEntries.forEach((item) => {
        total += item.amt;
        list.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.num}</td>
                <td>${item.amt.toLocaleString()}</td>
            </tr>
        `;
    });

    totalDisp.innerText = total.toLocaleString();
}

function clearAllData() {
    if (confirm("စာရင်းအားလုံးကို ဖျက်ပစ်ရန် သေချာပါသလား?")) {
        bettingEntries = [];
        localStorage.removeItem('my2DRecords');
        renderTable();
    }
}
