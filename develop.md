# 项目开发文档

## 部署

### “阮薇薇点名啦”开发者的部署方法

1. clone 项目到本地。

```sh
git clone https://github.com/uestc-msc/wechat-mini-program.git
```

2. 使用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，导入项目根目录。

3. 分别在 `cloudfunctions` 下的每个子文件夹下运行：

```sh
npm install
```

### 其他项目的开发者的部署方法


1. clone 项目到本地。

```sh
git clone https://github.com/uestc-msc/wechat-mini-program.git
```

2. 使用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，导入项目根目录，并在导入界面修改 AppID 为开发者账号下的 AppID。

3. 修改 `/app.js` 中云环境 id 为开发者账号下的 id。（本项目的云环境 id 为 `uestc-msc-activities`）

4. 在云数据库中新建集合：`activity_info`、`user_info`、`album_info`、`app_info`、`log`，并在 `app_info` 中添加字段：

```json
{
  _id: 'settings',
  can_upload: true,
  can_register: true
}
```

5. 修改云数据库所有集合和云存储的访问权限为：任何人可读、任何人可写。

5. 分别在 `cloudfunctions` 下的每个子文件夹下运行：

```sh
npm install
```

执行完成后，在微信开发者工具右键点击各子文件夹，点击“上传并部署：所有文件”。

