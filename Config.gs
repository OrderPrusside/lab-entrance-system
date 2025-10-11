function config() {
  // スプレッドシート ID を指定しない（空欄）場合は getActiveSpreadsheet が実行される
  this.spreadsheetId = ""; // Spreadsheet ID: Default Database

  // ===========================
  // Setting as you like
  // ===========================
  this.roomName = "PUT YOUR ROOM NAME";
  this.discordWebhookUrl = "PUT YOUR WEBHOOK URL";
  
  return this;
}