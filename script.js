let currentInput = "";

function appendNum(num) {
    // ဥပမာ- ဂဏန်းရိုက်ထည့်သည့် logic
    console.log("နှိပ်လိုက်သောဂဏန်း:", num);
    // ဒီနေရာမှာ input field ထဲကို data ထည့်တဲ့ function ရေးလို့ရပါတယ်
}

function clearInput() {
    currentInput = "";
    alert("ဖျက်လိုက်ပါပြီ");
}

// ခလုတ်နှိပ်လိုက်ရင် တုံ့ပြန်မှုပေးဖို့ ဥပမာ
document.querySelector('.history-btn').addEventListener('click', () => {
    alert("မှတ်တမ်းစာမျက်နှာသို့ သွားပါမည်");
});
