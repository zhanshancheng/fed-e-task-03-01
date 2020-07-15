## 一、阶段内容
  - 快速回顾 Vue.js 基础语法
  - Vue Router 原理分析与实现
  - 虚拟 DOM 库 Snabbdom 源码解析
  - 响应式原理分析与实现
  - Vue.js 源码分析
## 二、Vue基础结构

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