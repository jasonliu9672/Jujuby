export default function buildCreateProbe({Id,isValidCountry}){
    return async function createProbe ({
        id = Id.makeID(),
        createdOn = new Date().toString(),
        isActive = true,
        country,
        language,
    } = {}){

        if(!Id.isValid(id)){
            throw new Error('Probe must have a valid id')
        }
        console.log(country,language)
        if(!['ru','zh','sv','pl','el','ko','jp','en','es','fr'].includes(language)){
            throw new Error('Must provide a valid language')
        }
        if(!await isValidCountry(country)){
            throw new Error('This country is not a valid option')
        }
        return Object.freeze({
            getId: () => id,
            getName: () => `probe-${id}`,
            getCreatedOn : () => createdOn,
            getLanguage : () => language,
            getCountry: () => country,
            getIsActive: () => isActive
        })
    }
}