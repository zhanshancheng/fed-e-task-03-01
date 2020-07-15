## 介绍
  - Vue Router 基础回顾
  - Hash 模式和 History 模式
  - 模拟实现自己的 Vue Router

## Vue Router的基础回顾

  ```javascript
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