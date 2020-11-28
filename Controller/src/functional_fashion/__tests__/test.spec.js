import createProbe from '../entities/probe/index.js'
import {probeDb} from '../data-access/index.js'
import axios from 'axios'
jest.mock('axios');

describe('RUN A CRAWLER', () => {
    test('create fake probe entity', async () => {
        axios.get.mockResolvedValue({
            data: [
            {
                country: 'Australia'
            },
            ]
        });
        const data = await createProbe({country:'Australia',language:['japan']});
        console.log(data.getId())
        expect(data.getCountry()).toBe('Australia');
    });
})

// describe('Test Probe Database Funtionalities', () => {
//     let probeDb
//     beforeEach(async () => {
//         commentsDb = makeCommentsDb({ makeDb })
//     })
//     test('Register a probe', async () => {
//         const data = await probeDb.register({country:'Australia',language:['japan']});
//         expect(data.getCountry()).toBe('Australia');
//     });
// })
