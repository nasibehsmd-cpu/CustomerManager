// ======================================
// Customer Manager v1.1
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


    const searchBtn = document.getElementById("searchBtn");

    if(searchBtn){

        searchBtn.addEventListener(
            "click",
            searchCustomer
        );

    }



    const searchBox = document.getElementById("searchBox");


    if(searchBox){

        searchBox.addEventListener(
            "keydown",
            function(e){

                if(e.key==="Enter"){

                    searchCustomer();

                }

            }
        );


        searchBox.addEventListener(
            "input",
            function(){

                if(this.value.trim()===""){

                    newSearch();

                }

            }
        );

    }



    setupPhone();


    setupNavigation();


};




// ======================================
// خواندن اطلاعات مشتری ها
// ======================================


async function loadData(){

    try{


        let response = await fetch("data.json");


        database = await response.json();



        database.sort(function(a,b){


            let ma = monthOrder[a["ماه"]] || 0;

            let mb = monthOrder[b["ماه"]] || 0;



            if(ma!==mb){

                return mb-ma;

            }



            return Number(b["تاریخ"])-Number(a["تاریخ"]);



        });



        let result = document.getElementById("result");


        if(result){

            result.innerHTML = `

            <div class="welcome">

            <h2>اطلاعات آماده است</h2>

            <p>
            ${database.length} رکورد بارگذاری شد.
            </p>

            </div>

            `;

        }


    }
    catch(err){


        console.log(err);
// ======================================
// جستجوی مشتری
// ======================================

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


        return item["جستجو"]
        .toString()
        .toLowerCase()
        .includes(text);



    });





    if(searchResult.length===0){


        document.getElementById("result").innerHTML=

        "<h2>❌ مشتری پیدا نشد</h2>";


        return;

    }



    showSearchList();



}





// ======================================
// نمایش لیست مشتری ها
// ======================================


function showSearchList(){


    let unique = {};

    let customers = [];



    searchResult.forEach(function(item){



        let name = (item["مشتری"] || "").trim();

        let address = (item["آدرس"] || "").trim();



        let key = name+"|"+address;



        if(!unique[key]){


            unique[key]=true;



            customers.push({

                name:name,

                address:address

            });


        }



    });




    let html="";



    html += "<h2>نتیجه جستجو</h2>";



    html += "<p>تعداد مشتری : <b>"+
    customers.length+
    "</b></p>";





    customers.forEach(function(c,index){



        html += `


        <div class="card">


        <h3>
        ${index+1} - ${c.name}
        </h3>


        <div class="info">

        📍 ${
// ======================================
// نمایش سوابق مشتری
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


        return Number(b["تاریخ"]) -
        Number(a["تاریخ"]);


    });



    let html = `


    <div class="card">


    <h2>${name}</h2>


    <div class="info">
    📍 ${address}
    </div>


    <div class="info">
    🔢 تعداد کل سرویس ها :
    ${history.length}
    </div>


    `;



    history.forEach(function(item,index){



        html += `


        <div class="card">


        <h3>
        سرویس ${index+1}
        </h3>



        <div class="info">
        📅 ${item["ماه"]}
        ${item["تاریخ"]}
        </div>



        <div class="info">
        👷 پرسنل :
        ${item["پرسنل"]}
        </div>



        <div class="info">
        🏢 نوع کار :
        ${item["نوع کار"]}
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




    html += `


    <button class="action"

    onclick="openCustomer('${escapeText(name)}','${escapeText(address)}')">


    ⬅ بازگشت


    </button>



    <button class="action"

    onclick="newSearch()">


    🔍 جستجوی جدید


    </
// ======================================
// شماره گیر تلفن
// ======================================

function setupPhone(){


    let keys = document.querySelectorAll(".dialKey");


    let display = document.getElementById("dialNumber");



    if(display){


        keys.forEach(function(key){


            key.addEventListener("click",function(){


                display.value += this.innerText;


            });



        });



    }




    let clearBtn = document.getElementById("clearBtn");



    if(clearBtn){



        clearBtn.addEventListener("click",function(){


            if(display){

                display.value="";

            }


        });



    }




    let callBtn = document.getElementById("callBtn");



    if(callBtn){



        callBtn.addEventListener("click",function(){


            if(display && display.value){


                window.location.href =
                "tel:" + display.value;



            }
            else{


                alert("شماره را وارد کنید.");


            }



        });



    }


}





// ======================================
// جابه جایی صفحات
// ======================================

function setupNavigation(){



    const homeTab =
    document.getElementById("homeTab");



    const phoneTab =
    document.getElementById("phoneTab");



    const contactsTab =
    document.getElementById("contactsTab");



    const smsTab =
    document.getElementById("smsTab");





    if(homeTab){

        homeTab.onclick=function(){

            showPage("homePage");

        };

    }





    if(phoneTab){

        phoneTab.onclick=function(){

            showPage("phonePage");

        };

    }





    if(contactsTab){

        contactsTab.onclick=function(){

            showPage("contactsPage");

        };

    }





    if(smsTab){

        smsTab.onclick=function(){

            showPage("smsPage");

        };

    }



}






function showPage(id){



    let pages =
    document.querySelectorAll(".page");



    pages.forEach(function(page){


        page.classList.add("hidden");


    });




    let target =
    document.getElementById(id);



    if(target){


        target.classList.remove("hidden");


    }



}
// ======================================
// آماده سازی اولیه
// ======================================


// جلوگیری از خطا در صورت نبودن المنت ها

document.addEventListener("DOMContentLoaded",function(){


    let searchBox =
    document.getElementById("searchBox");



    if(searchBox){


        searchBox.addEventListener("input",function(){


            if(this.value.trim()===""){


                let result =
                document.getElementById("result");



                if(result){


                    result.innerHTML = `


                    <div class="welcome">


                    <h2>
                    آماده جستجو
                    </h2>


                    <p>
                    نام مشتری، آدرس یا شماره موبایل را وارد کنید.
                    </p>


                    </div>


                    `;


                }


            }


        });



    }



});




// ======================================
// نسخه برنامه
// ======================================

console.log("CustomerManager v1.1 Loaded");

console.log("Ready...");



        let result = document.getElementById("result");


        if(result){

            result.innerHTML =

            "<h2 style='color:red'>خطا در خواندن data.json</h2>";

        }


    }

}
