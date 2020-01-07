import EasyTyper from '../ts/index'

const obj = {
  output: '',
  type: 'rollback',
  isEnd: false,
  speed: 80,
  backSpeed: 40,
  sleep: 3000,
  singleBack: true,
  sentencePause: true
}

let result = ''

const typed = () => {
  new EasyTyper(obj, `黎明前的黑暗是最深不见底的黑暗！`, ()=>{
    console.log('result', result)
  }, (output, instance) => {
    result = `${output}`
  })
}

jest.useFakeTimers();

test('是否能完整输出一句话', () => {
  typed();
  jest.runAllTimers();
  expect(result).toBe('黎明前的黑暗是最深不见底的黑暗！')
});