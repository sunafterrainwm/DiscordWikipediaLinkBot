import extend = require( "./extend" );

// eslint-disable-next-line no-use-before-define
declare const logs: logsObject;

interface logsObject {
	// 訊息發送來源
	/**
	 * 訊息來自哪位用戶
	 */
	from: string;
	/**
	 * 訊息來自哪個頻道
	 */
	channelid: string;
	/**
	 * 設定用的ID，如果是`guildFirst`且該頻道為伺服器則為`guildid`，反之則和`channelid`一樣
	 */
	settingid: string;
	/**
	 * 訊息ID
	 */
	messageid: string;
	/**
	 * 訊息本身，換行會被替換成`\n`
	 */
	message: string;

	// bot
	/**
	 * 是否是bot
	 */
	bot: boolean;
	/**
	 * 是否在`conf.js`中被攔截...之類的
	 */
	skip?: "true-inlist" | "false-inlist" | "true-default" | "false-default";

	// other
	/**
	 * `jQuery.extend`
	 */
	extend?: typeof extend;
	/**
	 * 回復連結狀態
	 */
	statue?: "new" | "start" | "stop" | "optin" | "optout";
	/**
	 * 如果回復連結狀態是 `optin` 或 `optout` 則為其正規表達式
	 */
	regexp?: string;
	/**
	 * 如果回復連結狀態是 `optin` 或 `optout` 則為是否和其正規表達式匹配
	 */
	match?: boolean;

	// command.js
	/**
	 * 檢測到的指令
	 */
	command?: "ping" | "link" | "help" | "start" | "stop" | "optin" | "optout" | "articlepath" | "setting" | "unknow";
	/**
	 * `/optin` 或 `/optout` 設定的正規表達式
	 */
	regexpset?: string | null;
	/**
	 * `/articlepath` 設定的文章路徑
	 */
	articlepathset?: string | null;
	/**
	 * `/articlepath` 拋出的錯誤
	 */
	articlepatherror?: string;
	/**
	 * `/settings` 檢測到的設定
	 */
	settings?: string;
	/**
	 * 是否透過 /conf
	 */
	// eslint-disable-next-line camelcase
	command_conf?: true;

	// parselink.js
	/**
	 * 是否有解析到連結
	 */
	parse?: boolean;

	/**
	 * 解析結果
	 */
	parseret?: string;
}

export = logs;
