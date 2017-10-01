const Sonos = require('Sonos').Sonos
const download = require('image-downloader');
const ColorThief = require('color-thief');
const ct = new ColorThief();

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

exports.albumcolor = (device) => {
  return nowplaying(device)
    .then(track => {
      // console.log(track);
      const { albumArtURL } = track;
      const dest = `/tmp/albumart-${Date.now()}.jpg`;
      return download.image({ url: albumArtURL, dest });
    })
    .then(({ filename, image }) => {
      const color = ct.getColor(image);
      // console.log(color);
      return color;
    })
}

exports.nowplaying = nowplaying