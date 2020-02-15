const crypto = require('crypto')



const encode = (apiKey, data) => {
    let iv = crypto.randomBytes(16)
	iv = iv.slice(0, 16)

	data = JSON.stringify(data)

	apiKey = Buffer.from(apiKey, 'utf8')
	data = Buffer.from(data, 'utf8')


	const hash = crypto.createHash('md5')
	hash.update(apiKey)
	const key = hash.digest()

	const cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
	const encrypted = cipher.update(data, 'utf8', 'binary') + cipher.final('binary')

    const encoded = Buffer.from(encrypted, 'binary').toString('base64')
    
    return {
        data: encoded,
        iv: iv.toString('base64')
    }
}

const decode = (apiKey, {data, iv}) => {
	apiKey = Buffer.from(apiKey, 'utf8')

	const hash = crypto.createHash('md5')
	hash.update(apiKey)
	const key = hash.digest()

	iv = Buffer.from(iv, 'base64')
	data = Buffer.from(data, 'base64')


	const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)

	const decrypted = decipher.update(data, 'binary') + decipher.final('binary');   
	data = Buffer.from(decrypted, 'binary').toString('utf8')


	return JSON.parse(data)
}


module.exports = {encode, decode}