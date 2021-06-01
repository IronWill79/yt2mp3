const fs = require('fs')
const sanitize = require('sanitize-filename')
const youtubedl = require('youtube-dl-exec')
const ffmpeg = require('ffmpeg');

(async () => {
  var dlJson = await youtubedl('https://youtube.com/watch?v=R7xqNu43K5w', {
    dumpSingleJson: true,
    preferFreeFormats: true,
    youtubeSkipDashManifest: true,
  })
  var formats = dlJson.requested_formats.filter(format => format.asr !== null)
  var videoFilename = sanitize(dlJson.title + '.' + formats[0].ext).replaceAll(' ', '_')
  var formatId = formats[0].format_id
  await youtubedl('https://youtube.com/watch?v=R7xqNu43K5w', {
    output: videoFilename,
    format: formatId
  })
  var filename = sanitize(dlJson.title + '.mp3').replaceAll(' ', '_')
  try {
    var video = new ffmpeg(videoFilename);
    video.then(video => {
      video.fnExtractSoundToMP3(filename, (err, file) => {
        if (!err) {
//          fs.unlinkSync(videoFilename)
          console.log(`File has been created at ${file}`)
        } else {
          console.error(err)
        }
      })
    }, (err) => {
      console.error(`Error: ${err}`)
    })
  } catch (e) {
    console.error(e.code)
    console.error(e.msg)
  }
})()
