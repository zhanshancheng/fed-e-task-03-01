// 解析指令
class Compiler {
  constructor (vm) {
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }
  // 编译模版，处理文本节点和元素节点
  compile(el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      // 处理文本节点
      if (this.isTextNode(node)) {
        this.compileText(node)
      }
      // 处理元素节点
      if (this.isElementNode(node)) {
        this.compileElement(node)
      }
      // 判断node节点，是否有子节点，如果有子节点，要递归调用compile
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
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
        if (this.isEvent(attrName)) {
          let name = attrName.replace('on:', '')
          this.addHandler(node, name, key)
          return 
        }
        
        this.update(node, key, attrName)
      }
    })
  }
  addHandler (node, eventName, key) {
    let keyArr = key.split('(')
    let eventFn = keyArr[0]
    let eventArg = keyArr[1].match(/(?<=').*?(?=')/g)[0]
    node.addEventListener(eventName, () => {
      this.vm.$options.methods[eventFn](eventArg)
    })
  }
  update (node, key, attrName) {
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node, this.vm[key], key)
  }
  // 处理 v-text 指令
  textUpdater (node, value, key) {
    node.textContent = value
    new Watcher(this.vm, key, (newVal) => {
      node.textContent = newVal
    })
  }
  // 处理 v-model指令
  modelUpdater (node, value, key) {
    node.value = value
    new Watcher(this.vm, key, (newVal) => {
      node.value = newVal
    })
    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }
  // 处理 v-html 指令
  htmlUpdater (node, value, key) {
    node.innerHTML = value
    new Watcher(this.vm, key, (newVal) => {
      node.innerHTML = newVal
    })
  }
  // 处理 v-on:click 指令
  clickUpdater (node, value, key) {
    console.log(node, value, key)
  }
  // 处理文本节点，处理差值表达式
  compileText(node) {
    // {{}}
    let reg = /\{\{ (.+?) \}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])
      // 创建watcher对象，在数据改变时更新视图
      new Watcher(this.vm, key, (newVal) => {
        node.textContent = newVal
      })
    }
  }
  // 判断元素属性是否是指令
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  // 判断节点是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  // 判断节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
  // 判断元素属性是否是事件
  isEvent(attrName) {
    return attrName.includes(':')
  }
}