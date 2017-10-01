const { search, getZoneCoordinator } = require('./server/sonos-devices');
const { albumcolor } = require('./server/sonos-nowplaying');

const activeZone = 'Living Room';

search()
  .then(devices => getZoneCoordinator(activeZone, devices))
  .then(coordinator => albumcolor(coordinator))

  .catch(err => console.error(err));