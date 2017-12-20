# API

参考开源项目 [fineuploader](https://fineuploader.com/)

[客户端上传JS代码](/src/store/actions/qiniuFineUploader.js)

客户端上传需考虑开发配置的客户端回调和生产环境的服务端回调

[../src/store/actions/qiniuFineUploader.js#L79-L129](../src/store/actions/qiniuFineUploader.js#L79-L129)

下载授权：

[../src/api/files/files.js#L23-L38](../src/api/files/files.js#L23-L38)

网盘文件API(所有服务需认证)

baseUrl: /apps/disk/

1. 请求上传令牌
Endpoint: `/api/files/`  
Method: `POST`  
No Params:

1. 请求下载
Endpoint: `/api/files/access`  
Method: `GET`  

1. 请求文件详情
Endpoint: `/api/files?file_id={$file_id}`  
Method: `GET`  

1. 请求已上传文件列表
Endpoint: `/api/files/uploaded`  
Method: `GET`  
No Params: `uploader_id?`

1. 更新文件名
Endpoint: `/api/files?file_id={$file_id}`  
Method: `PUT`
No Params: `uploader_id, file_id, title`

1. 更新文件状态（用于回调）
Endpoint: `/api/files?file_id={$file_id}`  
Method: `PUT`
No Params: `etag, mime, size, id`

1. 删除文件
Endpoint: `/api/files?file_id={$file_id}`  
Method: `DELETE`
No Params: `uploader_id, file_id`


