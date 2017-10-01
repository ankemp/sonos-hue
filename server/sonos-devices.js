const _ = require('lodash');
const Sonos = require('sonos');

const TIMEOUT = 2000; // Search for 2 seconds, increase this value if not all devices are shown
const devices = [];

// Functions to process device information

function getBridges(deviceList) {
  return deviceList.reduce((bridges, device) => {
    const devicePath = `${device.ip}:${device.port}`;
    if (device.CurrentZoneName === 'BRIDGE' && bridges.includes(devicePath)) {
      bridges.push(devicePath);
    }
    return bridges;
  }, []);
}

function getBridgeDevices(deviceList) {
  return deviceList.reduce((bridgeDevices, device) => {
    if (device.CurrentZoneName === 'BRIDGE') {
      bridgeDevices.push(device);
    }
    return bridgeDevices;
  }, []);
}

function getZones(deviceList) {
  return deviceList.reduce((zones, device) => {
    if (!zones.includes(device.CurrentZoneName) && device.CurrentZoneName !== 'BRIDGE') {
      zones.push(device.CurrentZoneName);
    }
    return zones;
  }, []);
}

function getZoneDevices(zone, deviceList) {
  return deviceList.reduce((zoneDevices, device) => {
    if (device.CurrentZoneName === zone) {
      zoneDevices.push(device);
    }
    return zoneDevices;
  }, []);
}

function getZoneCoordinator(zone, deviceList) {
  return deviceList.find(device => {
    return (device.CurrentZoneName === zone && device.coordinator === 'true');
  });
}

exports.getZoneCoordinator = getZoneCoordinator;
exports.search = () => {
  return new Promise(Resolve => {
    Sonos.search({ timeout: TIMEOUT }, (device, model) => {
      const data = { ip: device.host, port: device.port, model: model }

      device.getZoneAttrs((err, attrs) => {
        if (!err) {
          _.extend(data, attrs);
        }
        device.getZoneInfo((err, info) => {
          if (!err) {
            _.extend(data, info);
          }
          device.getTopology((err, info) => {
            if (!err) {
              info.zones.forEach(group => {
                if (group.location === `http://${data.ip}:${data.port}/xml/device_description.xml`) {
                  _.extend(data, group);
                }
              })
            }
            devices.push(data);
          });
        });
      });
    });

    setTimeout(() => {
      //   console.log(getZones(devices));
      //   console.log(getZoneCoordinator('Living Room', devices));
      //   console.log(getZoneDevices('Living Room', devices));
      Resolve(devices);
    }, TIMEOUT);
  });
}