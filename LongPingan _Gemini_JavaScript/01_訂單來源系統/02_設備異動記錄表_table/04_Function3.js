/**
 * 功能三：產出「司機最新狀態主資料表」
 * 邏輯：
 * 1. 讀取「過濾電話重覆」工作表。
 * 2. 以「司機姓名」為 Key，利用 Map 結構只保留最後一筆出現的資訊（最新狀態）。
 * 3. 輸出僅含「司機、車號、電話」三欄的清單，並按姓名排序。
 */
function runStep3() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // 抓取 Step2 產生的結果
  var sourceSheet = ss.getSheetByName("過濾電話重覆");
  
  if (!sourceSheet) {
    SpreadsheetApp.getUi().alert('錯誤：找不到資料源，請先執行 Step2。');
    return;
  }
  
  var rawData = sourceSheet.getDataRange().getValues();
  if (rawData.length < 2) return;
  rawData.shift(); // 移除標題列

  // 1. 利用 Map 提取每個司機最後出現的紀錄
  var latestInfoMap = new Map();
  rawData.forEach(function(row) {
    var name = row[2].toString().trim();  // 司機
    var car = row[3].toString().trim();   // 車號
    var phone = row[4].toString().trim(); // 電話內容 (已換行)
    
    // 存入 Map，重複的司機姓名會被後面的紀錄覆蓋，確保拿到的是表格最後方的最新狀態
    latestInfoMap.set(name, { car: car, phone: phone });
  });

  // 2. 建立輸出陣列（僅需三欄）
  var finalResult = [['司機', '車號', '電話']];
  
  // 取得所有司機姓名並按筆劃/字母排序
  var sortedNames = Array.from(latestInfoMap.keys()).sort();
  sortedNames.forEach(function(name) {
    var info = latestInfoMap.get(name);
    finalResult.push([name, info.car, info.phone]);
  });

  // 3. 輸出到「Make 司機資料」
  var outName = "Make 司機資料";
  var outSheet = ss.getSheetByName(outName) || ss.insertSheet(outName);
  outSheet.clear();
  
  // 格式化：電話欄位 (C欄) 設為純文字並自動換行
  outSheet.getRange("C:C").setNumberFormat("@");
  outSheet.getRange("C:C").setWrap(true);
  
  // 寫入資料
  if (finalResult.length > 1) {
    outSheet.getRange(1, 1, finalResult.length, 3).setValues(finalResult);
    
    // 美化外觀：頂端對齊、自動調整欄寬
    outSheet.getRange(1, 1, finalResult.length, 3).setVerticalAlignment("top");
    outSheet.autoResizeColumns(1, 3);
  }
  
  outSheet.activate();
  SpreadsheetApp.getUi().alert('「司機主資料表」已產生！\n名稱：' + outName + '\n僅包含司機、車號、電話三欄。');
}