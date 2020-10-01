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


const findLinealClips = (linealSeq, timeRange) => {
    const matches = linealSeq.audioClips.forEach((track, idx) => {
        const matchedClips = track.clips.filter(clip => {
            //////////////////////////////////////////////////////
            add in seconds/ticks!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            ///////////////////////////////////////////////////
            return clip.start <= timeRange.end && clip.end >= timeRange.start
        }).map(clip => {
            if (clip.start < timeRange.start) {
                clip.in += timeRange.start - clip.start;
                clip.start = timeRange.start;
            }
            if (clip.end > timeRange.end) {

            }
        })

    }) 
}

export const createAnimaticSeq = (xmlPath, linealSeq) => {
    const storySeq = storySeq(xmlPath);
    const linealClips = [];
    storySeq.audio.forEach((track) => {
        track.forEach((clip) => {
            const ext = path.extname(clip.file.name);
            const filename = path.basename(clip.file.name, ext)
            if (filename === linealSeq.name) {

                linealClips.push({

                })
            }
        })
    })
}