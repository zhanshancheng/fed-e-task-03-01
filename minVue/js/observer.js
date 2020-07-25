// 数据劫持

class Observer {
  constructor (data) {
    this.walk(data)
  }
  walk (data) {
    // 1. 判断data是否是对象
    if (!data || typeof data !== 'object') {
      return
    }
    // 2. 遍历data对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  defineReactive (obj, key, val) {
    // 如果val是对象 把val内部的属性转换成响应式数据
    let self = this
    // 负责收集依赖，并发送通知
    let dep = new Dep()
    self.walk(val)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set (newVal) {
        if (newVal === val) {
          return 
        }
        val = newVal
        self.walk(newVal)
        // 发送通知
        dep.notify()
      }
    })
  }
}