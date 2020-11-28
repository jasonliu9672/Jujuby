// const axios = require('axios');
import axios from 'axios'

export const isValidCountry = async (country) => {
    const response = await axios.get('https://api.nordvpn.com/server')
    return response['data']
        .map((server)=>server['country'])
        .filter((x, i, a) => a.indexOf(x) == i)
        .includes(country)

} 

export const isValidServer = async (server) => {
    const response = await axios.get('https://api.nordvpn.com/server')
    return response['data']
        .map((server) => server['domain'].split('.')[0])
        .includes(server)
}


