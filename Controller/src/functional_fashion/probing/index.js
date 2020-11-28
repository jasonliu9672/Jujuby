import {probesDb} from '../../data-access/index.js'
import Docker from '../../utils/docker/index.js'
import probeCommander from '../../utils/probe-api/index.js'
import makeAddProbe from './add-probe.js'
import makeGetProbe from './get-probe.js'
import makeDeleteProbe from './delete-probe.js'
import makeListProbes from './list-probes.js'

const addProbe = makeAddProbe({probesDb, Docker, probeCommander})
const getProbe = makeGetProbe({probesDb})
const deleteProbe = makeDeleteProbe({probesDb, Docker, probeCommander})
const listProbes = makeListProbes({probesDb})

const crawlingService = Object.freeze({
    addProbe,
    getProbe,
    deleteProbe,
    listProbes
})
export default crawlingService
export {addProbe,getProbe,deleteProbe,listProbes}