[![Build Status](https://www.travis-ci.org/ccnuyan/starcedu_disk.svg?branch=master)](https://www.travis-ci.org/ccnuyan/starcedu_disk)

# API

参考开源项目 [fineuploader](https://fineuploader.com/)

[客户端上传JS代码](/src/store/actions/qiniuFineUploader.js)

客户端上传需考虑 `开发配置的客户端回调` 和 `生产环境的服务端回调` 两种情景

[/src/store/actions/qiniuFineUploader.js#L79-L129](/src/store/actions/qiniuFineUploader.js#L79-L129)

下载授权：

[/src/api/files/files.js#L23-L38](/src/api/files/files.js#L23-L38)

网盘文件API(所有服务需认证)

baseUrl: /apps/disk/

1. 请求上传令牌
Endpoint: `/api/files/`  
Method: `POST`  
No Params:

1. 请求下载
Endpoint: `/api/files/access`  
Method: `GET`  
No Params:

1. 请求文件详情
Endpoint: `/api/files?file_id={$file_id}`  
Method: `GET`  
No Params:

1. 请求已上传文件列表
Endpoint: `/api/files/uploaded`  
Method: `GET`  
Params: `uploader_id?`  

1. 更新文件名
Endpoint: `/api/files?file_id={$file_id}`  
Method: `PUT`
Params: `uploader_id, file_id, title`

1. 更新文件状态（用于回调）// 生产环境不调用
Endpoint: `/api/files?file_id={$file_id}`  
Method: `PUT`  
Params: `etag, mime, size, id`  

1. 删除文件
Endpoint: `/api/files?file_id={$file_id}`  
Method: `DELETE`  
Params: `uploader_id, file_id`  


---

1. 添加远程文件
Endpoint: `/api/files/remote`  
Method: `POST`  
Params: `filename, file_url`  


