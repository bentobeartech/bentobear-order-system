/**
 * 放在「訂單來源」
 * 負責開檔時的自動化流程與選單建立
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  
  // 1. 自動執行：開啟檔案時自動同步司機資料
  try {
    importDriverData();
  } catch (e) {
    console.log("自動同步失敗：" + e.message);
  }

  // 2. 建立功能選單 (未來新增功能只需在這裡加一行 addItem)
  ui.createMenu('龍平安系統')
      .addItem('手動更新：司機資料', 'importDriverData')
      // .addItem('未來新功能', 'futureFunction') 
      .addToUi();
}