const express = require('express')
// const middlewares = require('./middlewares')
const router = express.Router()
const { transactionDb } = require('../database/mongo')
router.get('/collection/list', (req, res) => {
  // if (!req.body.start || !req.body.language) {
  //   console.log('failed')
  //   throw new Error('Either country or language must not be null')
  // }
  transactionDb.getAllCollections().then((collections) => {
    return res.json({
      success: true,
      collections: collections
    })
  }
  ).catch(
    (error) => {
      console.log(error)
      return res.json({
        success: false,
        message: error
      })
    }
  )
})

router.get('/collection/:name', (req, res) => {
  const collectionName = req.params.name
  transactionDb.findAllFromCollection(collectionName).then((transactions) => {
    return res.json({
      success: true,
      transactions: transactions
    })
  }
  ).catch(
    (error) => {
      return res.json({
        success: false,
        message: error
      })
    }
  )
})

router.get('/collection/:name/uniqueip', (req, res) => {
  const collectionName = req.params.name
  transactionDb.findUnqiueIpFromCollection(collectionName).then((ips) => {
    return res.json({
      success: true,
      ips: ips
    })
  }
  ).catch(
    (error) => {
      return res.json({
        success: false,
        message: error
      })
    }
  )
})

router.get('/stats', (req, res) => {
  transactionDb.getStats().then((stats) => {
    return res.json({
      success: true,
      countryList: stats[0],
      totalCount: stats[1]
    })
  }
  ).catch(
    (error) => {
      return res.json({
        success: false,
        message: error
      })
    }
  )
})

module.exports = router
