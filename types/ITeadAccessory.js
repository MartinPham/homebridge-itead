const {encode, decode} = require('../crypto');
const fetch = require('node-fetch');

class ITeadAccessory {
    name = ''
    hostname = ''
    ip = ''
    options = {}
    platform = null

    constructor(platform, options = {}) {
        this.platform = platform
        this.options = options
        this.name = this.options.name
    }

    getServices = () => {
        return []
    }

    handleData = (type, data) => {
    }

    _request = async (payload) => {
        const body = {
            sequence: (new Date()).getTime() + '',
            deviceid: this.options.id,
            selfApikey: '123',
            encrypt: true
        }

        const {data, iv} = encode(this.options.apiKey, payload)

        body.data = data
        body.iv = iv

        return await (await fetch(`http://${this.hostname}:${this.port}/zeroconf/switch`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 
                'Content-Type': 'application/json' 
            },
        })).json()
    }

    _encode = (data) => {
        return encode(this.options.apiKey, data)
    }

    _decode = (data, iv) => {
        return decode(this.options.apiKey, {data, iv})
    }
} 



module.exports = ITeadAccessory