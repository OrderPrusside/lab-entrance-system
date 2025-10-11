// @ts-nocheck
// this project is inspired by "https://qiita.com/t-morik/items/a6c73e5aff17a52cc104"
// this project is depending on  "https://qiita.com/BruceWeyne/items/54cffecf338cc278523c"

function doGet(e){
  //doGet(e)関数はHTTP:GETリクエスト実行時に自動的に動作する。
  var page = e.parameter["p"];
  var activeuser = SHA256(makeSessionEmail());
  var webAppUrl = ScriptApp.getService().getUrl();
  const conf = config();
  Logger.log("active user hash is " + activeuser);
  const mdl = new Model();
  var allData = mdl.getData("data"); //コード内のデータ取得
  
  //データベースにない新規アカウントならコンテナバインドのDBに登録する。
  if(!(pluck(allData,"address").includes(`${activeuser}`))){ 
    Logger.log("new address hash registered");
    var uniqueNumber = getRandomInt(999999);
    Logger.log("Unique_num_is" + uniqueNumber)
    var keyValuePairs = [{"address":`${activeuser}`,"status":"FALSE","name":uniqueNumber}];
    Logger.log(keyValuePairs);
    const result = mdl.insertData("data", keyValuePairs);
    Logger.log(result);
    var allData = mdl.getData("data");
  }

  if(page == "index" || page==null){
    //HTMLに渡す変数の定義
    var num = pluck(allData,"status").filter(value => value === "IN").length; //データベースからstatus="IN"の数を取得
    var userName = search_user_name(activeuser);
    var index = HtmlService.createTemplateFromFile("index"); //index.htmlをオブジェクト化し変数宣言
    //以下indexにそれぞれの変数を動的に渡せるよう設定
    index.url=webAppUrl;
    index.num=num;
    index.name=userName;
    index.room=conf.roomName;
    var output = index.evaluate();
    output.addMetaTag('viewport','width=device-width, initial-scale=1');
    return output;
  }
  else if(page =="in"){
    setStatus("IN")
    var page_in = HtmlService.createTemplateFromFile("in");
    page_in.url=webAppUrl;
    var output = page_in.evaluate();
    output.addMetaTag('viewport','width=device-width, initial-scale=1');
    return output;
  }
  else if(page =="member"){ 
    var template = HtmlService.createTemplateFromFile("member"); //member.htmlをオブジェクト化し変数宣言
    template.url=webAppUrl;
    template.members = allData;  // 取得したデータ配列を 'members' という名前で渡す
    var output = template.evaluate();
    output.addMetaTag('viewport','width=device-width, initial-scale=1');
    return output;
  }
  else if(page =="preout"){ 
    var template = HtmlService.createTemplateFromFile("preout");
    template.url = webAppUrl;
    var output = template.evaluate();
    output.addMetaTag('viewport','width=device-width, initial-scale=1');
    return output;
  }
  else if(page =="out_home"){ 
    setStatus("HOME")
    var template = HtmlService.createTemplateFromFile("out_home");
    template.url = webAppUrl; 
    var output = template.evaluate();
    output.addMetaTag('viewport','width=device-width, initial-scale=1');
    kitaku_message_handler(activeuser,"HOME"); //本来は処理の最後に書くのがベスト
    return output;
  }
  else if(page =="out_class"){ 
    setStatus("CLASS")
    var template = HtmlService.createTemplateFromFile("out_class");
    template.url = webAppUrl; 
    var output = template.evaluate();
    output.addMetaTag('viewport','width=device-width, initial-scale=1');
    return output;
  }
  else if(page =="out_univ"){ 
    setStatus("UNIV")
    var template = HtmlService.createTemplateFromFile("out_univ");
    template.url = webAppUrl; 
    var output = template.evaluate();
    output.addMetaTag('viewport','width=device-width, initial-scale=1');
    return output;
  }
  else if(page =="out_investigate"){ 
    setStatus("INVEST")
    var template = HtmlService.createTemplateFromFile("out_investigate");
    template.url = webAppUrl; 
    var output = template.evaluate();
    output.addMetaTag('viewport','width=device-width, initial-scale=1');
    return output;
  }
  else{
    var template = HtmlService.createTemplateFromFile("error")
    template.url = webAppUrl;
    var output = template.evaluate();
    return output;
  }
}

function makeSessionEmail() {
  var result = Session.getActiveUser().getEmail();
  return result;
}

function pluck(objectsArray, key) {
  if (!Array.isArray(objectsArray)) {
    console.error("Error: The first argument must be an array of objects.");
    return [];
  }
  if (key === undefined || key === null) {
     console.error("Error: The second argument (key) must be provided.");
     return [];
  }

  return objectsArray.map(obj => {
    // 各要素が有効なオブジェクトで、キーを持っているかを確認
    if (typeof obj === 'object' && obj !== null && key in obj) {
      return obj[key];
    } else {
      // オブジェクトでない要素や、キーを持たないオブジェクトの場合は undefined を返す
      return undefined;
    }
  });
}

function SHA256(input) {
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input, Utilities.Charset.UTF_8);
  var txtHash = '';
  for (i = 0; i < rawHash.length; i++) {
    var hashVal = rawHash[i];
    if (hashVal < 0) {
      hashVal += 256;
    }
    if (hashVal.toString(16).length == 1) {
      txtHash += '0';
    }
    txtHash += hashVal.toString(16);
  }
  return txtHash;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getCurrentNumberOfPeople() {
  const mdl = new Model();
  var allData = mdl.getData("data"); //データ取得
  var num = pluck(allData,"status").filter(value => value === "IN").length; //データベースからstatus="IN"の数を取得
  return num;
}

function setStatus(status){
  const mdl = new Model();
  const activeuser = SHA256(makeSessionEmail());
  const keyValuePair = {"status":status};
  const conditions = [{ key: "address", value:`${activeuser}`}];
  const result = mdl.updateData("data", keyValuePair, conditions);
  return result;
}

function search_user_name(user_hash){
  const mdl = new Model();
    
  // 検索条件を設定
  const conditions = [{ key: "address", value:`${user_hash}`}];
  const userData = mdl.getData("data", conditions)[0];

  Logger.log("searched userName is" + userData.name);
  return userData.name
}

/**
 * メンバーデータのみを取得して返す関数 (JavaScriptから呼び出す用)
 */
function getMemberData() {
  try {
    const mdl = new Model();
    const allData = mdl.getData("data");
    // Logger.log("getMemberData called, returning: " + JSON.stringify(allData)); // デバッグ用ログ
    // 必要に応じてここでデータのソートなどを行う
    // 例: 名前でソートする場合
    // allData.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    return allData; // [{address:..., name:..., status:...}, ...] の形式の配列を返す
  } catch (error) {
    Logger.log("Error in getMemberData: " + error);
    return []; // エラー時は空の配列を返す
  }
}

function testGetActiveSpreadsheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log(sheet.getName())
}