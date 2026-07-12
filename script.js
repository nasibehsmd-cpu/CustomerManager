// ======================================
// Customer Manager v1.0
// شرکت انتخاب نیک
// ======================================

let database = [];
let searchResult = [];

const monthOrder = {
    "فروردین":1,
    "اردیبهشت":2,
    "خرداد":3,
    "تیر":4,
    "مرداد":5,
    "شهریور":6,
    "مهر":7,
    "آبان":8,
    "آذر":9,
    "دی":10,
    "بهمن":11,
    "اسفند":12
};

window.onload = function(){

    loadData();

    document
    .getElementById("searchBtn")
    .addEventListener("click",searchCustomer);

    document
    .getElementById("searchBox")
    .addEventListener("keydown",function(e){

        if(e.key==="Enter"){

            searchCustomer();

        }

    });

};



// خواندن data.json

async function loadData(){

    try{

        let response = await fetch("data.json");

        database = await response.json();

        // مرتب سازی اولیه

        database.sort(function(a,b){

            let ma = monthOrder[a["ماه"]] || 0;
            let mb = monthOrder[b["ماه"]] || 0;

            if(ma!==mb){

                return mb-ma;

            }

            return Number(b["تاریخ"])-Number(a["تاریخ"]);

        });

        document.getElementById("result").innerHTML =

        "<div class='welcome'>"+
        "<h2>اطلاعات آماده است</h2>"+
        "<p>"+database.length+" رکورد بارگذاری شد.</p>"+
        "</div>";

    }

    catch(err){

        document.getElementById("result").innerHTML=

        "<h2 style='color:red'>خطا در خواندن data.json</h2>";

        console.log(err);

    }

}



// جستجو

function searchCustomer(){

    let text = document
    .getElementById("searchBox")
    .value
    .trim()
    .toLowerCase();

    if(text===""){

        alert("نام، آدرس یا شماره موبایل را وارد کنید.");

        return;

    }

    searchResult = database.filter(function(item){

        return item["جستجو"].includes(text);

    });

    if(searchResult.length===0){

        document.getElementById("result").innerHTML=

        "<h2>❌ مشتری پیدا نشد</h2>";

        return;

    }

    showSearchList();

}
// ======================================
// نمایش لیست مشتری های پیدا شده
// ======================================

function showSearchList(){

    let unique = {};
    let customers = [];

    searchResult.forEach(function(item){

        let name = (item["مشتری"] || "").trim();
        let address = (item["آدرس"] || "").trim();

        let key = name + "|" + address;

        if(!unique[key]){

            unique[key] = true;
            customers.push({
                name:name,
                address:address
            });

        }

    });

    let html = "";

    html += "<h2>نتیجه جستجو</h2>";

    html += "<p>تعداد مشتری : <b>"+customers.length+"</b></p>";

    customers.forEach(function(c,index){

        html += `

        <div class="card">

            <h3>${index+1} - ${c.name}</h3>

            <div class="info">

            📍 ${c.address}

            </div>

            <button class="action"

            onclick="openCustomer('${c.name.replace(/'/g,"\\'")}','${c.address.replace(/'/g,"\\'")}')">

            مشاهده اطلاعات

            </button>

        </div>

        `;

    });

    document.getElementById("result").innerHTML = html;

}



// ======================================
// باز کردن اطلاعات مشتری
// ======================================

function openCustomer(name,address){

    let history = database.filter(function(item){

        return item["مشتری"]===name &&
               item["آدرس"]===address;

    });

    history.sort(function(a,b){

        let ma = monthOrder[a["ماه"]] || 0;
        let mb = monthOrder[b["ماه"]] || 0;

        if(ma!==mb){

            return mb-ma;

        }

        return Number(b["تاریخ"]) - Number(a["تاریخ"]);

    });

    let last = history[0];

    let html = "";

    html += `

    <div class="card">

    <h2>${last["مشتری"]}</h2>

    <div class="info">📍 ${last["آدرس"]}</div>

    <div class="info">📅 آخرین سرویس : ${last["ماه"]} ${last["تاریخ"]}</div>

    <div class="info">🔢 تعداد دفعات انجام کار : ${history.length}</div>

    <div class="info">👷 آخرین پرسنل : ${last["پرسنل"]}</div>

    <div class="info">💰 مبلغ : ${Number(last["مبلغ"]||0).toLocaleString()}</div>

    <div class="info">📱 موبایل : ${last["موبایل"]}</div>

    <br>

    <button class="action"

    onclick="showHistory('${name.replace(/'/g,"\\'")}','${address.replace(/'/g,"\\'")}')">

    نمایش همه سوابق

    </button>

    </div>

    `;

    document.getElementById("result").innerHTML = html;

}
// ======================================
// نمایش تمام سوابق مشتری
// ======================================

