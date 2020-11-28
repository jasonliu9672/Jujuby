module.exports = function makeProbesDb({ makeDb }) {
  return Object.freeze({
    getAllCollections,
    findAllFromCollection,
    findUnqiueIpFromCollection,
    getStats,
    findByDateFromCollection
  })
  async function getAllCollections() {
    const db = await makeDb()
    const result = await db.listCollections().toArray()
    const collectionList = result.map((collection) => collection.name)
    if (collectionList.length === 0) {
      return null
    }
    return collectionList
  }
  async function findAllFromCollection(collectionName) {
    const db = await makeDb()
    const result = db.collection(collectionName).find()
    const transactions = await result.toArray()
    if (transactions.length === 0) {
      return null
    }
    return transactions
  }

  async function findByDateFromCollection(collectionName, start, end) {
    const db = await makeDb()
    const result = db.collection(collectionName).find(
      {
        $expr: {
          $and: [
            { $gte: [{ $dateFromString: { dateString: '$start' } }, { $toDate: start }] },
            { $lt: [{ $dateFromString: { dateString: '$end' } }, { $toDate: end }] }
          ]
        }
      }
    )
    const transactions = await result.toArray()
    if (transactions.length === 0) {
      return null
    }
    return transactions
  }
  async function findUnqiueIpFromCollection(collectionName) {
    const db = await makeDb()
    const result = db.collection(collectionName).find()
    const transactions = await result.toArray()
    if (transactions.length === 0) {
      return null
    }
    const uniqueIps = transactions.map((transaction) => transaction.serverPool).flat().filter((x, i, a) => a.indexOf(x) === i)
    return uniqueIps
  }
  async function getStats() {
    const db = await makeDb()
    const result = await db.listCollections().toArray()
    const collectionList = result.map((collection) => collection.name)
    if (collectionList.length === 0) {
      return null
    }
    const countList = await Promise.all(collectionList.map(collectionName => db.collection(collectionName).countDocuments()))
    return [result, countList.reduce((acc, cur) => acc + cur)]
  }
}
