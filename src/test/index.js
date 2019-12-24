const EasyTyper = require('../lib/easy-typer-origin')
const obj = {
  output: '', // 输出内容  使用MVVM框架时可以直接使用
  type: 'normal',
  isEnd: 1,
  speed: 80,
  backSpeed: 40,
  sleep: 3000,
  singleBack: true
}
new EasyTyper(obj, '我是nodejs a ', () => {
  console.log('stop!')
}, (text) => {
  console.log(text)
})