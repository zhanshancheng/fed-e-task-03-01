## 介绍
  - Vue Router 基础回顾
  - Hash 模式和 History 模式
  - 模拟实现自己的 Vue Router

## Vue Router的基础回顾
### 使用步骤
```javascript
// router/index.js
  import Vue from 'vue'
  import VueRouter from 'vue-router'
  import Index from '../views/Index.vue'
  // 1. 注册路由插件
  // Vue.use 是用来注册插件，它会调用传入对象的 install 方法
  Vue.use(VueRouter)
  // 路由规则
  const routers = [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/blog',
      name: 'Blog',
      component: () => import(/* webpackChunkName: "blog" */'../views/Blog.vue')
    },
    {
      path: '/photo',
      name: 'Photo',
      component: () => import(/* webpackChunkName: "photo" */'../views/Photo.vue')
    }
  ]
  // 2.创建 router 对象
  const router = new VueRouter({
    routers
  })
  export default router
```
```javascript
// main.js

  import Vue from 'vue'
  import App from './App.vue'
  import router from './router'
  
  Vue.config.productionTip = false

  new Vue({
    // 3. 注册 router 对象
    router,
    render: h => h(App)
  }).$mount('#app')
```
```html
<!-- App.vue -->

  <div id="app">
    <div id="nav">
      <!-- 5. 创建链接 -->
      <router-link to="/">Index</router-link> |
      <router-link to="blog">Blog</router-link> |
      <router-link to="photo">Photo</router-link>
    </div>
    <!-- 4. 创建路由组件的占位 -->
    <router-view />
  </div>
```
### 动态路由
  ```html
    <!-- Detail.vue -->

    <template>
      <div>
        <!-- 方式1: 通过当前路由规则，获取数据 -->
        通过当前路由规则获取：{{ $route.params.id }}
        <br/>
        <!-- 方式2: 路由规则中开启 props 传参 -->
        通过开启 props 获取：{{ id }}
      </div>
    </template>
    <script>
      export default {
        name: 'Detail',
        props: ['id']
      }
    </script>
  ```

  ```javascript
    // router/index.js

    import Vue from 'vue'
    import VueRouter from 'vue-router'
    import Index from '../views/Index.vue'

    Vue.use(VueRouter)
    const routers = [
      {
        path: '/',
        name: 'Index',
        component: Index
      },
      {
        path: '/detail/:id',
        name: 'Detail',
        // 开启 props, 会把 URL 中的参数传递给组件
        // 在组件中通过 props 来接收 URL 参数
        props: true,
        // 路由懒加载方式
        component: () => import(/* webpackChunkName: "detail" */ '../views/Detail.vue')
      }
    ]
    const router = new VueRouter({
      routers
    })
    export default router
  ```

### 嵌套路由
```html
  <!-- components/Layout.vue -->

  <template>
    <div>
      <img width="25%" src="@/assets/logo.png">
    </div>
    <div>
      <router-view></router-view>
    </div>
    <div>
      Footer
    </div>
  </template>
  <script>
    export default {
      name: 'layout'
    }
  </script>
```
```javascript
// router/index.js

  const routes = [
    {
      path: '/',
      component: Layout,
      chilren: [
        {
          name: 'index',
          path: '',
          component: Index
        },
        {
          name: 'detail',
          path: 'detail/:id',
          props: true,
          component: () => import('@/views/Detail.vue')
        }
      ]
    }
  ]
```
### 编程式导航
```html
<!-- Login.vue -->

  <template>
    <div>
      用户名：<input type="text" /><br />
      密码:<input type="password" /><br />
      <button @click="push">push</button>
    </div>
  </template>
  <script>
  export default {
    name: 'Login',
    methods: {
      push() {
        // 第一种方式 路径方式
        this.$router.push('/')
        // 第二种方式 name方式
        // this.$router.push({ name: 'Home' })
      }
    }
  }
  </script>
```

```html
<!-- Index.vue -->

<template>
  <div class="home">
    <div id="nav">
      <router-link to="/"> Index< /router-link>
    </div>
    <button @click="replace"> replace </button>

    <button @click="goDetail"> Detail </button>
  </div>
</template>
<script>
export default {
  name: 'Index',
  methods: {
    replace() {
      this.$router.replace('/login')
    }
    goDetail() {
      this.$router.push({ name: "Detail", params: { id: 1 } })
    }
  }
}
</script>
```

```html
<!-- Detail.vue -->

<template>
  <div>
    路由参数：{{ id }}
    <button @click="go"> go(-2) </button>
  </div>
</template>
<script>
export default {
  name: 'Detail',
  props: ['id']
  methods: {
    go() {
      this.$router.go(-2)
    }
  }
}
</script>
```

## Hash 模式和 History 模式
  - 不管哪种模式都是客户端路由的实现方式，不会像服务器发送请求
  - 使用 js 监听路径的变化，然后渲染不同的内容
### Hash 模式和 History 模式的区别

#### 表现形式的区别
  - Hash 模式
    https://music.163.com/#/playlist?id=310291863
  - History 模式
    https://music.163.com/playlist/310291863
#### 原理的区别
  - Hash 模式是基于锚点，以及 onhashchange 事件
  - History 模式是基于 HTML5 中的 History API
  - `history.pushState()`  IE 10 以后才支持
  - `history.replaceState()`

### History 模式

#### History 模式的使用
  - History 需要服务器的支持
  - 单页应用中，服务端不存在 http://www.testurl.com/login 这样的地址会返回找不到该页面
  - 在服务端应该出了静态资源外都返回单页应用的 index.html 

### History 模式 - Node.js
  ```javascript
    // node app.js

    const path = require('path')
    // 导入处理 history 模式的模块
    const history = require('connet-history-api-fallback')
    // 导入 express
    const express = require('express')

    const app = express()
    // 注册处理 history 模式的中间件
    app.use(history())
    // 处理静态资源的中间件， 网站根目录 ../web
    app.use(express.static(path.join(__dirname, '../web')))

    // 开启服务器，端口是 3000
    app.listen(3000, () => {
      consoe.log('服务器开启，端口：3000')
    })
  ```
### History 模式 - nginx
#### nginx 服务器配置
  - 从官网下载 nginx 的压缩包
  - 把压缩包解压到 c 盘 根目录， c:\nginx-1.18.0 文件夹
  - 打开命令行，切换到目录 c:nginx-1.18.0
  ```
    # 启动
    start nginx
    # 重启
    nginx -s reload
    # 停止
    nginx -s stop
  ```
  ```
    # nginx.conf

    location / {
      root  html;
      index index.html  index.htm;
    # 新加
      try_files $uri  $uri/ /index.html
    }
  ```
## 模拟实现自己的 Vue Router