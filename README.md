### PC代理抓取tiktok评论信息

#### 插件
- [anyproxy](http://anyproxy.io/cn/)
- [mongoose](https://github.com/Automattic/mongoose)

#### 使用步骤
1. Android安装抖音
2. Android安装平行空间
3. 设置PC为手机代理
> 将手机与PC处于同一局域网内，设置手机WLAN手动代理，IP为PC地址，端口为本代理端口（项目根目录index.js中设置）。项目默认代理地址localhost:8001, web地址:localhost:8002
4. 安装Mongo Server(目前只支持MongoDB)
5. 进入项目目录npm start启动项目
6. 通过平行空间应用打开抖音，点开抖音评论，开始抓取。