# 02_設備異動記錄表

## SheetName: 司機異動記錄

### SheetFunction: 使用者主要操作表，用於新增、修改、刪除司機異動資料輸入

### Columns:
A: 異動日期
B: 異動類型
C: 司機
D: 車號
E: 電話
F:
G:
H:
I:
J:

---

## SheetName: 司機資料

### SheetFunction: 使用者主要查詢 / 使用之最終司機主資料表 / 資料來源於03_AutoMakeDriverData

### Columns:
A: 司機
B: 車號
C: 電話
D:
E:
F:

---

## SheetName: 下拉選單

### SheetFunction: 提供「司機異動記錄」中異動類型欄位的下拉選單來源 / 資料來源於Leo建立

### Columns:
A: 異動類型
B:
C:
D:
E:
F:
G:
H:
I:
J:

---

## SheetName: 00_ManualFromMainTable

### SheetFunction: 手動從公司大匯表複製來源資料，作為 Function1 前置輸入來源表 / 資料來源於Leo建立

### SourceFunction:
手動建立（非自動）

### OutputTarget:
01_AutoMakeDriverUpdate

### Columns:
A: 預約日期
B: 司機
C: 車號
D: 電話
E:
F:
G:
H:
I:
J:

---

## SheetName: 01_AutoMakeDriverUpdate

### SheetFunction: 由 02_Function1.js 自動產生司機異動記錄測試表

### SourceFunction:
02_Function1.js

### OutputTarget:
02_RemoveRepeatPhone

### Columns:
A: 異動日期
B: 異動類型
C: 司機
D: 車號
E: 電話
F:
G:
H:
I:
J:

---

## SheetName: 02_RemoveRepeatPhone

### SheetFunction: 由 03_Function2.js 過濾電話重複後產出之清洗資料表

### SourceFunction:
03_Function2.js

### OutputTarget:
03_AutoMakeDriverData

### Columns:
A: 異動日期
B: 異動類型
C: 司機
D: 車號
E: 電話
F:
G:
H:
I:
J:

---

## SheetName: 03_AutoMakeDriverData

### SheetFunction: 由 04_Function3.js 自動產生最終司機資料測試表

### SourceFunction:
04_Function3.js

### OutputTarget:
司機資料

### Columns:
A: 司機
B: 車號
C: 電話
D:
E:
F:

---

## FunctionFile: 05_Function4.js

### FunctionName: triggerSystem(e)

### FunctionPurpose:
當使用者在 Sheet「司機異動記錄」完成一列資料輸入後，自動驗證資料並同步更新 Sheet「司機資料」。

### TriggerType:
onEdit(e)

### InputSheet:
司機異動記錄

### InputColumns:
A: 異動日期
B: 異動類型
C: 司機
D: 車號
E: 電話

### TargetSheet:
司機資料

### TargetColumns:
A: 司機
B: 車號
C: 電話

### ProcessRules:
1. 僅處理 SheetName 為「司機異動記錄」的編輯事件
2. 第 1 列標題列不處理
3. A~E 欄必須全部填寫完成才執行
4. 執行前顯示「資料檢查中」視窗
5. 執行後依結果顯示成功或失敗訊息

### ChangeTypeRules:
1. 新增司機：新增至「司機資料」第 2 列，並檢查司機、車號、電話不可重複
2. 車號-單一更換：依司機姓名更新車號，並檢查新車號不可被佔用
3. 車號-司機互換：依司機與車號進行兩位司機車號互換
4. 電話：依司機姓名更新電話，並檢查電話不可被其他司機佔用
5. 離職司機：依司機姓名刪除該司機資料列

### HelperFunctions:
- formatPhoneCell(sheet, row, value): 將電話欄位設為文字格式並寫入電話
- findInTarget(ts, type, val): 搜尋司機資料中是否已有相同司機、車號或電話

### ValidationRules:
- 異動類型必須符合指定文字
- 司機不可重複
- 車號不可重複
- 電話不可重複
- 電話重複時需提示已佔用的司機姓名
- 找不到目標司機時停止執行並提示錯誤
- 找不到 Sheet「司機資料」時停止執行

### OutputResult:
更新 Sheet「司機資料」

### UserMessage:
- 成功：同步成功，資料已完成唯一性檢查並更新
- 失敗：驗證失敗，顯示錯誤列數與原因

---

# FlowMapFor司機資料:

00_ManualFromMainTable  
→ 01_AutoMakeDriverUpdate  
→ 02_RemoveRepeatPhone  
→ 03_AutoMakeDriverData  
→ 司機資料

# FlowMapFor訂單來源