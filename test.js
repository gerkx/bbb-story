const fs = require('fs');
const path = require('path')
const parser = require('xml2json');


const xml2obj = (xmlPath) => {
    const xml = fs.readFileSync(xmlPath);
    // fs.writeFileSync(__dirname + "/json.json", parser.toJson(xml))
    const obj = JSON.parse(parser.toJson(xml)).xmeml.sequence;
    return obj
}

// const genStoryEdits = (seqObj) => {
//     const video = seqObj.media.video
//     const fps = video.format.samplecharacteristics.rate.timebase;
//     const videoTrack = Array.isArray(video.track) 
//         ? video.track[0]
//         : video.track
//     const clips = videoTrack.clipitem;
//     let transitions = videoTrack.transitionitem 
//     const corrected = clips.map((clip, _) => {
//         let start = parseInt(clip.start, 10);
//         let end = parseInt(clip.end, 10);
//         let duration = parseInt(clip.duration, 10);
//         if (start === -1) {
//             start = parseInt(transitions[0].start, 10)
//             transitions.shift()
//         }
//         if (end === -1) {
//             end = parseInt(transitions[0].start, 10)
//         }
//         return {
//             in: start/fps, 
//             out: end/fps,
//             start: start/fps,
//             end: end/fps,
//             duration: duration/fps
//         }
//     })
//     return corrected
// }


const genAudioEdits = (seqObj) => {
    const audio = seqObj.media.audio;
    const fps = seqObj.rate.timebase;
    const audioTracks = Array.isArray(audio.track)
        ? audio.track.filter((_, i) => i % 2 === 0).map(x=>x.clipitem)
        : audio.track.clipitem
    
    const tagged = audioTracks.map(track => {
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
    return tagged

}

const xmlFile = __dirname + '/MM_145_FOTOS_R3.xml';
// const xmlFile = __dirname + '/S01E00_Baile03_v001.xml';
// const str = fs.readFileSync(xmlFile)

// const obj = JSON.parse(parser.toJson(str)).xmeml.sequence;

// const obj = require('./json.json').xmeml.sequence;
// const obj = JSON.parse(json)
const obj = xml2obj(xmlFile)

const blerp = genAudioEdits(obj)
console.log(blerp[0])
// console.log(obj.media.audio.track[0].clipitem[0].file.name)
// console.log(genStoryEdits(obj))

// console.log(obj)
// const track = obj.media.video.track[0].clipitem

// // let start = 0;

// console.log(track.map(x=> {
//     return {
//         in: x.in,
//         out: x.out,
//         start: x.start,
//         end: x.end,
//         dur: x.duration
//     }
// }))

// console.log(obj.media.video.track[0].transitionitem)

// // const correctStartEnd = (clipArr) => {
// //     const corrected = clipArr.map((clip, idx) => {
// //         if (clip.start === -1) {
// //             const prevClip = clipArr[idx-1];
// //             if (prevClip.end !== -1) {
// //                 clip.start = prevClip.end
// //             } else {
// //                 clip.start = prevClip.start + prevClip.duration
// //             }
// //         }
// //         if (clip.end === -1) {
// //             if (clip.start !== -1) {
// //                 clip.end = clip.start + clip.duration
// //             } else {
// //                 clip.end = clipArr[idx+1].start
// //             }
// //         }
// //         return clip
// //     })
// //     return corrected
// // }

// const xmlToObj = (fcpXML) => {
//     parser.parseString(fcpXML, function (err, xml){
//         if (err) return err;
//         const seq = xml.xmeml.sequence[0];
//         const props = {
//             uuid: seq.uuid[0],
//             name: seq.name[0],
//             duration: seq.duration[0],
//             fps: seq.rate[0].timebase[0]
//         };
//         const media = seq.media[0];
//         const video = media.video[0].track[0].clipitem.map((x, i) => {
//             return {
//                 in: parseInt(x.in[0], 10),
//                 out: parseInt(x.out[0], 10),
//                 start: parseInt(x.start[0], 10),
//                 end: parseInt(x.end[0], 10),
//                 duration: parseInt(x.duration[0], 10),
//                 shot: i,
//             }
//         });
//         const audio = media.audio[0].track.filter((_, idx) => idx % 2 !== 0)
//         .map(track => track.clipitem.map(x => {
//             return {
//                 // in: parseInt(x.in[0], 10),
//                 // out: parseInt(x.out[0], 10),
//                 // start: parseInt(x.start[0], 10),
//                 // end: parseInt(x.end[0], 10),
//                 // duration: parseInt(x.duration[0], 10),
//                 // name: x.name[0],
//                 file: x.file[0]
//             }
//         }))
        

//         console.log(props)
//         console.log(video)
//         console.log(audio[0])
//         console.log(media.audio[0].track[0].clipitem[0].file[0].name[0])
//     })
// }


// fs.readFile(__dirname + xmlFile, function(err, data) {
//     if (err) console.log(err);
//     xmlToObj(data)
//     // parser.parseString(data, function (err, result) {
//     //     if (err) console.log(err);
//     //     const seq = JSON.parse(JSON.stringify(result.xmeml.sequence))[0];
//     //     const media = seq.media[0];
//     //     // const audio = media.audio[0];
//     //     const video = media.video[0];

//     //     const clips = video.track[0].clipitem.map((x, i)=> {
//     //         return {
//     //             in: parseInt(x.in[0], 10),
//     //             out: parseInt(x.out[0], 10),
//     //             start: parseInt(x.start[0], 10),
//     //             end: parseInt(x.end[0], 10),
//     //             duration: parseInt(x.duration[0], 10),
//     //             shot: i,
//     //             // shotExt: parseInt(x.name[0].split('-')[1])
//     //         }
//     //     });
//     //     // const transitions = video.track[0].transitionitem.map(t=> {
//     //     //     return {
//     //     //         start: parseInt(t.start[0], 10),
//     //     //         end: parseInt(t.end[0], 10),
//     //     //     }
//     //     // });

//     //     // console.log(transitions)
//     //     console.log(correctStartEnd(clips))
//     //     console.log(seq)
//     })
// // })