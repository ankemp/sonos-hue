const _ = require('lodash');
const { search, getZoneCoordinator } = require('./server/sonos-devices');
const { nowplaying, albumcolor } = require('./server/sonos-nowplaying');
const { setColor } = require('./server/hue-devices')

const activeZone = 'Living Room';
const activeLight = 'Living Room Accent';
let activeCoordinator, currentTrack;

search()
  .then(devices => getZoneCoordinator(activeZone, devices))
  .then(coordinator => {
    activeCoordinator = coordinator;
    return Promise.resolve();
  })
  .then(() => {
    watchMusic();

    setInterval(() => {
      watchMusic();
    }, 5000);
  })

  .catch(err => console.error(err));

function watchMusic() {
  nowplaying(activeCoordinator)
    .then(track => {
      if (_.isUndefined(currentTrack) || currentTrack.title !== track.title) {
        currentTrack = track;
        // const timeLeft = track.duration - track.position;
        // setTimeout(() => {
        //   watchMusic();
        // }, timeLeft * 1000);
        return albumcolor(track);
      }
      return Promise.resolve(false);
    })
    .then(color => {
      if (color) {
        setColor(activeLight, color)
      }
    })

    .catch(err => console.error(err));
}