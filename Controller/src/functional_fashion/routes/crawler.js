import express from 'express'
const router = express.Router()
import {initiateProbe,closeProbe,listActiveProbes} from '../controller/index.js'
import makeCallback from '../utils/express/index.js'

router.post('/run',makeCallback(initiateProbe) )
router.delete('/close/:id',makeCallback(closeProbe))
router.get('/list',makeCallback(listActiveProbes))
export default router
