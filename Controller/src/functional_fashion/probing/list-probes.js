export default function makeListdProbes({probesDb}){
    return async function listProbes(){
        // const probeList = await Docker.listProbes()
        const probeList = await probesDb.findAllActiveProbes()
        return probeList
    }
}