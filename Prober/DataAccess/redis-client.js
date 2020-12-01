const redis = require('redis');
const API = require('../Api.js')
const { Pen } = require('../Pen.js')
const { promisify } = require('util');
const client = redis.createClient('redis://172.28.0.3:6379');
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

function displayNameLookUp(userName) {
    return getAsync(userName).then((displayName) => {
        if (!!displayName) {
            return displayName
        }
        return API.twitchAPI('/helix/search/channels', { query: userName })
            .then(response => {
                console.log('fetch')
                const fetchedDisplayName = response.data.data[0].display_name
                Pen.write(`Finished adding display name for ${userName} to cache`, 'green')
                setAsync(userName, fetchedDisplayName)
                return fetchedDisplayName
            })
    }).catch(e => console.log(e))
}
module.exports = {
    displayNameLookUp
};

if (require.main === module) {
    Promise.all([displayNameLookUp('波波尼'), displayNameLookUp('殺梗')]).then(res => console.log(res))
}