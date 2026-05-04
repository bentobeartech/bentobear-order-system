/**
 * 放在「訂單來源」
 * 功能：從「設備異動記錄表」抓取司機資料並鎖定
 */
function importDriverData() {
  // --- 設定區 ---
  var SOURCE_ID = '16_fQTvqrkph6WJUlpJoTWSpsxrPPDr3oQBA582FiKZI'; 
  var SOURCE_SHEET_NAME = '司機資料';
  var TARGET_SHEET_NAME = '選單來源';
  // --------------

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var targetSheet = ss.getSheetByName(TARGET_SHEET_NAME);
  var sourceSs = SpreadsheetApp.openById(SOURCE_ID);
  var sourceSheet = sourceSs.getSheetByName(SOURCE_SHEET_NAME);

  // 1. 取得來源 A:C 資料
  var lastRow = sourceSheet.getLastRow();
  if (lastRow < 1) return;
  var data = sourceSheet.getRange(1, 1, lastRow, 3).getValues();

  // 2. 寫入目標 D:F 欄位 (先清空舊資料)
  targetSheet.getRange("D:F").clearContent();
  targetSheet.getRange(1, 4, data.length, 3).setValues(data);

  // 3. 設定保護 (禁止手動修改 D:F)
  var protection = targetSheet.getProtection(SpreadsheetApp.ProtectionType.RANGE);
  // 如果已經有保護了就先移除，重新設定
  var protections = targetSheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  for (var i = 0; i < protections.length; i++) {
    if (protections[i].getRange().getA1Notation().indexOf("D:F") !== -1) {
      protections[i].remove();
    }
  }
  
  var range = targetSheet.getRange("D:F");
  var protect = range.protect().setDescription('自動同步欄位禁止修改');
  protect.removeEditors(protect.getEditors()); // 移除所有編輯者
  if (protect.canEdit()) {
    protect.setWarningOnly(false); // 嚴格禁止修改
  }

  ss.toast("司機資料更新完成，D:F 欄位已鎖定。");
}