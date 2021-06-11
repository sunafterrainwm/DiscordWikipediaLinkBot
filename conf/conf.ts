// eslint-disable-next-line no-use-before-define
declare const conf: configObject;

interface configObject {
	/**
	* Discord 的 Token，類似 EO9WkfMicZyatQkAw.wb2LP.xFI-pR7nPFPQeQddaYNedzvgcveocUdmYXs
	*/
	readonly auth: string;

	/**
	* 預設啟用連結時之 articlepath
	*/
	readonly defaultArticlepath: string;

	readonly enable: {
		/**
		* 預設所有頻道都啟用，改成 false 則是預設禁用
		*/
		default: boolean;

		[ x: string ]: boolean;
	}

	/**
	* 解析上限，設為 0 表不限制
	*/
	readonly parselimit: number;

	/**
	* 儲存設定時優先以頻道（channelFirst）或伺服器（guildFirst）儲存
	*/
	// eslint-disable-next-line camelcase
	readonly setting_order: string;

	readonly skipBot: {
		default: boolean;
		[ x: string ]: boolean;
	}

	readonly path: {
		/**
		* 設定存放處的相對路徑
		*/
		setting: string;

		/**
		 * 紀錄檔案的相對路徑，設為空字串表不紀錄
		 */
		log: string;
	};

	readonly msg: {
		/**
		* $1: channel id
		*/
		"bot_start": string;

		"command": {

			"help": {
				"settings": string;
				"start": string;
				"stop": string;
				"optin": string;
				"optout": string;
				"articlepath": string
			};

			"start": string;
			"stop": string;
			"optin": {
				/**
				* $1: 正規表達式
				*/
				"success": string;

				"error": {
					"MissArgument": string
				}
			};
			"optout": {
				/**
				* $1: 正規表達式
				*/
				"success": string;

				"error": {
					"MissArgument": string;
				}
			};
			"articlepath": {
				/**
				* $1: 文章路徑
				*/
				"success": string;

				"error": {
					"origin": string;
					/**
					* 網址
					*/
					"parseerror": string;
					"MissArgument": string;
				},

				"clear": string;
			};
			"setting": {
				/**
				 * $1: 頻道ID
				 */
				channelid: string;

				/**
				 * $1: 狀態
				 */
				statue: string;

				/**
				 * $1: 正規表達式
				 */
				regexp: string;

				/**
				 * $1: 文章路徑
				 */
				articlepath: string;
				help: string;
			}
			"conf": {
				"default": string;
				/**
				 * $1: 設定名稱
				 */
				"unknow": string;
			};
		};
		"parselink": {
			/**
			* $1: 上限
			*/
			"limit": string;
		};
	}
}

export = conf;
