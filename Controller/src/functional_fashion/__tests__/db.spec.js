import {MongoClient} from 'mongodb'

describe('insert', () => {
    let connection;
    let db;
   
    beforeAll(async () => {
      console.log(global.__MONGO_URI__,global.__MONGO_DB_NAME__)
      connection = await MongoClient.connect(global.__MONGO_URI__, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      db = await connection.db(global.__MONGO_DB_NAME__);
    });
   
    afterAll(async () => {
      await connection.close();
      await db.close();
    });
    it('should insert a probe into collection', async () => {
        const probes = db.collection('probes');
       
        const mockProbe = {_id: '343', createdOn: '33'};
        await probes.insertOne(mockProbe);
       
        const inserteProbe = await probes.findOne({_id: '343'});
        console.log(inserteProbe)
        expect(inserteProbe).toEqual(mockProbe);
      });
  });