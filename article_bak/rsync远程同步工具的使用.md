rsync是linux下的一个远程文件同步工具，在做服务器扩容或服务器迁移备份时经常会用到，因此写下一些使用的笔记。

# 一、服务端与客户端
rsync支持拉取和推送两种同步的方式，分为服务端和客户端，服务端就像web中的服务器，一般是源文件所存放的机器，而客户端是需要同步源文件的机器。拉取操作就像用户从服务器下载文件一样，客户端将服务端的文件同步到本地，而推送操作就像用户更新服务器上自己的文件，将本地的文件同步到远程服务器。平时一般都只会用到拉取的操作。

# 二、安装与配置
一般linux系统都会自带rsync工具，如果实在没有，可以去官网[https://rsync.samba.org/](https://rsync.samba.org/)
源码安装。

服务端的配置比较复杂，首先要编写配置文件，下面是一个例子：
```
uid = root  #同步后文件所属用户
gid = root  #同步后文件所属用户组
port = 873  #redis服务器端口
read only = true #设置源文件只读，即客户端不可以进行推送覆盖的操作
transfer logging = true #传输时写日志 
log format = %a %o %P %f %l  #日志的格式，
log file = /var/log/rsyncd.log #日志的路径
pid file = /var/run/rsyncd.pid  #启动时服务器进程的pid
max connections = 100  #最大连接数
secrets file = /etc/rsyncd.secrets #授权配置文件路径

[test]  #模块名
path = /data/test/ #同步的根目录
comment = rsync  #模块的注释
auth users = moneytree #认证的用户
hosts allow = 100.92.122.333 #授权的客户端ip
```
配置文件都以key = value的形式配置，同时可以配置模块，模块名下的配置只对该模块有效，最上方则是全局生效的配置。

服务端主要需要配置的是连接的授权配置（用户、密码）,这个通过一个密码文件来配置：
```
#rsyncd.secrets
admin:233333 #格式为 用户名:密码，一个用户一行
```
另外，还需要配置白名单，即允许哪些机器访问该redis服务器，通过hosts allow = xxx配置ip即可。

客户端的配置，只需要配置密码文件即可
```
#rsyncd.pass
233333 #只需一行密码
```

# 三、启动服务端与客户端拉取文件
配置文件写好后，就可以启动服务端了，执行命令`rsync --daemon --config=/etc/rsyncd.secrets`，--daemon是指后台启动，这样就以后台常驻进程方式启动，不会占用shell命令行。--config指向配置文件的路径。

服务端启动后，在客户端执行拉取命令拉取文件：
`rsync -av  --password-file=/etc/rsyncd.pass admin@xxx.xx.xx.xx::test/my_file.txt /data/test/`
认证以 用户名@服务端ip::模块名/文件相对目录 来填写参数。

