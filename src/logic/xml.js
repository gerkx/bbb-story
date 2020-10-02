// eslint-disable-next-line no-undef
const fs = cep_node.require('fs');
// const path = require('path');
// eslint-disable-next-line no-undef
// const parser = require('xml2json-light');
// var convert = require('xml-js');
var parser = require('fast-xml-parser');
// const parser = cep_node.require('xml2json');
// const { toJson } = require('xml2json')
// import { toJson } from 'xml2json'



// export const chooseXMLFile = () => {
//     const opts = [
//         false,
//         false,
//         "Cargar una secuencia en XML",
//         '',
//         ['.xml', '.XML']
//     ];
//     const loc = window.cep.fs.showOpenDialog(...opts)
//     if (loc.err !== 0) return console.log('oops');
//     if (loc) return loc.data[0]
//     return null
// }

export const xml2obj = (xmlPath) => {
    const xml = fs.readFileSync(xmlPath, 'utf8');
    // console.log(typeof xml)
    // console.log(xml)
    // const obj = "beep"
    // const obj = convert.xml2js(xml)
    const obj = parser.parse(xml, {}, true).xmeml.sequence
    // const obj = JSON.parse(parser.xml2json(xml)).xmeml.sequence;
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
    if (!Array.isArray(transitions)) transitions = [transitions]
    const corrected = clips.map(clip => {
        // console.log(clip)
        let start = clip.start;
        let end = clip.end;
        let duration = clip.duration;
        if (start === -1) {
            start = transitions[0].start
            transitions.shift()
        }
        if (end === -1) {
            end = transitions[0].start
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
    console.log(seqObj)
    const audio = seqObj.media.audio;
    const fps = seqObj.rate.timebase;
    const audioTracks = Array.isArray(audio.track)
        ? audio.track.filter((_, i) => i % 2 === 0).map(x=>x.clipitem)
        : audio.track.clipitem

    return audioTracks.map(track => {
        if (!Array.isArray(track)) track = [track]
        return track.map(clip => {
            return {
                start: clip.start/fps,
                end: clip.end/fps,
                in: clip.in/fps,
                out: clip.out/fps,
                duration: clip.duration/fps,
                file: {
                    name: clip.file.name,
                    path: clip.file.pathurl
                }
            }
        })
    })
}

export const storySeq = (xmlPath) => {
    const xmlObj = xml2obj(xmlPath);
    return {
        audio: genAudioEdits(xmlObj),
        video: genVideoEdits(xmlObj)
    }
}
