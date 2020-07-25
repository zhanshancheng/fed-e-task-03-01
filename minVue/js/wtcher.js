class Watcher {
  constructor (vm, key, cb) {
    this.vm = vm;
    // data 中的属性名称
    this.key = key;
    // 回调函数负责渲染视图
    this.cb = cb;
    // 把 watcher 对象记录到 Dep 类的静态属性 target 中
    Dep.target = this
    // 触发 get 方法，在 get 方法中会触发 addSub。并保存上一个的值
    this.oldValue = vm[key]
    // 防止多次添加
    Dep.target = null
  }
  // 当数据发生变化的时候更新视图
  update() {
    let newValue = this.vm[this.key]
    if (newValue === this.oldValue) {
      return 
    }
    this.cb(newValue)
  }
}