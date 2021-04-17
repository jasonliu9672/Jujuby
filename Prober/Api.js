const axios = require('axios')
const http = require('http')
const https = require('https')
const { MongoTimeoutError } = require('mongodb')
const { URL } = require('url') // (native) provides utilities for URL resolution and parsing
const { lookupDNSCache } = require('./Cache/DNSCache.js')
const { addReqCount, getReqCount } = require('./RequestLogger.js')


const accessToken = 'kqk4tnkzso320k8q20zmmo9aadniai'
const clientIdForOldApi = 'kimne78kx3ncx6brgo4mv6wki5h1ko'
const clientIdForHelixApi = '2xrd133djme37utzs215bqmwwz6hve' // client id for getting the api token
const clientSecret = 'l5rahrb544myhzf6dopcc9cy5aq95t' // client secret obtained from app registration

/* Add axios interceptor to do address replacement before every request */
const axiosLookupBeforeRequest = axios.create({
  // 30 sec timeout
  timeout: 30 * 1000,

  //keepAlive pools and reuses TCP connections, so it's faster
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  
  //follow up to 10 HTTP 3xx redirects
  maxRedirects: 10,
  
  //cap the maximum content length we'll accept to 50MBs, just in case
  maxContentLength: 50 * 1000 * 1000
})

axiosLookupBeforeRequest.interceptors.request.use(async (config) => {
  addReqCount()

  const urlObj = new URL(config.url)
  const addr = await lookupDNSCache(urlObj.hostname)

  config.headers.Host = urlObj.hostname // need original host name for TLS certificate
  urlObj.host = addr
  config.url = urlObj.toString()

  return config
})

const buildOptions = (api, args) => {
  /**
   * Builds request arguments based on API type
   * Public APIs have different argument format than private ones
   */
  const options = {}
  const acceptType = 'application/vnd.twitchtv.v5+json'
  const urlObj = new URL(api)
  switch (urlObj.hostname) {
    case 'api.twitch.tv':
      if (urlObj.pathname.split('/').slice(-1)[0] === 'access_token') {
        // console.log('Using old api token')
        options.headers = { Accept: acceptType, 'Client-Id': clientIdForOldApi }
      } else {
        // console.log('Using helix token')
        options.headers = { 
          Accept: acceptType, 
          Authorization: `Bearer ${accessToken}`, 
          'Client-Id': clientIdForHelixApi 
        }
      }
      options.params = { ...{ as3: 't' }, ...args }
      break
    case 'id.twitch.tv':
      options.headers = { Authorization: `OAuth ${accessToken}` }
      break
    case 'gql.twitch.tv':
      options.headers = { 'Client-ID': clientIdForOldApi, 'User-Agent': 'Mozilla/4.0; (UserAgent/1.0)' }
    case 'usher.ttvnw.net':
    case 'tmi.twitch.tv':
      options.params = { ...{ client_id: clientIdForHelixApi }, ...args }
      break
  }

  return options
}

class API {
  static axiosLookupBeforeGet(api, args) { return axiosLookupBeforeRequest.get(api, args) }
  
  static authAPI(type, args) {
    const api = 'https://id.twitch.tv'
    if (type === 'request') { // request for api token
      return axiosLookupBeforeRequest.post(api + `/oauth2/token?client_id=${clientIdForHelixApi}&client_secret=${clientSecret}&grant_type=client_credentials`, buildOptions(api, args))
    } else if (type === 'validate') { // validate current token
      return axiosLookupBeforeRequest.get(api + '/oauth2/validate', buildOptions(api, args))
    }
  }

  static twitchAPI(path, args) {
    const api = `https://api.twitch.tv${path}`
    // return axiosLookupBeforeRequest.get(api, buildOptions(api, args))
    return axios.get(api, buildOptions(api, args))
  }

  static usherAPI(path, args) {
    const api = `https://usher.ttvnw.net${path}`
    // return axiosLookupBeforeRequest.get(api, buildOptions(api, args))
    return axios.get(api, buildOptions(api, args))
  }

  static hostingAPI(path, args) {
    const api = `https://tmi.twitch.tv${path}`
    return axiosLookupBeforeRequest.get(api, buildOptions(api, args))
  }

  static gqlAPI(path, data, args) {
    const api = `https://gql.twitch.tv${path}`
    return axiosLookupBeforeRequest.post(api, data, buildOptions(api, args))
  }

  static buildGqlString(channel) {
    const gqlData = {
      "operationName":"PlaybackAccessToken_Template",
      "query":"query PlaybackAccessToken_Template($login: String!, $isLive: Boolean!, $vodID: ID!, $isVod: Boolean!, $playerType: String!) {  streamPlaybackAccessToken(channelName: $login, params: {platform: \"web\", playerBackend: \"mediaplayer\", playerType: $playerType}) @include(if: $isLive) {    value    signature    __typename  }  videoPlaybackAccessToken(id: $vodID, params: {platform: \"web\", playerBackend: \"mediaplayer\", playerType: $playerType}) @include(if: $isVod) {    value    signature    __typename  }}",
      "variables":{
          "isLive":true,
          "login":channel,
          "isVod":false,
          "vodID":"",
          "playerType":"site"
      }
    }
    return JSON.stringify(gqlData)
  }

  static clearReportTimer() { clearInterval(reportRequestCountTimer) }

  static getRequestCount() { return getReqCount() }
}

/* For testing */
if (require.main === module) {
  const channel = 'lck'
  const sleep = async (ms) => {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  const test = async () => {
    await API.twitchAPI(`/api/channels/lck/access_token`)
      .then(response => console.log(response.data))
  }

  const testUsherToken = async () => {
    API.gqlAPI('/gql', API.buildGqlString('lck'))
      .then( (response) => {
        console.log(response.data.data.streamPlaybackAccessToken)
      }) 
  }
  

  function onError(e) {
    console.log(e)
    console.log(e.name)
    console.log(e.message)
    console.log((e instanceof TypeError))
    console.log('Dealing with timeout error....')
  } 
  function foo() {
    return axiosLookupBeforeRequest.get("http://254.243.6.76/")
  }
  function bar() {
    return foo()
      .then(r => r.data)
  }
  function baz() {
    bar()
      .then(r => r.data)
      .catch(e => onError(e))
  }

  async function inputTypeError(x) {
    if (typeof x === "string") {
      console.log('Valid input')
    } else {
      console.log(typeof x)
      throw TypeError('Wrong input type!') 
    }
  }

  function rtnPromise(x) {
    return new Promise(async (resolve, reject) => {
      await inputTypeError(x).catch(error => { reject(error) })
      resolve('Great guess!')
    })
  }

  function rtnPromise2(x) { return rtnPromise(x).then(x => x) } 

  function run(x) {
    rtnPromise2(x)
      .then(r => { console.log(r) })
      .catch(error => { console.log(`Uh-oh, encountered error: ${error.message}!!`)})
  }
  
  // run(123)
  // testUsherToken()
  // baz()
}

module.exports = API
