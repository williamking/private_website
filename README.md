## William的个人网站

[网址](未定。。。。)


## 主要功能模块

1.博客区：转载个人博客园中的博客及文章（爬虫实现）
2.心情区：个人心情
3.脑洞区：主要是一些技术上的实验,如游戏、小动画、甚至是一段代码等等
4.留言区：给游客留言。
5.相册区

## 实现框架

1.前端：Bootstrap
2.后端：NodeJS、express、WebSocket
3.项目管理: grunt

## 数据结构

User:
    username,
    password,
    protrait: 头像，
    birthday,
    signature

Article:
    title
    createAt: 创建时间
    content: 内容
    comment: 评论（数组）

Comment:
    createAt: 创建时间
    author: 评论者
    next: 评论跟进，指向下一条评论，否则为空

Album:
    title,
    createAt
    cover: 封面图片名
    content: 照片数组

Picture（照片）:
    createAt
    comment: 评论（数组）


