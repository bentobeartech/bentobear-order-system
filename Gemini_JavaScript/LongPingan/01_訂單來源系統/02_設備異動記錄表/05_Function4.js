/**
 * 功能四：司機異動記錄使用者手動輸入後，即時驗證與同步更新SheetName:司機資料
 * 特色：新資料置頂、電話重複時告知對應司機姓名、中央視窗通知
 */
function triggerSystem(e) {
  if (!e) return;

  const ss = e.source;
  const sheet = ss.getActiveSheet();
  const range = e.range;
  const row = range.getRow();
  
  if (sheet.getName() !== "司機異動記錄" || row === 1) return;

  const rowValues = sheet.getRange(row, 1, 1, 5).getValues()[0];
  const isComplete = rowValues.every(cell => cell.toString().trim() !== "");
  if (!isComplete) return;

  const ui = SpreadsheetApp.getUi();
  
  // 1. 顯示處理中中央視窗
  const loadingHtml = HtmlService.createHtmlOutput(
    '<div style="font-family:sans-serif; text-align:center; padding-top:20px;">' +
    '<h3 style="color:#1a73e8;">⚙️ 資料檢查中...</h3>' +
    '<p>正在比對司機、車號與電話唯一性</p>' +
    '</div>'
  ).setWidth(300).setHeight(130);
  ui.showModelessDialog(loadingHtml, "系統訊息");

  const forceClose = () => {
    ui.showModelessDialog(HtmlService.createHtmlOutput("<script>google.script.host.close();</script>"), " ");
  };

  try {
    const typeRaw = rowValues[1].toString().trim();
    const driver = rowValues[2].toString().trim();
    const carRaw = rowValues[3];
    const phoneRaw = rowValues[4].toString().trim();

    let type = "";
    if (typeRaw.includes("新增司機")) type = "1";
    else if (typeRaw.includes("單一更換")) type = "2";
    else if (typeRaw.includes("司機互換")) type = "3";
    else if (typeRaw.includes("電話")) type = "4";
    else if (typeRaw.includes("離職司機")) type = "5";

    if (!type) throw `異動類型無效：「${typeRaw}」`;

    const targetSheet = ss.getSheetByName("司機資料");
    if (!targetSheet) throw "找不到「司機資料」表";

    const car = carRaw.toString().replace(/[\s-]/g, "").toUpperCase();

    // 執行核心邏輯
    switch (type) {
      case "1": // 新增司機 (置頂)
        if (findInTarget(targetSheet, "driver", driver)) throw `司機「${driver}」已在名單中。`;
        if (findInTarget(targetSheet, "car", car)) throw `車號「${car}」已被他人佔用。`;
        
        // 檢查電話重複並抓出姓名
        let dupP1 = findInTarget(targetSheet, "phone", phoneRaw);
        if (dupP1) throw `電話重複！此號碼已被司機【${dupP1.data[0]}】佔用。`;

        targetSheet.insertRowBefore(2);
        targetSheet.getRange(2, 1, 1, 3).setValues([[driver, carRaw, phoneRaw]]);
        formatPhoneCell(targetSheet, 2, phoneRaw);
        break;

      case "2": // 更換車號
        let d2 = findInTarget(targetSheet, "driver", driver);
        if (!d2) throw `查無司機「${driver}」。`;
        if (findInTarget(targetSheet, "car", car)) throw `車號「${car}」已被佔用。`;
        targetSheet.getRange(d2.row, 2).setValue(carRaw);
        break;

      case "3": // 司機互換
        let d3A = findInTarget(targetSheet, "driver", driver);
        let d3B = findInTarget(targetSheet, "car", car);
        if (!d3A || !d3B) throw "互換失敗：司機或車號不匹配。";
        let oldCarA = d3A.data[1];
        targetSheet.getRange(d3A.row, 2).setValue(carRaw);
        targetSheet.getRange(d3B.row, 2).setValue(oldCarA);
        break;

      case "4": // 更新電話
        let d4 = findInTarget(targetSheet, "driver", driver);
        if (!d4) throw `查無司機「${driver}」。`;
        
        // 檢查電話是否被「別人」用走
        let dupP4 = findInTarget(targetSheet, "phone", phoneRaw);
        if (dupP4 && dupP4.data[0] !== driver) {
          throw `修改失敗！此電話已被司機【${dupP4.data[0]}】佔用。`;
        }
        formatPhoneCell(targetSheet, d4.row, phoneRaw);
        break;

      case "5": // 離職司機
        let d5 = findInTarget(targetSheet, "driver", driver);
        if (!d5) throw `查無司機「${driver}」。`;
        targetSheet.deleteRow(d5.row);
        break;
    }

    forceClose();
    ui.alert("【同步成功】\n資料已完成唯一性檢查並置頂更新。");

  } catch (err) {
    forceClose();
    ui.alert(`【驗證失敗】\n第 ${row} 列 - ${err}`);
  }
}

/**
 * 電話格式專用工具
 */
function formatPhoneCell(sheet, row, value) {
  const cell = sheet.getRange(row, 3);
  cell.setNumberFormat("@").setWrap(true).setValue(value);      
}

/**
 * 查重搜尋引擎 (支援多重比對與姓名回傳)
 */
function findInTarget(ts, type, val) {
  const d = ts.getDataRange().getValues();
  if (d.length <= 1) return null;
  
  // 標準化輸入值：移除所有空格、橫槓與換行
  const cleanInput = val.toString().replace(/[\s-\n]/g, "");
  
  for (let i = 1; i < d.length; i++) {
    let targetVal = "";
    
    if (type === "driver") {
      targetVal = d[i][0].toString().trim();
    } else if (type === "car") {
      targetVal = d[i][1].toString().replace(/[\s-]/g, "").toUpperCase();
    } else if (type === "phone") {
      // 電話比對：將目標儲存格內的換行也拆開清理
      targetVal = d[i][2].toString().replace(/[\s-\n]/g, "");
    }
    
    // 如果是電話比對，因為可能有換行多組，我們檢查 cleanInput 是否包含在 targetVal 裡，或者完全相等
    // 這裡採最嚴格的「包含性比對」
    if (cleanInput !== "" && targetVal.includes(cleanInput)) {
      return { row: i + 1, data: d[i] };
    }
    
    // 一般比對
    if (targetVal === cleanInput && cleanInput !== "") {
      return { row: i + 1, data: d[i] };
    }
  }
  return null;
}