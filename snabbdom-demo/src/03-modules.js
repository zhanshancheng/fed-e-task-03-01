import { init, h } from 'snabbdom'
// 1. 导入模块
import { classModule } from 'snabbdom/modules/class'
import { propsModule } from 'snabbdom/modules/props'
import { styleModule } from 'snabbdom/modules/style'
import { eventListenersModule } from 'snabbdom/modules/eventlisteners'
// 2. 注册模块
let patch = init({
  classModule,
  propsModule,
  styleModule,
  eventListenersModule
})
// 3. 使用 h() 函数的第二个参数传入模块需要的数据(对象)

let vnode = h('div', {
  style: {
    backgroundColor: 'red'
  },
  on: {
    click: eventClick
  }
}, [
  h('h1', 'Hello Snabbdom'),
  h('p', 'p标签')
])

function eventClick() {
  console.log('点击')
}

let app = document.querySelector('#app')

patch(app, vnode)