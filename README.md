# 阮薇薇点名啦 Web 前端

电子科技大学微软学生俱乐部（UESTC-MSC）的 Web 应用的前端，记录每次沙龙的信息。

[![Deploy To Server (dev version)](https://github.com/uestc-msc/uestcmsc_webapp_frontend/actions/workflows/azure-static-web-apps-thankful-sand-010311700.yml/badge.svg)](https://github.com/uestc-msc/uestcmsc_webapp_frontend/actions/workflows/azure-static-web-apps-thankful-sand-010311700.yml)
![Vue](https://img.shields.io/badge/Vue-2.6.11-blue.svg)
![Vuetify](https://img.shields.io/badge/Vuetify-2.4.0-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 运行环境

## 功能介绍

### 签到

签到有三种形式：

* MSCer 在微信-扫一扫中，扫描本次沙龙对应的小程序码，完成签到；
* MSCer 在小程序中首页或沙龙详情的“签到”入口，扫描本次沙龙对应的小程序码，完成签到；
* 管理员在沙龙管理界面手动为 MSCer 签到。

以上三种签到形式均要求在沙龙当天进行。前两种形式还要求沙龙为“开放签到”状态（在沙龙管理页面设置，默认为开放签到，沙龙当天可设置）。

### 经验

用户初始经验值为 0。以下行为会增加/扣除经验（正值为增加，反之为扣除）。其他行为（如删除沙龙）均不会影响经验。

* 一位参与者签到，参与者 +50 经验，每位主讲人 +10 经验。
* 管理员取消某人签到，该人 -50 经验，每位主讲人 -10 经验。
* 设置主讲人时，该人 +10*`已签到人数` 经验
* 取消设置主讲人时，该人 -10*`已签到人数` 经验
* 上传一张图片，上传者 +5 经验。
* 删除一张图片，上传者 -5 经验。

### 权限管理

#### 所有人的权限

所有 MSCers 在完善个人信息后都可以：

* 创建沙龙
* 查看任意沙龙的信息
* 扫描某次沙龙对应的二维码进行签到
* 上传任意沙龙的照片，照片所有人可见

#### 管理员权限

小程序中存在管理员。管理员的定位为俱乐部副主席。

除上述权限外，管理员拥有的额外权限有：

* 修改沙龙的信息
* 删除沙龙
* 获取沙龙的签到二维码
* 手动为其他用户进行签到
* 开放/关闭通过小程序码的签到（沙龙当天可设置）
* 查看、导出沙龙的签到名单
* 删除本次沙龙的照片

另外，沙龙的每一位主讲人同样拥有该次沙龙的以上权限。

管理员权限的修改途径有：

1. 管理员授予者在在小程序中修改
2. 开发者直接修改数据库 `user_info` 集合的 `is_admin` 字段

#### 超级管理员权限

小程序中存在超级管理员。超级管理员的定位为俱乐部主席。

超级管理员可以在小程序中修改管理员的名单。

超级管理员默认不拥有管理员权限。但可以授予自身管理员权限。

超级管理员只能通过开发者修改数据库 `user_info` 集合的 `can_grant_admin` 字段来修改名单。

### 签到记录导出

由于开发一个页面的时间远大于写几行代码直接查询数据库，再加上这个功能利用率实在太低、变种还可以有很多，因此就不做了。

开发者如有需求，可以参考[文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/Cloud.database.html)，花半天时间自学一下；

其他用户可以私聊开发者。

## 部署、开发

[部署方法](docs\develop.md#部署)

[项目开发文档](docs\develop.md)
