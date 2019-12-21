# easy-typer-js
<a href="https://www.npmjs.com/package/easy-typer-js"><img src="https://img.shields.io/npm/v/easy-typer-js.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/easy-typer-js"><img src="https://img.shields.io/npm/l/easy-typer-js.svg" alt="License"></a>
<a href="https://npmcharts.com/compare/easy-typer-js?minimal=true"><img src="https://img.shields.io/npm/dm/easy-typer-js.svg" alt="Downloads"></a>

> 功能十分强大打字机插件，兼容原生JS和MVVM类框架（Vue, React...），随心所欲的输出。

# 一、效果展示
![](https://user-gold-cdn.xitu.io/2019/12/21/16f27c7653b345ee?w=1920&h=1080&f=gif&s=3531097)
easy-typer-js是一个轻量级的插件, 用于实现页面文字的打字机效果. 它使用起来非常简单, 只需要几行代码就能实现高大上的打字机效果.而且对MVVM框架支持完美，还兼容原生JS.

# 二. 使用easy-typer-js

## 1. 引入easy-typer-js
- 方法1: ES6模块化引入(官方推荐)
```js
// 安装
npm install easy-typer-js --save
或者
yarn add easy-typer-js
```
```js
// 引入
import EasyTyper from 'easy-typer-js'
// 实例化
const typed = new EasyTyper(obj, input, fn, hooks)
```

- 方法2: 常规导入

```
// 下载至本地
<script src="./easy-typer-js.js"></script>

//cdn导入
<script src="https://cdn.jsdelivr.net/npm/easy-typer-js@1.0.0/index.min.js"></script>
```
## 2.完整实战使用一言Api进行打字机循环输出效果

### 2.1 在MVVM类框架中使用（Vue）

```html
<template>	
  <div>
    {{ this.obj.output }}
    <span class="easy-typed-cursor">|</span>
  </div>
</template>
<script>
export default {
  name: 'home',
  data() {
    return {
      obj: {
        output: '',
        isEnd: false,
        speed: 80,
        singleBack: 1,
        sleep: 6000,
        type: 'rollback',
        backSpeed: 40
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.fetchData()
    },
    fetchData() {
      fetch('https://v1.hitokoto.cn')
        .then(res => {
            return res.json()
        })
        .then(({ hitokoto }) => {
            this.initTyped(hitokoto)
        .catch(err => {
            console.error(err)
        })
    },
    initTyped(input, fn, hooks) {
      const obj = this.obj
      const typed = new EasyTyper(obj, input, fn, hooks)
    }
  }
}
</script>
<style lang="stylus">
  .typed-cursor
    margin-left: 10px
    opacity: 1
    -webkit-animation: blink 0.7s infinite
    -moz-animation: blink 0.7s infinite
    animation: blink 0.7s infinite
  @keyframes blink
    0%
      opacity: 1
    50%
      opacity: 0
    100%
      opacity: 1
  
  @-webkit-keyframes blink
    0%
      opacity: 1
    50%
      opacity: 0
    100%
      opacity: 1
  
  @-moz-keyframes blink
    0%
      opacity: 1
    50%
      opacity: 0
    100%
      opacity: 1
</style>
```
### 2.2原生实例

```html
<script src="../lib/esayTyped.test.js"></script>
<style>
  .easy-typed-cursor {
    margin-left: 10px;
    opacity: 1;
    -webkit-animation: blink 0.7s infinite;
    -moz-animation: blink 0.7s infinite;
    animation: blink 0.7s infinite;
  }
  @keyframes blink {
    0% {opacity: 1;}
    50% {opacity: 0;}
    100% {opacity: 1;}
  }
  @-webkit-keyframes blink {
    0% {opacity: 1;}
    50% { opacity: 0;}
    100% {opacity: 1;}
  }
  @-moz-keyframes blink {
    0% {opacity: 1;}
    50% {opacity: 0;}
    100% {opacity: 1;}
  }
</style>
<div id="output">

</div>
<script>
  const obj = {
    output: '', // 输出内容  使用MVVM框架时可以直接使用
    type: 'normal',
    isEnd: false,
    speed: 80,
    backSpeed: 40,
    sleep: 3000,
    singleBack: true
  }
  const typing = new easy-typer-js(obj, `黎明前的黑暗是最深不见底的黑暗！`, (instance)=>{
    // 回调函数 如果这里使用了递归调用会一直循环打印，需要在外部触发停止
    // 此回调用于获取新的数据然后重新输出
    instance.input = `天不生我彭小呆，万古长青一生狂！`
    instance.play()
  }, (output, instance)=>{
    // 钩子函数，每一帧的数据获取和实例easy-typer-js的获取
    document.getElementById('output').innerHTML = `${output}<span class="easy-typed-cursor">|</span>`
  })
  // 12秒后停止
  let timer = setTimeout(() => {
    clearTimeout(timer)
    timer = null
    typing.close()
    alert('stop!')
  }, 12000)
</script>
```
> 效果如下
![](http://img.pqs.guozhaoxi.top/Amaranthe%20-%20Digital%20World_2.gif)
加载慢的同学可以看 http://img.pqs.guozhaoxi.top/20191221175917.MP4

## 三、参数解析 ( Parameter configuration )

### 3.1 new EasyTyper(obj, input, fn, hooks)

|参数|	说明	|回调 | 是否必须|
|---|-------|-----|------|
|`obj`|	配置对象 |	无 | 必须一定有且格式要对，十分严格，比起教导主任毫不逊色|
|`input`|	内容输入 |	无 | 可以没有，会有小彩蛋|
|`fn`|	完成一次output输出后的回调函数 |	当前easy-typer-js实例instance | 否 |
|`hooks`|	钩子 钩在每一帧将要完成的时间片段上 | 当前帧输出的内容、当前easy-typer-js实例instance | 否 |

> 使用方法如下（仅供参考）
```js
  const obj = {
    output: '', // 输出内容  使用MVVM框架时可以直接使用
    type: 'normal',
    isEnd: false,
    speed: 80,
    backSpeed: 40,
    sleep: 3000,
    singleBack: true
  }
  const typing = new easy-typer-js(obj, `黎明前的黑暗是最深不见底的黑暗！`, (instance)=>{
    // 回调函数 如果这里使用了递归调用会一直循环打印，需要在外部触发停止
    // 此回调用于获取新的数据然后重新输出
    instance.input = `天不生我彭小呆，万古长青一生狂！`
    instance.play()
  }, (output, instance)=>{
    // 钩子函数，每一帧的数据获取和实例easy-typer-js的获取
    document.getElementById('output').innerHTML = `${output}<span class="easy-typed-cursor">|</span>`
  })
  // 12秒后停止
  let timer = setTimeout(() => {
    clearTimeout(timer)
    timer = null
    typing.close()
    alert('stop!')
  }, 12000)
```
### 3.2 obj配置

| 参数(params)          | 含义(meaning)                                    | 默认值(default)  |
| --------------------- | ----------------------------------------------- | ---------------- |
| `output`              | 输出内容,使用MVVM框架时直接使用 {{ obj.output }}   |      NA          |
| `type`                | 下一次的行为 'roolback', 'normal', 'custom'       |      NA          |
| `isEnd`               | 全局控制是否终止                                  |      NA         |
| `speed`               | 打字速度                                         |      NA          |
| `backSpeed`           | 回滚速度                                          |      NA          |
| `sleep`               | 完整输出完一句话后，睡眠时间一定时间后回滚           |       NA         |
| `singleBack`          | 单次的回滚（优先级高于type）                       |      NA         |

### 3.3 暴露出可直接调用方法

|方法名|	说明	|参数 |
|---|-------|-----|
|`close`|	停止打字 |	无 |
|`sleep`|	单独可以调用睡眠线程，可以使用在任何地方 | ms(毫秒) |


## 四、更多请查阅
- easy-typer-js官网: http://inner.ink
- Github文档地址: https://github.com/pengqiangsheng/easy-typer-js.js
- CDN地址: https://cdn.jsdelivr.net/npm/easy-typer-js@1.0.0/index.min.js