# 基于JWT的身份认证

JSON Web Token (缩写jwt) 是目前最流行的跨域身份认证解决方案

## 概要

* JWT 的签名可以防止用户信息被篡改，但不会加密数据，不要将未加密的隐私数据放入 JWT

* JWT 服务端生成的token保存在用户的客户端，鉴权的请求将token发回服务端，JWT 验证token的有效性；不像session 将数据保存在服务端进行身份认证

* node中使用jsonwebtoken这个包，jwt.sign生成token，jwt.verify验证解析token

## 1. 跨域身份认证的问题

用session做用户认证：

* 用户登录成功后，服务器向用户返回session_id（比如用户信息，登录时间的关联id），写入用户的cookie

* 用户之后的请求，都会通过cookie，将session_id传回服务器

* 服务器接收session_id，找到前期保存的数据，由此得知用户的身份

session的缺点在于服务端需要保存session数据，并且集群难以维护。

另一种方案是服务器不保存session数据，所有的数据都保存在客户端，每次请求发回服务器，jwt就是这样一种方案。

## 2. JWT 原理

JWT 的原理是，服务器认证用户登录后，生成一个json对象，发送给用户，就像下面这样：

```js
{
  "userid": 1,
  'expiresTime': '20220910' 
}
```

为了防止篡改用户数据，服务端会给这个json对象加上签名。

## 3. JWT 的数据结构

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VyaWQiOiIxIiwiaWF0IjoxNTE2MjM5MDIyfQ.
YWkH4u07AsVvi8Idb-JZnNzdnvz0OWI_ZIPtJGPTYFQ
```

中间用 <b>(.)</b> 分割成了三部分，JWT 的三个部分依次如下：

* Header (头部)

* Payload (负载)

* Signature (签名)

#### Header

Header 是一个json对象，描述 JWT 规范的信息，然后通过 Base64URL 算法转为字符串，一般是固定的

#### Payload

Payload 也是一个json对象，用户存放实际需要传递的数据，也要使用 Base64URL 算法转为字符串

<b>注意：JWT默认不加密，所以不要把未经加密的敏感信息放在这个部分</b>

#### Signature

Signature 是对Header和Payload的签名，防止数据篡改

首先，需要指定一个秘钥 (secret)，这个秘钥只有服务器知道。使用Header里面指定的签名算法 (默认是 HMAC SHA256)，按照下面的公式生成签名。

```
HMACSHA256(base64UrlEncode(header)) + '.' + 
base64UrlEncode(payload), secret)
```

<b>在JWT中，消息体是透明的，使用签名可以保证消息不被篡改。但不能实现数据的加密功能。</b>

## 4. express中使用jsonwebtoken

### 4.1 jsonwebtoken 转为promise

jsonwebtoken 的api需要转为promise

utils/jwt.js

```js
const jwt = require('jsonwebtoken')
const { promisify } = require('util')

exports.sign = promisify(jwt.sign)

exports.verify = promisify(jwt.verify)

exports.decode = promisify(jwt.decode)

```

### 4.2 jwt生成token

express中，用户登录使用 `jwt.sign` 将用户相关信息生成token发送到客户端：

```js
const jwt = require('../util/jwt')

// 用户登录
exports.login = async (req, res, next) => {
  try {
    // 1. 数据验证
    // 2. jwt.sign 生成 token
    const user = req.user.toJSON()
    const jwtSecret = '0242ac120002'
    const token = await jwt.sign({
      userId: user._id
    }, jwtSecret, {
      expiresIn: 60 * 60 * 24 // 设置过期时间
    })

    // 3. 发送成功响应（包含 token 的用户信息）
    delete user.password
    res.status(200).json({
      ...user,
      token
    })
  } catch (err) {
    next(err)
  }
}
```

### 4.3 使用中间件统一处理 JWT 身份认证

在middleware/auth.js中，写上处理 JWT 身份认证的中间件，jwt.verify解析并验证用户信息：

```js
const jwt = require('../util/jwt')
module.exports = async (req, res, next) => {
  // 从请求头'authorization'属性获取前端传递的 token 数据
  let token = req.headers['authorization']
  token = token ? token.split('Bearer ')[1] : null

  if (!token) {
    return res.status(401).end()
  }

  // jwt.verify 验证 token 是否有效
  // 无效 -> 响应 401 状态码
  // 有效 -> 把用户信息读取出来挂载到 req 请求对象上
  //        继续往后执行
  try {
    const decodedToken = await jwt.verify(token, jwtSecret)
    req.user = await User.findById(decodedToken.userId) // 数据库查询详细用户信息
    next()
  } catch (err) {
    return res.status(401).end()
  }
}
```

在需要用户身份认证的express路由处，使用auth中间件，不需要认证的地方不使用auth中间件：

```js
const express = require('express')
const auth = require('../middleware/auth')
const userCtrl = require('../controller/user')

const router = express.Router()

// 用户登录，不需要需要使用auth中间件
router.post('/users/login', userCtrl.login)

// 获取当前登录用户信息，需要使用auth认证
router.get('/user', auth, userCtrl.getCurrentUser)
```

controller/user.js

```js
// 获取当前登录用户信息
exports.getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      user: req.user // req.user 获取auth中间件处理后的用户信息
    })
  } catch (err) {
    next(err)
  }
}
```