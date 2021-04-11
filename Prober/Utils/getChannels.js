const API = require('../Api.js')
const fs = require("fs");

const getChannels = async (language = 'zh') => {
  const records = []
  /**
   * Cursor for forward pagination.
   * Tells the server where to start fetching the next set of results, in a multi-page response.
   * The cursor value specified here is from the pagination response field of a prior query.
   */
  let cursor = ''
  while (true) {
    const response = await API.twitchAPI('/helix/streams', { language: language, first: 100, after: cursor })
    const liveChannels = response.data.data
    if (liveChannels.length === 0) { break }
    console.log(response.data.data[0].user_login)
    liveChannels.map(data => { records.push(data.user_login) })
    cursor = response.data.pagination.cursor
    console.log(records.length)
  }
  return records
}

module.exports = { getChannels }
if (require.main === module) {
  getChannels(language = "zh").then(res => console.log(res))
}
