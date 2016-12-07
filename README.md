## 项目介绍
向模板html文件中插入js、css、html 或 图片，根据特定生成新的html文件

## 安装运行

```sh
rails db:create

rails db:migrate

npm install

rails s
```
## 使用s3
如果不使用s3保存文件，图片都是保存在本地，有些功能可能有问题

1. 修改 /config/application.rb、/config/application.rb、/app/models/image.rb 相关的代码(for s3)
2. 新建 /config/application.yml，配置 s3 相关信息，如下

```sh
S3_HOST_ALIAS:
S3_BUCKET_NAME: 
AWS_ACCESS_KEY_ID: 
AWS_SECRET_ACCESS_KEY: 
AWS_REGION: 
```
