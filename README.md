# fed-e-task-03-01
Part3 | 模块1

## 一、简答题
### 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么？
```js
let vm = new Vue({
  el: '#el',
  data: {
    o: 'object',
    dog: {}
  },
  method: {
    clickHandler () {
      // 该 name 属性是否是响应式的
      this.dog.name = 'Trump'
    }
  }
})
```
- 因为 Vue 会在初始化实例的时候通过 Observer 给实例中 data 的所有属性添加 getter/ setter 转换为响应式数据，所以后面新增成员**不是响应式数据**;
- 如果想把新增成员设置成响应式数据，应在新增成员时调用 Observer 中的 defineReactive 方法。给新增成员添加 getter/setter 转换成响应式数据
### 2、请简述 Diff 算法的执行过程
- 判断新老节点是否存在
  - 老节点不存在，直接添加新节点到父元素
  - 新节点不存在，直接从父元素删除老节点
  - 都存在
    - 判断是否相同节点
      - 相同直接返回
      - 不相同
        - 如果新老节点都是静态的，且key相同。从老节点拿过来，跳过比对的过程。
        - 如果新节点是文本节点，设置节点的text
        - 新节点不是文本节点
          - 新老节点子节点都存在且不同，使用updateChildren函数来更新子节点
          - 只有新节点字节点存在，如果老节点子节点是文本节点，删除老节点的文本，将新节点子节点插入
          - 只有老节点存在子节点，删除老节点的子节点
    - updateChildren
      - 给新老节点定义开始、结束索引
      - 循环比对新节点开始VS老节点开始、新节点结束VS老节点结束、新节点开始VS老节点结束、新节点结束VS老节点开始并移动对应的索引，向中间靠拢
      - 根据新节点的key在老节点中查找，没有找到则创建新节点。
      - 循环结束后，如果老节点有多的，则删除。如果新节点有多的，则添加。

## 二、编程题
### 1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
```js
clickHandler (e) {
  location.hash = this.to
  this.$router.data.current = this.to
  e.preventDefault()
}
window.addEventListener('hashchange', () => {
  this.data.current = location.hash.slice(1)
})
```
### 2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。
- v-html 指令(代码地址：./minVue/js/compiler.js)
```js
// 处理 v-html 指令
htmlUpdater (node, value, key) {
  node.innerHTML = value
  new Watcher(this.vm, key, (newVal) => {
    node.innerHTML = newVal
  })
}
```
- v-on 指令(代码地址：./minVue/js/compiler.js)
```js
// 判断元素属性是否是事件
isEvent(attrName) {
  return attrName.includes(':')
}
// 编译元素节点，处理指令
compileElement(node) {
  // 遍历所有的属性节点
  Array.from(node.attributes).forEach(attr => {
    // 判断是否是指令
    let attrName = attr.name
    if (this.isDirective(attrName)) {
      // v-text --> text
      attrName = attrName.substr(2)
      let key = attr.value
      // 新增判断是否为 v-on 指令
      if (this.isEvent(attrName)) {
        let name = attrName.replace('on:', '')
        this.addHandler(node, name, key)
        return 
      }
      
      this.update(node, key, attrName)
    }
  })
}
// 添加事件
addHandler (node, eventName, key) {
    let keyArr = key.split('(')
    let eventFn = keyArr[0]
    let eventArg = keyArr[1].match(/(?<=').*?(?=')/g)[0]
    node.addEventListener(eventName, () => {
      this.vm.$options.methods[eventFn](eventArg)
    })
  }
```
### 3、参考 Snabbdom 提供的电影列表的示例，利用 Snabbdom 实现类似的效果，如图：
![avatar](https://s0.lgstatic.com/i/image/M00/26/F2/Ciqc1F7zUZ-AWP5NAAN0Z_t_hDY449.png)

```js
import { h, init } from 'snabbdom'
import style from 'snabbdom/modules/style'
import eventlisteners from 'snabbdom/modules/eventlisteners'
import { originalData } from './originData'

let patch = init([style,eventlisteners])

let data = [...originalData]
const container = document.querySelector('#container')

var sortBy = 'rank';
let vnode = view(data);

// 初次渲染
let oldVnode = patch(container, vnode)


// 渲染
function render() {
    oldVnode = patch(oldVnode, view(data));
}
// 生成新的VDOM
function view(data) {
    return h('div#container',
        [
            h('h1', 'Top 10 movies'),
            h('div',
                [
                    h('a.btn.add',
                        { on: { click: add } }, 'Add'),
                    'Sort by: ',
                    h('span.btn-group',
                        [
                            h('a.btn.rank',
                                {
                                    'class': { active: sortBy === 'rank' },
                                    on: { click: [changeSort, 'rank'] }
                                }, 'Rank'),
                            h('a.btn.title',
                                {
                                    'class': { active: sortBy === 'title' },
                                    on: { click: [changeSort, 'title'] }
                                }, 'Title'),
                            h('a.btn.desc',
                                {
                                    'class': { active: sortBy === 'desc' },
                                    on: { click: [changeSort, 'desc'] }
                                }, 'Description')
                        ])
                ]),
            h('div.list', data.map(movieView))
        ]);
}

// 添加一条数据 放在最上面
function add() {
    const n = originalData[Math.floor(Math.random() * 10)];
    data = [{ rank: data.length+1, title: n.title, desc: n.desc, elmHeight: 0 }].concat(data);
    render();
}
// 排序
function changeSort(prop) {
    sortBy = prop;
    data.sort(function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        }
        if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    });
    render();
}

// 单条数据
function movieView(movie) {
    return h('div.row', {
        key: movie.rank,
        style: {
            display: 'none', 
            delayed: { transform: 'translateY(' + movie.offset + 'px)', display: 'block' },
            remove: { display: 'none', transform: 'translateY(' + movie.offset + 'px) translateX(200px)' }
        },
        hook: {
            insert: function insert(vnode) {
                movie.elmHeight = vnode.elm.offsetHeight;
            }
        }
    }, [
        h('div', { style: { fontWeight: 'bold' } }, movie.rank),
        h('div', movie.title), h('div', movie.desc),
        h('div.btn.rm-btn', {on: { click: [remove, movie]}}, 'x')]);
}
// 删除数据
function remove(movie) {
    data = data.filter(function (m) {
        return m !== movie;
    });
    render()
}
```