/* eslint-disable no-tabs, camelcase */
//
// 機器人配置文件
//
// 請將本文件複製為 conf.js，並參照註釋進行設置

module.exports = {
	auth: "",												// Discord 的 Token，類似 EO9WkfMicZyatQkAw.wb2LP.xFI-pR7nPFPQeQddaYNedzvgcveocUdmYXs
	defaultArticlepath: "https://zh.wikipedia.org/wiki/",	// 預設啟用連結時之 articlepath
	enable: {
		default: true										// 預設所有頻道都啟用，改成 false 則是預設禁用

	//	"12345678901": false								// 在頻道 12345678901 禁用
	//	"23456789012": true									// 在頻道 23456789012 啟用
	},
	parselimit: 10,										// 解析上限，設為 0 表不限制
	setting_order: "channelFirst",						// 儲存設定時優先以頻道（channelFirst）或伺服器（guildFirst）儲存
	skipBot: {
		default: true										// 預設所有Bot的訊息皆會無視，改成 false 則是預設照常處理

		//	"12345678901": false							// 無視 id = 12345678901 的bot
		//	"23456789012": true								// 不無視 id = 12345678901 的bot
	},
	path: {
		setting: "conf/setting.json",						// 設定存放處的相對路徑
		log: "log/run.log"								// 紀錄檔案的相對路徑，設為空字串表不紀錄
	},
	msg: {												// 設定bot發送的訊息
		bot_start: "感謝您使用本機器人，當您輸入[[頁面名]]或{{模板名}}時，機器人將會自動回覆連結",	// $1: channel id
		command: {
			help: {
				settings: "檢視連結回覆設定",
				start: "啟用所有連結回覆",
				stop: "停用所有連結回覆",
				optin: "啟用部分連結回覆(參數設定，使用正規表達式)",
				optout: "停用部分連結回覆(參數設定，使用正規表達式)",
				articlepath: "變更文章路徑"
			},
			start: "已啟用連結回覆",
			stop: "已停用連結回覆",
			optin: {
				success: "已啟用部分連結回覆：$1",	// $1: 正規表達式
				error: {
					MissArgument: "此指令需包含一個參數為正規表達式(ECMAScript)，當訊息符合這個正規表達式才會回覆連結\n範例：`/optin /pattern/`"
				}
			},
			optout: {
				success: "已停用部分連結回覆：$1",	// $1: 正規表達式
				error: {
					MissArgument: "此指令需包含一個參數為正規表達式(ECMAScript)，當訊息不符合這個正規表達式才會回覆連結\n範例：`/optout /pattern/`"
				}
			},
			articlepath: {
				success: "文章路徑已設定為 $1",	// $1: 文章路徑
				error: {
					origin: "抱歉，只能使用http協定或https協定",
					parseerror: "抱歉，無法識別網址 $1",	// 網址
					MissArgument: "此指令需包含一個參數為文章路徑\n範例：`/articlepath https://zh.wikipedia.org/wiki/`"
				},
				clear: "已清除文章路徑設定值"
			},
			setting: {
				channelid: "頻道ID為 $1",	// $1: 頻道ID
				statue: "連結回覆設定為 $1",	// $1: 狀態
				regexp: "正規表達式：$1",	// $1: 正規表達式
				articlepath: "文章路徑為 $1",	// $1: 文章路徑
				help: "使用 /help 查看更改設定的指令"
			},
			conf: {
				default: "使用方式：\n`/conf 設定名稱 設定值`\n可用之變數名請使用 `/conf help` 查看",
				unknow: "無法理解設定名稱`$1`，使用說明請參見`/conf`。"
			}
		},
		parselink: {
			limit: "......\n已超過解析次數上限 $1 次，停止解析。"
		}
	}
};
