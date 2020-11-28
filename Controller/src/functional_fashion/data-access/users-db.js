import Id from '../utils/unique-id/index.js'
import Encrypter from '../utils/encrpyter/index.js'
export default function makeUsersDb ({ makeDb }) {
    return Object.freeze({
      register,
      remove,
      update
    })
    async function register ({ id: _id = Id.makeID(), username: username, password: password}) {
      const hashedpwd = await Encrypter.hash(password)
      const db = await makeDb()
      const result = await db
        .collection('users')
        .insertOne({ _id, username, hashedpwd})
      const { _id: id, ...insertedInfo } = result.ops[0]
      return { id, ...insertedInfo }
    }
  
    async function update ({id : _id, username: username, password: password}) {
      const hashedpwd = await Encrypter.hash(password)
      const db = await makeDb()
      const result = await db
        .collection('users')
        .updateOne({ _id }, { $set: { username: username, password: password } })
      return result.modifiedCount > 0 ? { id: _id, ...userInfo } : null
    }
    async function remove ({ id: _id }) {
      const db = await makeDb()
      const result = await db.collection('users').deleteOne({ _id })
      return result.deletedCount
    }
}
