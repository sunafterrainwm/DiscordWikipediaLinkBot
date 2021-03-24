DiscordWikipediaLinkBot
====

Discord中文維基百科連結Bot，發想於[Xi-Plus的Wikipedia-Link-Telegram](https://github.com/Xi-Plus/Wikipedia-Link-Telegram)

## 安裝
1. 複製 ```conf/conf.example.js``` 至 ```conf/conf.js``` 並設定裡面的內容
2. 確保指定的日誌檔案及頻道設定檔案給予適當的寫入權限

## 啟動
* ```npm run bot```

## 機器人指令
* ```/settings``` 檢視連結回覆設定。
* ```/help``` 取得指令列表。
* ```/start``` 啟用所有連結回覆。
* ```/stop``` 停用所有連結回覆。
* ```/optin``` 啟用部分連結回覆（參數設定，使用[ECMAScript]的[正規表達式]）。
* ```/optout``` 停用部分連結回覆（參數設定，使用[ECMAScript]的[正規表達式]）。
* ```/articlepath``` 變更文章路徑。

設定適用範圍是單一頻道，不是整個伺服器。

本版本暫不支持將設定儲存至資料庫存放，若有想法歡迎在[此](https://github.com/sunny00217wm/DiscordWikipediaLinkBot/issues/1)提出或提出pull request。

徵求有心人士將本業內容翻譯成英文。

## 後臺
### 檢索或設置設定
#### 檢索
```setting-client get [頻道ID] [鍵]```

#### 設定
```setting-client set 頻道ID 鍵 值```

#### 移除
```setting-client remove 頻道ID [鍵]```

### 鍵
* ```statue```：頻道狀態，```start```為啟用，```stop```為停用，```optin```為部分啟用（需要搭配下方的```RegExp```），```optout```為部分停用（需要搭配下方的```RegExp```）
* ```RegExp```：設為部分啟用時和其匹配時才檢測連結，設為部分停用時和其不匹配時才檢測連結。檢測時會由```new Regexp()```構造，編輯設定檔案時須注意跳脫字元。
* ```articlepath```：文章連結，預設是設定裡的```defaultArticlepath```。

[ECMAScript]: https://zh.wikipedia.org/wiki/ECMAScript "ECMAScript - 維基百科，自由的百科全書"
[正規表達式]: https://zh.wikipedia.org/wiki/正規表達式 "正規表達式 - 維基百科，自由的百科全書"