const hue = require("node-hue-api");
const secrets = require('../config/secrets.json')
const HueApi = hue.HueApi;
const lightState = hue.lightState;

let api, state, lightList = [];

function registerServer(bridge) {
  const { id, ipaddress } = bridge.pop();
  api = new HueApi(ipaddress, secrets.hueUser);
  state = lightState.create();
  return Promise.resolve();
}

function findLights() {
  api.lights()
    .then(lights => {
      return lights.lights.filter(light => {
        return (light.type === 'Color light');
      });
    })
    .then(lights => {
      lightList = lights;
    });
}

function getLight(lightName) {
  return lightList.find(light => {
    return light.name === lightName;
  });
}

function setColor(lightName, rgbColor) {
  const light = getLight(lightName);
  return api.setLightState(light.id, state.rgb(...rgbColor))
}

hue.nupnpSearch()
  .then(registerServer)
  .then(findLights);

exports.setColor = setColor;
