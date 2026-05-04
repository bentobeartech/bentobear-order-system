/**
 * 功能一：從「來自大匯表」初步處理異動標記
 * 邏輯：按司機與日期排序後，對比上一筆資料，標記「新增司機」、「車號」或「電話」異動。
 */
function runStep1() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = ss.getSheetByName("來自大匯表");
  
  if (!sourceSheet) {
    SpreadsheetApp.getUi().alert('錯誤：找不到來源工作表「來自大匯表」。');
    return;
  }
  
  var rawData = sourceSheet.getDataRange().getValues();
  if (rawData.length < 2) return;
  
  // 移除標題列
  var header = rawData.shift();
  
  // 1. 資料標準化
  var cleanData = rawData.map(function(row) {
    // 電話標準化：只留數字，並處理 0 補位
    var phoneRaw = row[3].toString().replace(/\D/g, '').trim(); 
    if (phoneRaw.length === 9 && phoneRaw.startsWith('9')) {
      phoneRaw = "0" + phoneRaw;
    }
    return { 
      date: row[0], 
      name: row[1].toString().trim(), 
      car: row[2].toString().trim(), 
      phone: phoneRaw 
    };
  });

  // 2. 排序：先按「司機姓名」，同司機再按「日期」
  cleanData.sort(function(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return new Date(a.date) - new Date(b.date);
  });

  var result = [['異動日期', '異動類型', '司機', '車號', '電話']];
  var driverLastState = {}; 

  // 3. 邏輯比對
  cleanData.forEach(function(item) {
    var dateStr = (item.date instanceof Date) ? Utilities.formatDate(item.date, "GMT+8", "M月d日") : item.date.toString();
    var name = item.name;
    var phone = item.phone; // 使用純數字，移除單引號

    if (!driverLastState[name]) {
      // 第一次出現該司機 -> 新增司機
      result.push([dateStr, '新增司機', name, item.car, phone]);
      driverLastState[name] = { car: item.car, phone: item.phone };
    } else {
      var last = driverLastState[name];
      // 檢查車號是否有變
      if (item.car !== last.car) {
        result.push([dateStr, '車號', name, item.car, phone]);
      }
      // 檢查電話是否有變
      if (item.phone !== last.phone) {
        result.push([dateStr, '電話', name, item.car, phone]);
      }
      // 更新記錄該司機目前的最新狀態
      if (item.car !== last.car || item.phone !== last.phone) {
        driverLastState[name] = { car: item.car, phone: item.phone };
      }
    }
  });

  // 4. 輸出到「產生司機異動記錄」
  var outputName = "產生司機異動記錄"; 
  var outSheet = ss.getSheetByName(outputName) || ss.insertSheet(outputName);
  outSheet.clear();
  
  // 設定電話欄位為純文字格式，避免開頭的 0 消失
  outSheet.getRange("E:E").setNumberFormat("@");
  
  // 寫入資料
  outSheet.getRange(1, 1, result.length, 5).setValues(result);
  
  // 美化排版
  outSheet.autoResizeColumns(1, 5);
  outSheet.activate();
  
  SpreadsheetApp.getUi().alert('Step1 執行完畢！已產出「' + outputName + '」。');
}