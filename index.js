const { search, getZoneCoordinator } = require('./server/sonos-devices');
const { albumcolor } = require('./server/sonos-nowplaying');
const { setColor } = require('./server/hue-devices')

const activeZone = 'Living Room';
const activeLight = 'Living Room Accent';

search()
  .then(devices => getZoneCoordinator(activeZone, devices))
  .then(coordinator => albumcolor(coordinator))
  .then(color => setColor(activeLight, color))

  .catch(err => console.error(err));