function showHistory(name,address){

    let history = database.filter(function(item){

        return item["مشتری"]===name &&
               item["آدرس"]===address;

    });

    history.sort(function(a,b){

        let ma = monthOrder[a["ماه"]] || 0;
        let mb = monthOrder[b["ماه"]] || 0;

        if(ma!==mb){

            return mb-ma;

        }

        return Number(b["تاریخ"])-Number(a["تاریخ"]);

    });

    let html="";

    html+=`
    <div class="card">

        <h2>${name}</h2>

        <div class="info">
        📍 ${address}
        </div>

        <div class="info">
        🔢 تعداد کل سرویس ها : ${history.length}
        </div>

        <br>

    `;

    history.forEach(function(item,index){

        html+=`

        <div class="card">

            <h3>سرویس ${index+1}</h3>

            <div class="info">
            📅 ${item["ماه"]} ${item["تاریخ"]}
            </div>

            <div class="info">
            👷 پرسنل : ${item["پرسنل"]}
            </div>

            <div class="info">
            🏢 نوع کار : ${item["نوع کار"]}
            </div>

            <div class="info">
            💰 مبلغ :
            ${Number(item["مبلغ"]||0).toLocaleString()}
            </div>

            <div class="info">
            📱 موبایل :
            ${item["موبایل"]}
            </div>

        </div>

        `;

    });

    html+=`

    <button class="action"

    onclick="openCustomer('${name.replace(/'/g,"\\'")}','${address.replace(/'/g,"\\'")}')">

    ⬅ بازگشت

    </button>

    <button class="action"

    onclick="backSearch()">

    🔍 جستجوی جدید

    </button>

    </div>

    `;

    document.getElementById("result").innerHTML=html;

}



// ======================================
// بازگشت به صفحه جستجو
// ======================================

function backSearch(){

    document.getElementById("searchBox").value="";

    document.getElementById("searchBox").focus();

    document.getElementById("result").innerHTML=`

    <div class="welcome">

    <h2>جستجوی مشتری</h2>

    <p>

    نام مشتری، آدرس یا شماره موبایل را وارد کنید.

    </p>

    </div>

    `;

}
// ======================================
// توابع کمکی
// ======================================

function money(value){

    if(value===undefined || value===null) return "";

    value=value.toString().replace(".0","");

    if(value==="") return "";

    return Number(value).toLocaleString("en-US");

}

function safe(value){

    if(value===undefined || value===null){

        return "";

    }

    return value;

}



// ======================================
// جستجوی مجدد
// ======================================

function newSearch(){

    document.getElementById("searchBox").value="";

    document.getElementById("searchBox").focus();

    document.getElementById("result").innerHTML=`

    <div class="welcome">

        <h2>آماده جستجو</h2>

        <p>

        نام مشتری، آدرس یا شماره موبایل را وارد کنید.

        </p>

    </div>

    `;

}



// ======================================
// جستجو هنگام تایپ
// ======================================

document.getElementById("searchBox").addEventListener("input",function(){

    if(this.value.trim()==""){

        newSearch();

    }

});



// ======================================
// نسخه برنامه
// ======================================

console.log("CustomerManager 1.0 Loaded");
// ======================================
// قسمت ۵ - پایان برنامه
// ======================================

// نمایش نسخه
console.log("Customer Manager Version 1.0");


// جستجو با کلیک روی دکمه
document.getElementById("searchBtn").onclick = searchCustomer;


// جستجو با Enter
document.getElementById("searchBox").addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        searchCustomer();

    }

});


// حذف فاصله های اضافی
database.forEach(function(item){

    Object.keys(item).forEach(function(key){

        if(typeof item[key]==="string"){

            item[key]=item[key].trim();

        }

    });

});


// اگر هیچ اطلاعاتی نبود
if(database.length===0){

    document.getElementById("result").innerHTML=

    "<h2 style='color:red'>هیچ اطلاعاتی یافت نشد.</h2>";

}


// آماده شدن برنامه
console.log("Ready...");