# Gemini_JavaScript / 龍平安公司級系統規則

# 00_SystemRules.md

### Version: v1.0

---

# Rule_001：核心原則

## 統一性 > 可讀性

所有命名、結構、流程優先統一，不因個別情況混用格式。

---

# Rule_002：系統分層原則

## 命名依層級：

# 系統 → 模組 → 功能 → 文件

---

### 範例:

```txt
Gemini_JavaScript
└── 01_訂單來源系統
    ├── 01_訂單來源_table
    └── 02_設備異動記錄表
```

---

# Rule_003：主資料夾命名規則

## 格式：

# 數字_系統名稱

---

### 範例:

```txt
01_訂單來源系統
02_其他系統
```

---

# Rule_004：子模組資料夾命名規則

## 格式：

# 數字_模組名稱

---

### 範例:

```txt
01_訂單來源_table
02_設備異動記錄表
```

---

# Rule_005：JavaScript / Apps Script 命名規則

## 格式：

# 數字_功能名稱.js

---

### 範例:

```txt
01_Main.js
02_Sync_Driver.js
03_Time_Rule.js
```

---

# Rule_006：01_Main.js 定義

## 01_Main.js 為每個模組固定主入口

---

### 必含功能:

* onOpen
* onEdit
* Menu
* Trigger
* 主控流程

---

## 原則：

# Menu 不獨立成檔，所有 Menu 功能整合進 Main

---

# Rule_007：功能檔命名規則

## 格式：

# 02_功能名稱.js 起

---

### 範例:

```txt
02_Function1.js
03_Function2.js
04_Function3.js
05_Function4.js
```

---

# Rule_008：Markdown 結構文件命名規則

## 每個模組固定：

# 00_SheetStructure.md

---

## 用途：

記錄該模組所有 Google Sheet 結構、SheetName、SheetFunction、Columns。

---

# Rule_009：SheetStructure 文件格式

```txt
# 表名稱

## SheetName: 工作表名稱

### SheetFunction: 功能用途

### Columns:
A: 欄位
B: 欄位
C: 欄位
```

---

# Rule_010：SheetStructure 命名格式統一

## 固定使用：

* SheetName
* SheetFunction
* Columns

---

## 禁止混用：

* Sheet Name
* sheet_name
* Note

---

# Rule_011：Google Sheet 命名原則

## SheetName 以使用者端為主，可偏直觀操作

---

### 範例:

```txt
01_Main
選單來源
司機異動記錄
```

---

# Rule_012：使用者端與工程端分離

## Google Sheet：

偏一般使用者操作理解

---

## GitHub / JS：

偏工程結構、維護、排序

---

# Rule_013：Backup 命名規則

## 固定：

# 00_Backup

---

# Rule_014：排序規則

## 所有排序一律兩位數：

* 00
* 01
* 02
* 03

---

## 禁止：

* 1
* 2
* 3

---

# Rule_015：禁止命名規則

## 禁止以下名稱：

```txt
new.js
final.js
最新版.js
test.js
test2.js
```

---

## 原因：

避免版本混亂、搜尋困難、交接失控。

---

# Rule_016：規則更新方式

## 新增規則：

```txt
更新規則：
內容
```

---

## 修改規則：

```txt
修改規則：
內容
```

---

## 刪除規則：

```txt
刪除規則：
內容
```

---

## 原則：

你負責決策，我負責整理、重編號、結構化。

---

# Rule_017：00_SystemRules.md 定位

## 此文件屬於：

# Gemini_JavaScript 全系統最高規則文件

---

## 放置位置：

```txt
DATA:\Leo\00_SystemRules.md
```

---

# Rule_018：開發核心目的

## 本規則服務：

* 放假時間快速開發
* 公司流程工具化
* Google 試算表系統化
* GitHub 長期維護
* GPT / Gemini 協作
* 降低重工
* 離職前完整保留開發資產

---

# Rule_019：一句話總結

# 系統先分層、Main統入口、Sheet獨立結構、規則集中管理。
