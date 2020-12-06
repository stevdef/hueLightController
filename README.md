# Philips Hue Lights Controller
Control Philips Hue lights with JavaScript 
Hue Bridge device needed
To obtain a username for the Hue bridge, send a request to the Bridge API, f.ex:
```
curl -d '{"devicetype":"[admin]"}' -H "Content-Type: application/json" -X POST 'http://brdige-ip-address/api'
```

## Main functions
lightsStatus() 
  --> for each light, display the state, brightness, color

setLightsOnOrOff
  --> Lights on of Lights Off

setBri()
  --> set Brightness

setColor()
  --> set light color

## ToDo
Code cleaning


