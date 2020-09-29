const fs = require('fs');
// const path = require('path');
const parser = require('xml2json');

export const xml2obj = (xmlPath) => {
    const xml = fs.readFileSync(xmlPath);
    const obj = JSON.parse(parser.toJson(xml)).xmeml.sequence;
    return obj
}

export const genVideoEdits = (seqObj) => {
    const video = seqObj.media.video
    const fps = seqObj.rate.timebase;
    const videoTrack = Array.isArray(video.track) 
        ? video.track[0]
        : video.track
    const clips = videoTrack.clipitem;
    let transitions = videoTrack.transitionitem 
    const corrected = clips.map(clip => {
        let start = parseInt(clip.start, 10);
        let end = parseInt(clip.end, 10);
        let duration = parseInt(clip.duration, 10);
        if (start === -1) {
            start = parseInt(transitions[0].start, 10)
            transitions.shift()
        }
        if (end === -1) {
            end = parseInt(transitions[0].start, 10)
        }
        return {
            in: start/fps, 
            out: end/fps,
            start: start/fps,
            end: end/fps,
            duration: duration/fps
        }
    })
    return corrected
}

export const genAudioEdits = (seqObj) => {
    const audio = seqObj.media.audio;
    const fps = seqObj.rate.timebase;
    const audioTracks = Array.isArray(audio.track)
        ? audio.track.filter((_, i) => i % 2 === 0).map(x=>x.clipitem)
        : audio.track.clipitem
    
    return audioTracks.map(track => {
        return track.map(clip => {
            let obj = {
                start: parseInt(clip.start, 10)/fps,
                end: parseInt(clip.end, 10)/fps,
                in: parseInt(clip.in, 10)/fps,
                out: parseInt(clip.out, 10)/fps,
                duration: parseInt(clip.duration, 10)/fps,
                file: {
                    name: clip.file.name,
                    path: clip.file.pathurl
                }
            }
            // const filename = path.basename(clip.file.name).split('.')[0]
            // if (filename === linealSeqName) {
            // }
            return obj
        })
    })
}

