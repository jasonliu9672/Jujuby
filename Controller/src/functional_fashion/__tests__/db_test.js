// import crawlingService from '../use-cases/crawling/index.js'
// import Docker from '../utils/docker/index.js'
// import {crawlerDb} from '../data-access/index.js'
// crawlingService.addCrawler({country:'Australia',language:['japan']}).then(
//  (result) => console.log(result)
// )
// // const result = await Docker.run('erer','erer','erer')
// // crawlerDb.register({country:'Australia',language:['japan']}).then(
// //      (result) => console.log(result))
// var test = "vpn-R0nO4pdOQ vpn-R0nO4pdOQ vp2365"
// console.log(test.match(/^vpn-\w{9}/g))
// Docker.listProbes().then( r => console.log(r))
// console.log(!['ru','zh','sv','pl','el','ko','jp','en'].includes('zh'))
// Docker.runProbe('3uq3d7U_Zg','Japan','zh').then( r => console.log(r))
// Docker.deleteProbe('3uq3d7U_Zg')
import axios from 'axios'
const result = await axios.post(`http://probe-_8xbgfWtd:3000/api/pool/stop`)
// const result = await axios.get(`https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html`)
console.log(result)
// import fetch from 'node-fetch'
// fetch('probe-_8xbgfWtd:3000/api/pool/stop', {
//         method: 'post',
//         headers: { 'Content-Type': 'application/json' },
//     })
//     .then(res => res.json())
//     .then(json => console.log(json));