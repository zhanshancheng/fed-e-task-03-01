let _Vue = null

export default class VueRouter {
  static install (Vue) {
    //  1. 判断当前插件是否已经被安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    //  2. 把Vue构造函数记录到全局变量
    _Vue = Vue
    //  3. 把创建Vue实例时候传入的router对象注入到Vue实例上
    // 混入
    _Vue.mixin({
      beforeCreate () {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
        }
      }
    })
  }

  constructor (options) {
    this.options = options
    // routeMap 的作用：把 options 中传入的 routers 解析存进 routeMap中 key:路由地址 value:组件
    // 将来在 router-view 中根据 路由地址来 routeMap 中拿到对应的组件渲染到游览器
    this.routeMap = {}
    // 利用 Vue 实例中的 observable 创建响应式对象
    this.data = _Vue.observable({
      // current 作用为存储当前路由地址。默认为 /
      current: '/'
    })
  }

  createRouteMap () {
    // 遍历所有路由规则，把路由规则解析成键值对的形式 存储到 routeMap 中
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }
}