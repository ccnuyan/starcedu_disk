|key|value|type|required|
|-|-|-|-|
|id|应用id|string|required|
|title|应用名|string|required|
|description|应用描述|string|required|
|local|应用描述|bool|required|
|pass|密码|[string]|required when local=true|
|key|密钥|[string]|required when local=false|
|auth|认证方式|[string]|required when local=false|
|redirect_url|回调地址|[string]|required when local=false|
|home_url|主页地址|[string]|required when local=false|