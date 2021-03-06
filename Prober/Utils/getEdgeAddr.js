const { URL } = require('url') // (native) provides utilities for URL resolution and parsing
const API = require('../Api.js')
const { lookupStreamCache } = require('../Cache/StreamInfoCache.js')
const { lookupDNSCache } = require('../Cache/DNSCache.js')
const m3u8Parser = require('m3u8-parser')

function getAccessToken (channel) {
  return lookupStreamCache(channel).then(response => response.accessToken)
}

function getMasterPlaylist (token, channel) {
  const params = {
    player: 'twitchweb',
    token: token.token,
    sig: token.sig,
    allow_audio_only: true,
    allow_source: true,
    p: Math.floor(Math.random() * 99999) + 1
  }
  return API.usherAPI(`/api/channel/hls/${channel}.m3u8`, params)
    .then(response => response.data)
}

// get Media Playlist that contains URLs of the files needed for streaming
function parseMasterPlaylist (playlist) {
  const parsedPlaylist = []
  const lines = playlist.split('\n')
  for (let i = 4; i < lines.length - 1; i += 3) {
    parsedPlaylist.push({
      quality: lines[i - 2].split('NAME="')[1].split('"')[0],
      resolution: (lines[i - 1].indexOf('RESOLUTION') !== -1 ? lines[i - 1].split('RESOLUTION=')[1].split(',')[0] : null),
      uri: lines[i]
    })
  }

  return parsedPlaylist
}

function getBestQualityPlaylistUri (playlists) {
  return playlists[0].uri
}

function getPlaylistContent (uri) {
  return API.axiosLookupBeforeGet(uri)
    .then(response => response.data)
}

function getEdgeUrl (raw) {
  const parser = new m3u8Parser.Parser()
  parser.push(raw)
  parser.end()
  // return the uri of the last .ts file
  return parser.manifest.segments.slice(-1).pop().uri
}

function getEdgeAddr (channel) {
  return getAccessToken(channel)
    .then(token => getMasterPlaylist(token, channel))
    .then(masterPlaylist => parseMasterPlaylist(masterPlaylist))
    .then(playlists => getBestQualityPlaylistUri(playlists))
    .then(uri => getPlaylistContent(uri))
    .then(rawContent => {
      const urlObj = new URL(getEdgeUrl(rawContent))
      return urlObj.hostname
    })
    .then(hostname => lookupDNSCache(hostname))
    .catch(error => { throw error })
}

module.exports = { getEdgeAddr }

if (require.main === module) {
  const sleep = async (ms) => {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }
  const channel = 'never_loses'
  const test = async (channel) => {
    getEdgeAddr(channel).then(addr => console.log(addr))
    await sleep(1000)
    getEdgeAddr(channel).then(addr => console.log(addr))
  }

  test(channel)
}
