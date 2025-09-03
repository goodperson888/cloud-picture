摄影图片平台APIs
注：所有的接口请求都是按照http://43.153.43.24/beans/...的路径方式，所有的请求都是POST
请求头的auth...改成token，token也不要加bear...直接把后端返回的token放进去就行

1.账号密码登录：（现在用户注册需要手动插入数据库）
接口：
http://43.153.43.24/beans/user/loginByPwd POST
body:
{
  "username": "image",
  "password": "image"
}
返回：
{
    "code": "000000",
    "msg": "",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoxLCJleHAiOjE3NTcwNjA0MzQsInVzZXJJZCI6NiwiZW1haWwiOiJpbWFnZSJ9.XeudkcW1O_P897rATnuZdDxcRM7fC1lzwgLlkaaqPow",
        "email": "image",
        "type": 1,
        "id": 6,
        "nickname": "image"
    }
}
2.上传图片
接口：
http://43.153.43.24/beans/file/upload POST
参数：
form-data:
file: a.png
返回：
{
    "code": "000000",
    "msg": "",
    "data": "http://43.153.43.24/file/d88753f7-4e1f-4f7b-aa2c-d8f9096b18d6.jpeg"
}
3.新建/更新图文，如果是新建则不需要传id，如果是更新则需要传id，更新的话，需要把所有的字段传给后端
/sheyingImage/save POST

body
{
  "id": 0,
  "name": "string", //标题
  "content": "string", //内容
  "images": [  //图片列表的url
    "string"
  ],
  "coverImage": "string", //封面的url
}


返回：

{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "userId": 0,
    "createTime": "2025-08-29 13:45:45.436",
    "name": "string",
    "content": "string",
    "images": [
      "string"
    ],
    "coverImage": "string",
    }
}

4.图文列表查询，分页查询
/sheyingImage/listAll POST
body
{
  "data": {
     "name": "string", // 名称模糊查询
      "dirId": 0  //分类id
  },
  "page": 0,
  "size": 10
}

返回：

{
  "code": "string",
  "msg": "string",
  "data": {
    "totalElements": 0,
    "totalPages": 0,
    "pageable": {
      "pageNumber": 0,
      "pageSize": 0,
      "paged": true,
      "unpaged": true,
      "offset": 0,
      "sort": {
        "sorted": true,
        "unsorted": true,
        "empty": true
      }
    },
    "numberOfElements": 0,
    "first": true,
    "last": true,
    "size": 0,
    "content": [
      {
        "id": 0,
        "userId": 0,
        "createTime": "2025-08-29T14:00:50.276Z",
        "name": "string",
        "content": "string",
        "images": [
          "string"
        ],
        "coverImage": "string",
        "dirId": 0
      }
    ],
    "number": 0,
    "sort": {
      "sorted": true,
      "unsorted": true,
      "empty": true
    },
    "empty": true
  }
}

5. 图文详情，根据id查询
/sheyingImage/info POST
body：

{
  "id": 0
}

返回：

{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "userId": 0,
    "createTime": "2025-08-29T14:03:24.027Z",
    "name": "string",
    "content": "string",
    "images": [
      "string"
    ],
    "coverImage": "string",
    "dirId": 0
  }
}

6.图文删除
/sheyingImage/delete POST
body：

{
  "id": 0
}

返回：


{
  "code": "string",
  "msg": "string",
  "data": {}
}


7.图片分类管理下创建和保存，如果是新建则不需要传id，如果是更新则需要传id，更新的话，需要把所有的字段传给后端
sheyingDir/save
body:

{
  "id": 0,
   "name": "string",
  "ids": [1,2], //分类下的图文的id列表
]

返回：

{
  "code": "string",
  "msg": "string",
  "data": {
    "id": 0,
    "createTime": "2025-08-29 14:06:05",
    "name": "string",
    "ids": [
      0
    ]
    }
}

8.分类查询列表：分页查询，如果不想分页，则把size 传大点比如9999
sheyingDir/listAll
body:

{
  "data": {
    "name": "string", //分类按照名称模糊查询
    },
  "page": 0,
  "size": 10
}

返回：

{
  "code": "string",
  "msg": "string",
  "data": [
    {
      "id": 0,
      "createTime": "2025-08-29T14:09:26.431Z",
      "name": "string",
      "ids": [
        0
      ],
      "images": [
        {
          "id": 0,
          "userId": 0,
          "createTime": "2025-08-29T14:09:26.431Z",
          "name": "string",
          "content": "string",
          "images": [
            "string"
          ],
          "coverImage": "string",
          "dirId": 0
        }
      ]
    }
  ]
}


9 分类删除
sheyingDir/delete
body：

{
  "id": 0
}

返回：
{
  "code": "string",
  "msg": "string",
  "data": {}
}




