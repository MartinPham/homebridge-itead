const mdns = require('multicast-dns');
const SlampherR2 = require('./types/SlampherR2');


module.exports = (homebridge) => {
    homebridge.registerPlatform('homebridge-itead', 'iTead', ITeadPlatform)
}

class ITeadPlatform {
    logger = null
    config = {}
    api = null
    mdns = null
    platformAccessories = {}

    constructor(logger, config, api) {
        this.logger = logger
        this.config = config
        this.api = api
        this.mdns = mdns()
        this.platformAccessories = {}

        this.mdns.on('response', response => {
            if(response && response.answers)
            {
                for(let answer of response.answers)
                {
                    if(answer.name.indexOf('_ewelink') > -1)
                    {
                        this.logger("FOUND", answer)
                        if(answer.type == 'SRV')
                        {
                            const srv = answer.data

                            const target = srv.target.split(/_|\./)

                            if(target[1])
                            {
                                const id = target[1]

                                this.logger("FOUND SRV DATA", id, srv)
                                
                                if(this.platformAccessories[id] && this.platformAccessories[id].handleData)
                                {
                                    this.platformAccessories[id].handleData('SRV', srv)
                                }
                            }

                           
                        } else if(answer.type == 'TXT')
                        {
                            const data = answer.data

                            if(typeof data !== 'string')
                            {
                                const txt = {}
    
                                for(let item of data)
                                {
                                  const record = item + ''
                                  const seperator = record.indexOf('=')
                                  const name = record.substr(0, seperator)
                                  const value = record.substr(seperator + 1, record.length - seperator)
                      
                                  txt[name] = value
                                }
                      
                                this.logger("FOUND TXT DATA", txt.id, txt.type, txt.iv, txt.data1)
                                
                                if(this.platformAccessories[txt.id] && this.platformAccessories[txt.id].handleData)
                                {
                                    this.platformAccessories[txt.id].handleData('TXT', txt)
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    accessories = (callback) => {
        this.platformAccessories = {}

        for(let device of this.config.devices) {
            if(device.type === 'SlampherR2')
            {
                this.logger('Registering SlampherR2 ' + device.id)
                this.platformAccessories[device.id] = new SlampherR2(this, device)
            }
        }


        callback(Object.values(this.platformAccessories))
    }
}


