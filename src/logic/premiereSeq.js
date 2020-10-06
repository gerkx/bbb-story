/* eslint-disable no-undef */
const cs = new CSInterface();
const path = cep_node.require('path');

import { storySeq } from './xml';


export const getSequences = () => {
    return new Promise((resolve, reject) => {
        cs.evalScript('getSequences()', function(payload) {
            const data = JSON.parse(payload);
            if (data.error) { return reject(data) }
            else { return resolve(data) }
        })
    })
}


const trimLinealClips = (linealSeq, range) => {
    let  clips = []
    
    linealSeq.audioTracks.forEach((track, idx) => {
        track.clips.filter(clip => {
            return clip.start < range.out && clip.end > range.in
        }).forEach(clip => {
            let subClip = {...clip}

            if (subClip.start < range.in) {
                const inPointOffset = range.in - subClip.start;
                
                subClip.inPoint += inPointOffset;
                subClip.start = range.start;
            }
             else if (subClip.start > range.in) {
                const startOffset = subClip.start - range.in;
                subClip.start = range.start + startOffset
            }
            else {
                subClip.start = range.start
            }
            if (subClip.end > range.out) {
                const outPointOffset = subClip.end - range.out;
                subClip.outPoint -= outPointOffset
            }
            clips.push({
                ...subClip,
                track: {
                    name: track.name,
                    id: track.id,
                    idx: idx
                }
            })
        })
        
    })
    return clips
}

export const createAnimaticSeq = (xmlPath, linealSeq) => {
    const story = storySeq(xmlPath);
    const linealChunks = [];
    const nonLinealChunks = [];
    story.audio.forEach((track) => {
        track.forEach((clip) => {
            const ext = path.extname(clip.file.name);
            const filename = path.basename(clip.file.name, ext)
            if (filename === linealSeq.name) {
                linealChunks.push(clip)
            } else {
                nonLinealChunks.push(clip)
            }
        })
    })
    console.log(linealChunks)
    let linealClips = [];
    linealChunks.forEach(chunk => {
        const range = { 
            in: chunk.in, 
            out: chunk.out, 
            start: chunk.start, 
            end: chunk.end,
            duration: chunk.duration 
        };
        linealClips.push(...trimLinealClips(linealSeq, range))
    })
    console.log(linealClips)
    cs.addEventListener('boop', function(evt) {
        console.log(evt)
    });
    cs.evalScript(`testAssemble(${JSON.stringify(linealClips)})`, function() {
        console.log('payload')
    })
}