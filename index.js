const { search, getZoneCoordinator } = require('./server/sonos-devices');

const activeZone = 'Living Room';

search()
  .then(devices => getZoneCoordinator(activeZone, devices))

  .catch(err => console.error(err));