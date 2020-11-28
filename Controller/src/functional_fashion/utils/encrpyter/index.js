import bcrypt from 'bcrypt'
const Encrypter = Object.freeze({
    hash: bcrypt.hashsync,
    compare: bcrypt.compare,
})
export default Encrypter