import createProbe from '../../entities/probe/index.js'
export default function makeAddProbe({probesDb, Docker, probeCommander}){
    const delay = (interval) => {
        return new Promise((resolve) => {
            setTimeout(resolve, interval);
        });
    };
    return async function addProbe(probeInfo){
        console.log(probeInfo)
        const probe = await createProbe(probeInfo)
        const exists = await probesDb.findById({Id : probe.getId()})
        if (exists){
            return exists
        }
        if(await Docker.runProbe(probe.getName(),probe.getCountry(),probe.getLanguage())){
            await delay(15000)
            if(await probeCommander.start(probe.getName()))
            {
                return probesDb.register({
                    id: probe.getId(),
                    name: probe.getName(),
                    isActive: probe.getIsActive(),
                    createdOn : probe.getCreatedOn(),
                    language : probe.getLanguage(),
                    country: probe.getCountry()
                })
            }
        }
        return null
    }
}