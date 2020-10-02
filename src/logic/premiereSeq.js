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


const trimLinealClips = (linealSeq, timeRange) => {
    let  clips = []
    linealSeq.audioTracks.forEach((track, idx) => {
        track.clips.filter(clip => {
            return clip.start <= timeRange.end && 
            clip.end >= timeRange.start
        }).forEach(clip => {
            if (clip.start < timeRange.start) {
                clip.inPoint += timeRange.start - clip.start;
                clip.start = timeRange.start;
            }
            if (clip.end > timeRange.end) {
                clip.outPoint -= timeRange.end - clip.end;
                clip.end = timeRange.end
            }
            clips.push({
                ...clip,
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
// export const createAnimaticSeq = (xmlPath) => {
    const story = storySeq(xmlPath);
    // console.log(story)
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
    let linealClips = [];
    linealChunks.forEach(chunk => {
        const range = { start: chunk.in, end: chunk.out };
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