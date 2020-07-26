## 一、阶段内容
  - 快速回顾 Vue.js 基础语法
  - Vue Router 原理分析与实现
  - 虚拟 DOM 库 Snabbdom 源码解析
  - 响应式原理分析与实现
  - Vue.js 源码分析
## 二、Vue基础结构

  ### 模式一 el选项
  ```javascript
    <div id="app">
      <p>公司名称：{{ company.name }}</p>
      <p>公司名称：{{ company.address }}</p>
    </div>

    <script>
      new Vue({
        el: '#app',
        data: {
          company: {
            name: '拉勾'
            address: '中关村创业大街'
          }
        }
      })
    </script>
  ```
  ### 模式二 render选项
  ```javascript
    <div id="app">
    </div>

    <script>
      new Vue({
        el: '#app',
        data: {
          company: {
            name: '拉勾'
            address: '中关村创业大街'
          }
        },
        // render 函数默认接收一个 h 函数
        render(h) {
          // h 函数的作用是创建一个虚拟DOM
          return h('div', [
            h('p', '公司名称' + this.company.name),
            h('p', '公司地址' + this.company.address)
          ])
        }
        // $mount的作用是把虚拟DOM转化为真实DOM 渲染到游览器
      }).$mount('#app')
      
    </script>
  ```


## 三、Vue 的生命周期
  ![Image text](https://cn.vuejs.org/images/lifecycle.png)

## 四、Vue 语法和概念
  - 插值表达式
  - 指令
  - 计算属性和侦听器
  - Class 和 Style 绑定
  - 条件渲染/列表渲染
  - 表单输入绑定
  - 组件
  - 插槽
  - 插件
  - 混入 mixin
  - 深入响应式原理
  - 不同构建版本的 Vue