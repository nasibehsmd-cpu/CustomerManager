import pandas as pd
import json

FILE_NAME = "فروردین1405.xlsx"

excel = pd.ExcelFile(FILE_NAME)

data = []

count = {}

print("شروع خواندن اکسل...")

for sheet in excel.sheet_names:

    if sheet == "پیگیری ها":
        print("رد شد:", sheet)
        continue

    print("در حال خواندن:", sheet)

    df = pd.read_excel(FILE_NAME, sheet_name=sheet)

    df = df.fillna("")

    for _, row in df.iterrows():

        customer = str(row.get("نام مشتری", "")).strip()
        address = str(row.get("آدرس", "")).strip()

        if customer == "" and address == "":
            continue

        key = customer + "|" + address

        count[key] = count.get(key, 0) + 1

        mobile = str(row.get("موبایل", "")).replace(".0", "").strip()

        item = {

            "ماه": sheet,

            "تاریخ": str(row.get("تاریخ", "")).strip(),

            "روز": str(row.get("روز", "")).strip(),

            "مشتری": customer,

            "آدرس": address,

            "مبلغ": str(row.get("مبلغ", "")).replace(".0", "").strip(),

            "ثابت": str(row.get("ثابت", "")).strip(),

            "موبایل": mobile,

            "پرسنل": str(row.get("پرسنل معرفی شده", "")).strip(),

            "نوع کار": str(row.get("نوع کار", "")).strip()

        }

        data.append(item)


# اضافه کردن تعداد دفعات انجام کار و متن جستجو
for item in data:

    key = item["مشتری"] + "|" + item["آدرس"]

    item["تعداد کار انجام شده"] = count[key]

    item["جستجو"] = (
        item["مشتری"] + " " +
        item["آدرس"] + " " +
        item["موبایل"]
    ).lower()


with open("data.json", "w", encoding="utf-8") as f:

    json.dump(data, f, ensure_ascii=False, indent=4)

print("✅ تمام شد")
print("تعداد اطلاعات:", len(data))
print("