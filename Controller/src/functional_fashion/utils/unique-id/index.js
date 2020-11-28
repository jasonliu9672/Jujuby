import shortid from 'shortid'
const Id = Object.freeze({
    makeID: shortid.generate,
    isValid : shortid.isValid
})

export default Id