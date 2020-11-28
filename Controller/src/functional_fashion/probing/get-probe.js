export default function makeGetdProbe({probesDb}){
    return async function getProbe({Id}){
        if(!Id){
            throw new Error('You must supply a probe ID')
        }
        const probe = await probesDb.findById({Id : Id})
        return probe
    }
}