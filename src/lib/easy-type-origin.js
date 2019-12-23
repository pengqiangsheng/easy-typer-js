/**
 * EastTyped 超简易的js打字机效果功能
 * @param {*配置对象} obj
 * @param {*内容输入} input
 * @param {* 完成一次output输出后的回调函数} fn
 * @param {*钩子 钩在每一帧将要完成的时间片段上} hooks
 */
export default class EasyTyper {
  // 构造器
  constructor(obj, input, fn, hooks) {
    this.props = {
      output: '',
      type: 'rollback',
      isEnd: false,
      speed: 80,
      backSpeed: 40,
      sleep: 6000,
      singleBack: false
    }
    if(this.checkKeyIsNull(obj)){
      return this.errorTip(`EsayTyped.js: 配置对象中有一个字段是undefined或null，请仔细检查对象是否完整！！！`)
    }
    if(this.checkFieldIsError(obj)) {
      return
    }
    this.obj = obj
    this.input = input || '抱歉，没有内容输入'
    this.fn = typeof fn === 'function' ? fn : function() {}
    this.hooks = typeof hooks === 'function' ? hooks : function() {}
    this.timer = null
    this.close = this.close
    this.sleep = this.sleep
    this.typeAction = {
      'rollback': this.typedBack.bind(this),
      'normal': this.fn,
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
    let i = 0, stop = false
    this.timer = setInterval(() => {
      if(i === this.input.length) {
        i = 0
        stop = true
        this.closeTimer()
      }

      if(this.obj.isEnd) return this.closeTimer()

      if(stop) return this.nextTick()

      this.obj.output = this.input.slice(0, i + 1)
      this.hooks(this.input.slice(0, i + 1), this)
      i++
    }, this.obj.speed)
  }

  // 回滚方法
  typedBack() {
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
        return this.fn(this)
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
    const { 
      output,
      type,
      isEnd,
      speed,
      backSpeed,
      sleep,
      singleBack
    } = obj
    if(typeof output !== 'string') {
      this.errorTip(`output 必须为 string 类型`)
      return true
    }
    if(typeof type !== 'string') {
      this.errorTip(`type 必须为 string 类型`)
      return true
    }
    if(typeof isEnd !== 'boolean') {
      this.errorTip(`isEnd 必须为 boolean 类型`)
      return true
    }
    if(typeof speed !== 'number') {
      this.errorTip(`speed 必须为 number 类型`)
      return true
    }
    if(typeof backSpeed !== 'number') {
      this.errorTip(`backSpeed 必须为 number 类型`)
      return true
    }
    if(typeof sleep !== 'number') {
      this.errorTip(`sleep 必须为 number 类型`)
      return true
    }
    if(typeof singleBack !== 'boolean') {
      this.errorTip(`singleBack 必须为 boolean 类型`)
      return true
    }
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




/******************************以下函数单独封装，可以单独调用使用*****************************************/

/**
 * 回滚方法
 * 可以单独导出使用
 * @param {*配置对象} obj 
 * @param {*回调方法} fn 
 */
export const typedBack = function (obj, fn) {
  let input = obj.output
  if(!input) return
  let i = input.length, stop = false
  let timer = setInterval(() => {
      if(i === -1) {
          obj.output = ''
          i = 0
          stop = true
          clearInterval(timer)
          timer = null
      }
      if(obj.isEnd) {
          clearInterval(timer)
          timer = null
          obj.singleBack = false
          return
      }
      if(stop) {
          obj.singleBack = false
          console.log(typeof fn === 'function')
          return (typeof fn === 'function') ? fn() : ''
      }
      obj.output = input.slice(0, i+1)
      console.log(i)
      i--
  }, obj.backSpeed)
}

/**
 * 打字方法
 * 可以单独导出使用
 * @param {*配置对象} obj 
 * @param {*需要输入的内容} input
 * @param {*回调方法} fn 
 */
export const typing = function (obj, input, fn)  {
  if(!input) return
  let i = 0, stop = false
  let timer = setInterval(() => {
      if(i === input.length) {
          i = 0
          stop = true
          clearInterval(timer)
          timer = null
      }
      if(obj.isEnd) {
          clearInterval(timer)
          timer = null
          return
      }
      if(stop) {
          if(obj.type === 'default') {
              return typedBack(obj, fn)
          }else {
              if(obj.singleBack) {
                 return typedBack(obj, fn)
              }
              return (typeof fn === 'function') ? fn() : ''
          }
      }
      obj.output = input.slice(0, i+1)
      i++
  }, obj.speed)
}

/**
 * 标准参数
 * @param {* 输出内容 } output
 * @param {* 下一次的行为 'roolback', 'normal', 'custom'} type
 * @param {* 全局控制是否终止 } isEnd
 * @param {* 打字速度 } speed
 * @param {* 回滚速度 } backSpeed
 * @param {* 线程睡眠时间 } backSpeed
 * @param {* 单次的回滚效果 } singleBack
 */
export const props = () => ({
  output: '',
  type: 'rollback',
  isEnd: false,
  speed: 80,
  backSpeed: 40,
  sleep: 6000,
  singleBack: false,
})

/**
 * 校验参数的完整性
 * @param {*入参对象} obj 
 * @param {*参数校验对象} props 
 */
export const checkKeyIsNull = (obj, props) => {
  return Object.keys(props).some(key => {
    return obj[key] === undefined || obj[key] === null
  })
}

// 惰性单例
export var getSingle = function(fn) {
  var result
  return function ()  {
      return result || (result = fn.apply(this, arguments))
  }
}

