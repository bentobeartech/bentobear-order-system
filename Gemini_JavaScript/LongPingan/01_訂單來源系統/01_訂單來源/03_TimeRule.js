function onEdit(e) {
    var range = e.range;
    var targetColumn = 3; // C 欄
  
    // 1. 基本檢查：是否在目標欄位且非刪除動作
    if (range.getColumn() == targetColumn && e.value !== undefined) {
      var rawInput = e.value.toString(); // 取得使用者輸入的原始字串
      
      // 2. 判斷輸入是否為純數字且尚未包含冒號（避免重複執行）
      if (!isNaN(rawInput) && rawInput.indexOf(':') === -1) {
        
        // 3. 自動補足 4 位數 (例如 10 變 0010, 200 變 0200)
        var paddedValue = rawInput.padStart(4, '0');
        
        // 4. 拆分時分
        var hours = paddedValue.substring(0, 2);
        var minutes = paddedValue.substring(2, 4);
        
        // 5. 驗證時間合理性 (00~23 小時, 00~59 分鐘)
        if (parseInt(hours) < 24 && parseInt(minutes) < 60) {
          var finalTime = hours + ":" + minutes;
          
          // 6. 強制將儲存格設為「純文字」格式並寫入，確保 00 開頭不會消失
          range.setNumberFormat('@');
          range.setValue(finalTime);
        }
      }
    }
  }