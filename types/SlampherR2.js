const ITeadAccessory = require('./ITeadAccessory');



class SlampherR2 extends ITeadAccessory {
    service = null
    switch = false

    constructor(platform, options = {}) {
        super(platform, options)

        this.service = new platform.api.hap.Service.Lightbulb(this.options.name);

        this.service.getCharacteristic(platform.api.hap.Characteristic.On)
            .on('set', async (value, callback) => {
                this.platform.logger('set ', value)
                
                this.switch = value

                await this._request({
                    switch: value ? 'on' : 'off'
                })

                callback()
            })
            .on('get', (callback) => {
                this.platform.logger('get ', this.switch)

                
                
                callback(null, this.switch)
            })
    }

    getServices = () => {
        return [this.service]
    }

    
    handleData = (type, data) => {
        if(type === 'SRV')
        {
            this.platform.logger('SRV ', data)
            this.hostname = data.target
            this.port = data.port
        }else if(type === 'TXT')
        {
            const payload = this._decode(data.data1, data.iv)

            this.platform.logger('TXT ', payload)

            this.switch = payload.switch === "on"
            this.service.updateCharacteristic(Characteristic.On, payload.switch === "on")
        }
    }
}

module.exports = SlampherR2