//
// 機器人配置文件
//
// 請將本文件複製為 conf.js，並參照註釋進行設置

module.exports = {
	"auth": "",												// Discord 的 Token，類似 EO9WkfMicZyatQkAw.wb2LP.xFI-pR7nPFPQeQddaYNedzvgcveocUdmYXs
	"defaultArticlepath": "https://zh.wikipedia.org/wiki/",	// 預設啟用連結時之 articlepath
	"enbnable":  {											
		"default": true										// 預設所有頻道都啟用，改成 false 則是預設禁用
	
	//	"12345678901": false								// 在頻道 12345678901 禁用
	//	"23456789012": true									// 在頻道 23456789012 啟用
	},
	"parselimit": 10,										// 解析上限，設為 0 表不限制
	"msg": {												// 設定bot發送的訊息
		"bot-start": "感謝您使用本機器人，當您輸入[[頁面名]]或{{模板名}}時，機器人將會自動回覆連結",	// $1: channel id
		"command-help": {
			"settings": "檢視連結回覆設定",
			"start": "啟用所有連結回覆",
			"stop": "停用所有連結回覆",
			"optin": "啟用部分連結回覆(參數設定，使用正規表達式)",
			"optout": "停用部分連結回覆(參數設定，使用正規表達式)",
			"articlepath": "變更文章路徑"
		},
		"command-start": "已啟用連結回覆",
		"command-stop": "已停用連結回覆",
		"command-optin-success": "已啟用部分連結回覆：$1",	// $1: 正規表達式
		"command-optin-error-miss-argument": "此指令需包含一個參數為正規表達式(ECMAScript)，當訊息符合這個正規表達式才會回覆連結\n範例：/optin /pattern/",
		"command-optout-success": "已停用部分連結回覆：$1",	// $1: 正規表達式
		"command-optout-error-miss-argument": "此指令需包含一個參數為正規表達式(ECMAScript)，當訊息符合這個正規表達式才會回覆連結\n範例：/optout /pattern/",
		"command-articlepath-success": "文章路徑已設定為 $1",	// $1: 文章路徑
		"command-articlepath-error-origin": "抱歉，只能使用http協定或https協定",
		"command-articlepath-error-parseerror": "抱歉，無法識別網址 $1",	// 網址
		"command-articlepath-error-miss-argument": "此指令需包含一個參數為文章路徑\n範例：/articlepath https://zh.wikipedia.org/wiki/",
		"command-setting": "channel id為 $1\n連結回覆設定為 \n正規表達式：$2\n文章路徑為$3\n使用 /help 查看更改設定的指令",	// $1: channel id，$2: 正規表達式，$3: 文章路徑
		"command-setting-regexpremove": "正規表達式：$2\n",	// 用於 正規表達式 不存在時自動移除
		"parselink-limit": "......\n已超過解析次數上限 $1 次，停止解析。"// $1: 上限
	}
};