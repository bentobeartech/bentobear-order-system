/**
 * 功能二：最終整理 (電話合併換行、刪除電話列、跨日期去重)
 * 邏輯：
 * 1. 收集每位司機出現過的所有電話，去除重複並格式化。
 * 2. 移除異動類型為「電話」的列。
 * 3. 將合併後的電話字串填回剩餘的「新增司機」與「車號」列中。
 * 4. 進行最後的跨日期資料去重。
 */
function runStep2() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = ss.getSheetByName("產生司機異動記錄");
  
  if (!sourceSheet) {
    SpreadsheetApp.getUi().alert('錯誤：找不到資料源，請確認「產生司機異動記錄」分頁存在。');
    return;
  }
  
  var rawData = sourceSheet.getDataRange().getValues();
  if (rawData.length < 2) return;
  rawData.shift(); // 移除標題列
  
  // 1. 收集電話 (嚴格補0並去重)
  var driverPhonesMap = {}; 
  rawData.forEach(function(row) {
    var name = row[2].toString().trim();
    // 徹底清除所有符號（包含之前可能留下的單引號），只拿純數字
    var phoneRaw = row[4].toString().replace(/[^0-9]/g, '').trim(); 
    
    if (phoneRaw !== "") {
      // 處理 9 位數補 0
      if (phoneRaw.length === 9 && phoneRaw.startsWith('9')) phoneRaw = "0" + phoneRaw;
      if (!driverPhonesMap[name]) driverPhonesMap[name] = [];
      // 確保同一司機的電話陣列中不重複
      if (driverPhonesMap[name].indexOf(phoneRaw) === -1) driverPhonesMap[name].push(phoneRaw);
    }
  });

  // 2. 建立資料與處理換行
  var processedRows = [];
  rawData.forEach(function(row) {
    var type = row[1].toString().trim();
    if (type === "電話") return; // 依需求刪除「電話」異動列

    var name = row[2].toString().trim();
    var allPhones = driverPhonesMap[name];
    
    var phoneString = "";
    if (allPhones && allPhones.length > 0) {
      var displayArray = [];
      // 將最新電話（陣列最後一個）放在最上面，舊的往後排
      for (var i = allPhones.length - 1; i >= 0; i--) {
        displayArray.push(allPhones[i]); 
      }
      // 使用換行符號結合，不加單引號
      phoneString = displayArray.join("\n");
    }

    processedRows.push({
      date: row[0],
      type: type,
      name: name,
      car: row[3].toString().trim(),
      phone: phoneString
    });
  });

  // 3. 跨日期去重
  var finalResult = [['異動日期', '異動類型', '司機', '車號', '電話']];
  var seenKeys = new Set();
  processedRows.forEach(function(item) {
    // 建立唯一鍵來判斷是否內容完全重複
    var uniqueKey = [item.type, item.name, item.car, item.phone].join('|');
    if (!seenKeys.has(uniqueKey)) {
      finalResult.push([item.date, item.type, item.name, item.car, item.phone]);
      seenKeys.add(uniqueKey);
    }
  });

  // 4. 輸出與強制格式化
  var outName = "過濾電話重覆";
  var outSheet = ss.getSheetByName(outName) || ss.insertSheet(outName);
  outSheet.clear();
  
  // 重要：設定純文字格式 @，確保換行儲存格內的 0 不會消失
  outSheet.getRange("E:E").setNumberFormat("@"); 
  
  // 寫入資料
  if (finalResult.length > 1) {
    outSheet.getRange(1, 1, finalResult.length, 5).setValues(finalResult);
    
    // 強制開啟自動換行與垂直對齊 (頂端)
    var fullRange = outSheet.getRange(1, 1, finalResult.length, 5);
    fullRange.setVerticalAlignment("top");
    outSheet.getRange(1, 5, finalResult.length, 1).setWrap(true); 
    
    outSheet.autoResizeColumns(1, 5);
  }
  
  outSheet.activate();
  SpreadsheetApp.getUi().alert('Step2 處理完成！已產出「' + outName + '」。');
}