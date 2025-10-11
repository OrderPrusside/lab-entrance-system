function kitaku_message_handler(activeuser, status){
  if (activeuser === "8278729380b46e93877712271ef56a8a640601586d426d2ce5c3adb383ed3d6e") {
    kitaku_message(status)
  }
}

function kitaku_message(status) {
  // discord側で作成したボットのウェブフックURL
  conf = config()
  const discordWebHookURL = conf.discordWebhookUrl;

  if (status === "HOME") {
    // 投稿するチャット内容と設定
    var message = {
    "content": "今から帰ります", // チャット本文
    "tts": false  // ロボットによる読み上げ機能を無効化
    }
  }

  const param = {
    "method": "POST",
    "headers": { 'Content-type': "application/json" },
    "payload": JSON.stringify(message)
  }

  UrlFetchApp.fetch(discordWebHookURL, param);
}