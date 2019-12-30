
class EasyTyper {
  // 构造器
  constructor(obj, input, fn, hooks) {
    this.props = {
      output: '',
      type: 'rollback',
      isEnd: false,
      speed: 80,
      backSpeed: 40,
      sleep: 6000,
      singleBack: false,
      sentencePause: false
    }
    if(this.checkKeyIsNull(obj)){
      return this.errorTip(`EsayTyped.js: 配置对象中有一个字段是undefined或null，请仔细检查对象是否完整！！！`)
    }
    if(this.checkFieldIsError(obj)) {
      return
    }
    this.obj = obj
    this.input = input || '抱歉，没有内容输入'
    this.input = !(this.input instanceof Array) ? [this.input] : this.input
    this.fn = typeof fn === 'function' ? fn : function() {}
    this.hooks = typeof hooks === 'function' ? hooks : function() {}
    this.timer = null
    this.close = this.close
    this.sleep = this.sleep
    this.sentenceCallTimes = 0 // 句子回调次数
    this.typeAction = {
      'rollback': this.typedBack.bind(this),
      'normal': this.play.bind(this),
      'custom': this.fn
    }
    this._init()
  }

  // 初始化，构造函数执行立即触发
  _init () {
    this.play()
  }

  // 打字
  play() {
    if(!this.input.length) return this.fn(this)

    let i = 0, stop = false, input = this.input.shift()
    this.timer = setInterval(() => {
      if(i === input.length) {
        i = 0
        stop = true
        this.closeTimer()
      }

      if(this.obj.isEnd) return this.closeTimer()

      if(stop) return this.nextTick()

      this.obj.output = input.slice(0, i + 1)
      this.hooks(input.slice(0, i + 1), this)
      i++
    }, this.obj.speed)
  }

  // 回滚方法
  typedBack() {
    // 如果句子出书完毕，且是句子暂停模式
    if(!this.input.length && this.obj.sentencePause) return this.fn(this)

    let input = this.obj.output
    let i = input.length, stop = false
    this.timer = setInterval(() => {
      if(i === -1) {
        this.obj.output = ''
        this.hooks('', this)
        i = 0
        stop = true
        this.closeTimer()
      }
      if(this.obj.isEnd) {
        this.closeTimer()
        return this.obj.singleBack = false
      }
      if(stop) {
        this.obj.singleBack = false
        return (() => {
          const { length } = this.input
          return length ? this.play() : this.fn(this)
        })()
      }
      this.obj.output = input.slice(0, i + 1)
      this.hooks(input.slice(0, i + 1), this)
      i--
    }, this.obj.backSpeed)
  }

  // 输出方式
  getOutputType() {
    return this.typeAction[this.obj.type](this)
  }

  // 关闭定时器
  closeTimer() {
    clearInterval(this.timer)
    this.timer = null
  }

  // 下一次触发方式
  async nextTick() {
    // 等待
    await this.sleep(this.obj.sleep)
    return this.obj.singleBack ? this.typedBack() : this.getOutputType()
  }

  // 校验参数完整性
  checkKeyIsNull(obj) {
    return Object.keys(this.props).some(key => {
      return obj[key] === undefined || obj[key] === null
    })
  }

  // 检验参数类型
  checkFieldIsError(obj) {
    let flag = false
    Object.keys(obj).forEach(key => {
      const proxy = EasyTyperStrategy[key](obj)
      if(proxy.check()) {
        proxy.showTip(key)
        return flag = true
      }
    })
    return flag
  }

  // 线程等待
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 结束
  close() {
    return this.obj.isEnd = true
  }
 
  // 错误提示语
  errorTip (message) {
    return console.error(message)
  }
}

// 策略分发
const EasyTyperStrategy = (() => ({
  output: obj => {
    return new CheckField(`string`, obj.output)
  },
  type: obj => {
    return new CheckField(`string`, obj.type)
  },
  isEnd: obj => {
    return new CheckField(`boolean`, obj.isEnd)
  },
  speed: obj => {
    return new CheckField(`number`, obj.speed)
  },
  backSpeed: obj => {
    return new CheckField(`number`, obj.backSpeed)
  },
  sleep: obj => {
    return new CheckField(`number`, obj.sleep)
  },
  singleBack: obj => {
    return new CheckField(`boolean`, obj.singleBack)
  },
  sentencePause: obj => {
    return new CheckField(`boolean`, obj.sentencePause)
  },
}))()

// 字段校验类
class CheckField {
  constructor(type, field) {
    this.type = type
    this.field = field
  }
  check() {
    return typeof this.field !== `${this.type}`
  }
  showTip(name) {
    console.error(`${name} 必须为 ${this.type} 类型！`)
  }
}
