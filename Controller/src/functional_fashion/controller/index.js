import {addProbe,deleteProbe,listProbes} from '../use-cases/probing/index.js'
import makeCloseProbe from './close-probe.js'
import makeInitiateProbe from './initiate-probe.js'
import makeListActiveProbe from './list-active-probes.js'

const initiateProbe = makeInitiateProbe({addProbe})
const closeProbe = makeCloseProbe({deleteProbe})
const listActiveProbes = makeListActiveProbe({listProbes})

const probeController = Object.freeze({
    initiateProbe,
    closeProbe,
    listActiveProbes
})

export default probeController
export {initiateProbe,closeProbe,listActiveProbes}