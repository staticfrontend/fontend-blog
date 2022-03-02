// 查看html内容是否在js下载执行前解析的
const app = document.querySelector('#app')
console.log('script标签设置defer，在html前面引入看是否能获取dom内容 =》', app.innerHTML) // script标签设置defer结果有输出内容


console.log('script标签在head里面引入，如果不设置defer则在html内容解析前执行js，获取页面html内容app.innerHTML则会报错')

console.log('script标签在head里面引入，设置defer则会在html内容解析后才会下载该js文件执行，app.innerHTML会获取到')

console.log('设置defer的js文件下载执行会在DOMContentLoaded之前')