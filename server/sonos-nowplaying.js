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

exports.albumcolor = (track) => {
  return new Promise((Resolve, Reject) => {
    console.log(`${track.title} - ${track.artist}`);
    const { albumArtURL } = track;
    const dest = `/tmp/albumart-${Date.now()}.jpg`;
    download.image({ url: albumArtURL, dest })
      .then(({ filename, image }) => {
        const color = ct.getColor(image);
        console.log(`Album color: ${color}`);
        Resolve(color);
      })
  })
}

exports.nowplaying = nowplaying;