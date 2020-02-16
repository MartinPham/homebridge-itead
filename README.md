Control ITead devices via LAN mode. Tested with Sonoff Splampher R2 (firmware 3.3)

Getting Device ID & API key
===

- Reset device by holding reset button for 5-10 secs
- Connect to device's AP wifi (ITEAD-xxxx), password is `12345678`
- Open [http://10.10.7.1/device](http://10.10.7.1/device), you will see the JSON with apikey and deviceid. Write it down.
- Use `wget` to send local WiFi settings to device 
```
wget -O- --post-data='{"version":4,"ssid":"your wifi name","password":"your wifi password"}' --header=Content-Type:application/json "http://10.10.7.1/ap"
```
- **or** just use `ewelink` to setup the device's wifi (using Compatibility mode)

Install
===
```
npm i -g homebridge-itead
```

Config
===
```
{
	"platforms": [
		{
			"platform": "iTead",
			"devices": [
				{
					"type": "SlampherR2",
					"id": "Device ID",
					"apiKey": "Device API key",
					"name": "Slampher 1"
				}
			]
		}	
	]
}
```

