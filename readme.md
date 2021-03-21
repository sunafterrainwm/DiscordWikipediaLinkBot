DiscordWikipediaLinkBot
====

Discord中文維基百科連結Bot，發想於[Xi-Plus的Wikipedia-Link-Telegram](https://github.com/Xi-Plus/Wikipedia-Link-Telegram)

## 安裝
1. 複製 ```conf/conf.example.js``` 至 ```conf/conf.js``` 並設定裡面的內容
2. 確保 ```conf/setting.json``` 的初始內容為 ```{}``` 並給予適當的寫入權限
3. 執行 ```npm run bot```

## 機器人指令
* ```/settings``` 檢視連結回覆設定
* ```/help``` 取得指令列表
* ```/start``` 啟用所有連結回覆
* ```/stop``` 停用所有連結回覆
* ```/optin``` 啟用部分連結回覆（參數設定，使用[ECMAScript]的[正規表達式]）
* ```/optout``` 停用部分連結回覆（參數設定，使用[ECMAScript]的[正規表達式]）
* ```/articlepath``` 變更文章路徑

[ECMAScript]: https://zh.wikipedia.org/wiki/ECMAScript "ECMAScript - 維基百科，自由的百科全書"
[正規表達式]: https://zh.wikipedia.org/wiki/正規表達式 "正規表達式 - 維基百科，自由的百科全書"