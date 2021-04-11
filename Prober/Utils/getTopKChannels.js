const { Worker } = require('worker_threads')
const Twitch = require('../Twitch.js')

function runService(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./Utils/service.js', { workerData })
    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', (code) => {
      if (code !== 0) { reject(new Error(`Worker stopped with exit code ${code}`)) }
    })
  })
}

const getTopKChannels = async (language = 'es', percentage = 0.8) => {
  const allChannels = await Twitch.getChannelsByLanguage(language)
  const topKChannels = await runService({ data: allChannels, percentage: percentage })
  console.log(`Returning ${topKChannels.length} out of ${allChannels.length} for ${language} channels`)
  return topKChannels
}

module.exports = { getTopKChannels }

if (require.main === module) {
  Twitch.getChannelsByLanguage('en').then(result => { console.log(result); console.log(result.length) })
}
