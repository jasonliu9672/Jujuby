export default function makeDeleteProbe({probesDb, Docker, probeCommander}){
    const delay = (interval) => {
        return new Promise((resolve) => {
            setTimeout(resolve, interval);
        });
    };
    return async function deleteProbe(probeId){
        const probeName = `probe-${probeId}`
        if(await probeCommander.stop(probeName)){
            await delay(10000)
            if(await Docker.deleteProbe(probeName))
            {
                const update = await probesDb.updateIsActiveInfo({id:probeId})
                return update ? true : false
            }
        }
        return false
    }

}