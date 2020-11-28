import Id from '../utils/unique-id/index.js'
export default function makeProbesDb ({ makeDb }) {
    return Object.freeze({
      register,
      findById,
      updateIsActiveInfo,
      findAllActiveProbes
    })
    async function register ({ id: _id = Id.makeID(), ...probeInfo}) {
      const db = await makeDb()
      const result = await db
        .collection('probes')
        .insertOne({ _id, ...probeInfo})
      const { _id: id, ...insertedInfo } = result.ops[0]
      return { id, ...insertedInfo }
    }
  
    async function findById ({ id: _id }) {
      const db = await makeDb()
      const result = await db.collection('probes').find({ _id })
      const found = await result.toArray()
      if (found.length === 0) {
        return null
      }
      const { _id: id, ...info } = found[0]
      return { id, ...info }
    }
    async function updateIsActiveInfo({id: _id}){
      const db = await makeDb()
      const result = await db
        .collection('probes')
        .updateOne({ _id }, { $set: { "isActive": false} })
      return result.modifiedCount > 0 ? { id: _id } : null
    }

    async function findAllActiveProbes(){
      const db = await makeDb()
      const result = db.collection('probes').find({"isActive":true})
      const activeProbes = await result.toArray()
      if (activeProbes.length === 0) {
        return null
      }
      activeProbes.map((probe) => {
        probe['id'] = probe['_id']; // Assign new key 
        delete probe['_id']; // Delete old key 
        return probe; 
      })
      return activeProbes
    }
}
