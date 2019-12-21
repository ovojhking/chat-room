# chat-room
**此作品為後端技能練習，前端僅做功能演示。**
具會員管理系統的聊天室，登入後可參與聊天與瀏覽對話紀錄。管理員除聊天外還可進入會員管理頁面，對所有帳號進行CRUD。

[DEMO 點此](http://128.199.228.19:3000/login)

管理員
帳號:jimmy
密碼:0000

非管理員帳號(也可自行新增)：
帳號:guest
密碼:guest

## 内容列表

- [專案目標](#專案目標)
- [ER-Diagram與資料庫規劃](#ER-Diagram與資料庫規劃)
- [安裝與使用](#安裝與使用)
- [架構說明](#架構說明)
    + [資料夾結構](#資料夾結構)
    + [Acl與jwt實現權限管理](#Acl與jwt實現權限管理)
 - [後續修改](#後續修改)
    + [測試](#測試)
    + [LazyLoading](#LazyLoading)
    + [聊天室的頻繁讀取與寫入](#聊天室的頻繁讀取與寫入)

## 專案目標

1. 資料庫規劃
2. 會員帳號的CRUD
3. acl 權限管理 + jwt 登入狀態驗證
5.  使用socket.io實作聊天室
6.  unit test

## ER-Diagram與資料庫規劃

### ER-Diagram：

![image](https://raw.githubusercontent.com/ovojhking/chat-room/master/ER-Diagram.png)

### 資料庫規劃：

#### 聊天室設計：
這裡僅僅規劃一張table: messages，並在裏頭儲存會員名稱與聊天內容。
原先的設計是messages透過一張叫user_message的table去取得users的name，但因為考慮到聊天室是頻繁寫入的環境，因此將欄位統整到messages。
1. 優點：
	* 快速，不需每一筆訊息都去讀取三張table。
2. 缺點：
	* 當user改名後，舊的訊息無法同步更新名稱。 		

#### 權限設計：

權限的部分是參考RBAC（Role-Based Access Control)的方式設計，基於角色去訪問控制權限。

這裡原先的設計有兩個 :

1. 只留一張資料表：users，並在裏頭寫上admin的欄位，藉此判斷user是否為管理員。但考慮到角色可能會擴充，因此不使用。
2. 基於原本的，再新增role_permissions、permissionse，一共五張table。但因此處的角色僅有一個(admin)，且如此設計在每次權限判斷時都需讀取資料庫，或將權限存於session。如此一來外來不好考慮load balance的問題。
因此最終資料庫僅存取role，權限的判斷透過acl.js與jwt輔助完成。

## 安裝與使用

1. 下載完後安裝，並新增mysql資料庫: chat_room與test_chat_room(測試用)。
```
$ npm install
```
2. 使用migratet創建資料表

```
$ node_modules/.bin/sequelize db:migrate
```

3. 使用migratet創建種子資料

```
$ node_modules/.bin/sequelize db:seed:all
```

4.  執行專案 ( 專案預設執行在localhost:3000 )
```
$ npm run start
```

5. 執行測試 ( 請確認步驟1的資料庫是否建立 )
```
$ npm run test
```
## 架構說明

### 資料夾結構

1. js
	* auth
		* 所有驗證相關的都放置於此
	* config
		* 放置相關配置，目前僅有sequelize的相關配置
	* controllers
		* 資料處理相關放這裡(參考MVC)
	* migrations
		* 定義資料表的創建或是刪除
	* models
		* 定義資料表的結構(參考MVC)
	* public
		* 前端的相關檔案(尚未前後端分離)
    * routers
	    *  apis:  
	        *  放置api
	    *  index:  
	        *  放置view
    * seeders: 
        * 預設要產生的資料
    * socket
        * socket的部分放這裡
    * test
        * 測試文件
    * views
        * html放這裡(這裡使用ejs模板)，參考MVC
 
### Acl與jwt實現權限管理

#### Acl

Acl 是一個權限管理的lib，可以透過它提供的辦法新增角色與權限，再給特定id賦予角色。

#### jwt

jwt是防止跨域攻擊的驗證方式，token驗證與傳統驗證方式的差別是，驗證的token是存在client端並透過header傳遞token，在後端透過key去解密、並驗證。

#### 為什麼不直接在jwt裡放角色，而是只放uuid?

jwt雖然可以作為驗證手段，**但token本身便是通行證，任何人拿到token都可以登入。**

如果有人透過xss攻擊取得了token，就可以擁有權限，我認為這樣安全性不夠。因此jwt的payload，我只放uuid。

由於每個帳號uuid都不同，即便token遭劫持也無法透過竄改token取得更高的權限。

#### acl與jwt實現權限管理

只在登入時將uuid存至jwt的payload，並同時將此uuid在acl裡註記為特定角色。
往後每次需要權限時，就辨認jwt裡的uuid，是否存在於acl裡，以此實現權限管理。

## 後續修改

### 測試

由於只有寫過前端的unit test，後端的測試實在是缺乏經驗，只好邊學邊做。

#### 整合測試：

我覺得api可以做整合測試，也就是call到api後，直接將middleware跟controller後的結果拿來判斷。這樣可以保證一支api的正確性，並在重構時，立刻知道哪支api有問題。

#### 單元測試：

接著再對controller以及middleware裡的function做unit test，確保最小單元沒有問題。



當然上述只是我的想法，畢竟正式上線還要考慮時間壓力。可能要多花些時間額外訓練一下，才能把單元測試的部分熟練，畢竟前後端的關注點不同。

### LazyLoading

聊天室的歷史訊息，這裡是直接載入全部。當時並沒有考慮到歷史訊息變多該如何處理。這裡可以考慮歷史訊息上滑到底部再繼續載入，但這問題的細節還沒考慮清楚，只能先留個紀錄。

### 聊天室的頻繁讀取與寫入

這部分暫時只想到將聊天室獨立使用nosql來規劃，暫時還沒有更好的想法，希望能有人給我一些提點。
