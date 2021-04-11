const { updateLoggerCacheInfo } = require('../RequestLogger')

class BaseCache {
  constructor () {
    this.cache = {}
    this.childClass = null
    this.cacheHits = 0
    this.cacheMisses = 0
    this.totalLookups = 0 
  }

  lookup (entry) {
    return new Promise(async (resolve, reject) => {
      if (!this.cache[entry]) {
        console.log(`${this.childClass} cache miss: ${entry}`)
        await this.onMiss(entry)
        this.cacheMisses += 1
      } else { this.cacheHits += 1 }
      resolve(this.cache[entry])
      this.totalLookups += 1 
      updateLoggerCacheInfo(this.childClass, this.cacheInfo())
    })
  }

  async onMiss () {
    throw new Error('Function onMiss is not implemented')
  }

  cacheInfo() {
    return `${this.totalLookups},${this.cacheHits},${this.cacheMisses}` // total, hits, misses
  }
}

module.exports = BaseCache
