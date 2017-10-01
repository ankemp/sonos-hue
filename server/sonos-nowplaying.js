const Sonos = require('Sonos').Sonos

function nowplaying({ ip, port }) {
  return new Promise((Resolve, Reject) => {
    const interface = new Sonos(ip, port);

    interface.currentTrack((err, track) => {
      if (!err) {
        // console.log(track);
        Resolve(track);
      } else {
        // console.error(err);
        Reject(err);
      }
    });
  });
}

exports.nowplaying = nowplaying