# JBlog 荆棘小栈

> 荆棘自用 NextJS 博客系统

## 一点说明

**很多功能无法自定义, 请不要自行部署使用**

<details>
  <summary>但你如果非要用的话</summary>
  <del>那也不行</del>
</details>

## 环境变量

| 名称       | 含义                |
| ---------- | ------------------- |
| ADMIN_KEY  | 管理员后台 Key      |
| JWT_SECRET | 后台 Token 加密密码 |

## 如何开发

初始化数据库

```
yarn db:init
```

启动开发服务端

```
yarn dev
```

数据库管理

```
yarn db:manage
```
