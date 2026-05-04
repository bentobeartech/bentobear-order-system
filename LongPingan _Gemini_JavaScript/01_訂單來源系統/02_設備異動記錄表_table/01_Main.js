/**
 * 建立選單：整合所有獨立功能按鈕
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('司機自動化工具')
      .addItem('Step1：產生司機異動記錄', 'runStep1')
      .addSeparator()
      .addItem('Step2：過濾電話重複', 'runStep2')
      .addSeparator()
      .addItem('Step3：產出司機主資料表', 'runStep3')
      .addSeparator() // 加入分隔線區分自動化功能
      .addItem('Step4：同步至「司機資料」', 'mainValidatorManual') // 這裡預留給手動執行，或在下面 onEdit 自動觸發
      .addToUi();
}

/**
 * 系統事件：當「司機異動記錄」被編輯時，自動啟動功能四的驗證
 */
function onEdit(e) {
  // 1. 取得目前活動的工作表名稱
  var sheetName = e.source.getActiveSheet().getName();
  
  // 2. 判斷是否為指定的輸入表（司機異動記錄）
  if (sheetName === "司機異動記錄") {
    // 當功能四檔案建立後，這裡會自動呼叫該檔案中的驗證函數
    if (typeof mainValidator === "function") {
      mainValidator(e);
    }
  }
}

/**
 * 手動觸發功能四的函數 (當使用者點擊選單時使用)
 */
function mainValidatorManual() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  // 如果使用者不在正確的工作表點擊，給予提示
  if (sheet.getName() !== "司機異動記錄") {
    SpreadsheetApp.getUi().alert('請切換到「司機異動記錄」工作表後再執行同步。');
    return;
  }
  
  SpreadsheetApp.getUi().alert('自動同步已開啟。請直接在「司機異動記錄」中修改「異動類型」，系統將自動驗證並同步。');
}