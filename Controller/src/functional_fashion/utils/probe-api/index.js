import axios from 'axios'
const probeCommander = Object.freeze({
    start: async (probeName) => {
        const result = await axios.post(`http://${probeName}:3000/api/pool/start`)
        console.log(`Called start API on ${probeName}`)
        return result.status
    },
    stop:
    async (probeName) => {
        const result = await axios.post(`http://${probeName}:3000/api/pool/stop`)
        console.log(`Called stop API on ${probeName}`)
        return result.status
    },
})
export default  probeCommander