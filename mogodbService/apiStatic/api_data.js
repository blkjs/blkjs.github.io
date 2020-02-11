define({ "api": [
  {
    "type": "ws",
    "url": "ws://ip:3001",
    "title": "chat",
    "name": "登录接口",
    "group": "chat",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>用户发送的消息.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功的返回示例:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"脚底板\",\n  \"times\": \"1782220023\",\n  \"id\":\"13156131513\",\n  \"name\":\"大奔\"\n}\n\n实时在线人数返回示例\nHTTP/1.1 200 OK\n{\n  \"num\": \"8\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "router/noticeRouter.js",
    "groupTitle": "chat"
  },
  {
    "type": "post",
    "url": "/file/upload",
    "title": "上传图片",
    "name": "上传图片",
    "group": "file",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "userEmail",
            "description": "<p>用户邮箱账号,将作为文件夹名称.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "imgBase64",
            "description": "<p>用户上传的Base64图片字符串.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "type",
            "description": "<p>1头像,2其他.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功的返回示例:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": 0,\n  \"message\": \"上传成功\",\n  \"imgURL\": \"/uploads/123456@qq.com/headerImg.png\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "router/fileRouter.js",
    "groupTitle": "file"
  },
  {
    "type": "post",
    "url": "/food/getInfoByPage",
    "title": "分页查询",
    "name": "//分页查询",
    "group": "food",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "pageSize",
            "description": "<p>每页数据条数.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>哪一页.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功的返回示例:",
          "content": "    HTTP/1.1 200 OK\n    {\n\"massage\": \"查询成功\",\n\"status\": 1,\n\"data\": [\n  {\n    \"_id\": \"5e3c28acc8769d12ec772707\",\n    \"foodName\": \"宫保鸡丁\",\n    \"price\": \"23\",\n    \"img\": \"/public/images/2.png\",\n    \"cum\": 8,\n    \"__v\": 0\n  },\n  {\n    \"_id\": \"5e3c28b1c8769d12ec772708\",\n    \"foodName\": \"胡萝卜\",\n    \"price\": \"23\",\n    \"img\": \"/public/images/2.png\",\n    \"cum\": 8,\n    \"__v\": 0\n  },\n  {\n    \"_id\": \"5e3c28b3c8769d12ec772709\",\n    \"foodName\": \"小白菜\",\n    \"price\": \"23\",\n    \"img\": \"/public/images/2.png\",\n    \"cum\": 8,\n    \"__v\": 0\n  }\n]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "router/foodRouter.js",
    "groupTitle": "food"
  },
  {
    "type": "post",
    "url": "/food/addFood",
    "title": "增加食物",
    "name": "增加食物",
    "group": "food",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "foodName",
            "description": "<p>食物名.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "price",
            "description": "<p>价格.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "img",
            "description": "<p>图片.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功的返回示例:",
          "content": "HTTP/1.1 200 OK\n{\n  \"userEmail\": \"2155655@qq.com\",\n  \"userPass\": \"123456\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "router/foodRouter.js",
    "groupTitle": "food"
  },
  {
    "type": "post",
    "url": "/user/VCode",
    "title": "图形验证码",
    "name": "图形验证码",
    "group": "user",
    "success": {
      "examples": [
        {
          "title": "成功的返回示例:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": 1,\n  \"message\": \"成功\",\n  \"codeData\":{\n   \"img\":\"<svg>...</svg>\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "router/userRouter.js",
    "groupTitle": "user"
  },
  {
    "type": "post",
    "url": "/user/reg",
    "title": "用户注册",
    "name": "用户注册",
    "group": "user",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "userEmail",
            "description": "<p>用户邮箱号.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "userPass",
            "description": "<p>用户密码.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>验证码.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功的返回示例:",
          "content": "HTTP/1.1 200 OK\n{\n  \"userEmail\": \"2155655@qq.com\",\n  \"userPass\": \"123456\",\n  \"code\":\"s55g\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "router/userRouter.js",
    "groupTitle": "user"
  },
  {
    "type": "post",
    "url": "/user/login",
    "title": "登录接口",
    "name": "登录接口",
    "group": "user",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "userEmail",
            "description": "<p>用户邮箱号.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "userPass",
            "description": "<p>用户密码.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功的返回示例:",
          "content": "HTTP/1.1 200 OK\n{\n  \"userEmail\": \"2155655@qq.com\",\n  \"userPass\": \"123456\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "router/userRouter.js",
    "groupTitle": "user"
  },
  {
    "type": "post",
    "url": "/user/getMailCde",
    "title": "邮箱验证码",
    "name": "邮箱验证码",
    "group": "user",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "userEmail",
            "description": "<p>用户邮箱号.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "成功的返回示例:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": 1,\n  \"message\": \"发送成功\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "router/userRouter.js",
    "groupTitle": "user"
  }
] });
