/* eslint-disable no-undef */
const cs = new CSInterface();
const path = cep_node.require('path');

import { storySeq } from './xml';
import { locateFiles } from './fileIO'


export const getSequences = () => {
    return new Promise((resolve, reject) => {
        cs.evalScript('getSequences()', function(payload) {
            const data = JSON.parse(payload);
            if (data.error) { return reject(data) }
            else { return resolve(data) }
        })
    })
}

const createChunks = (xmlPath, linealSeq) => {
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
    return {linealChunks: linealChunks, nonLinealChunks: nonLinealChunks}
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

export const setNonLinealClipTracks = (clipArr, linealSeq) => {
    const firstAvailTrack = linealSeq.audioTracks.length;
    let clips = [];
    clipArr.forEach(clip => {
        const conflictingClips = clips.filter(x=> {
            return x.start < clip.end && x.end > clip.end
        })
        if (conflictingClips.length < 1) {
            clips.push({
                ...clip,
                track: { idx: firstAvailTrack }
            })
        } else {
            const conflictTracks = conflictingClips.map(x=> x.track.idx)
                .sort((a,b) => a-b).reverse()
            if (!(conflictTracks.includes(firstAvailTrack))) {
                clips.push({
                    ...clip,
                    track: { idx: firstAvailTrack }
                })
            } else {
                clips.push({
                    ...clip,
                    track: { idx: conflictTracks[0] + 1}
                })
            }
        }
    })
    return clips
}

export const createLinealClips = (chunkArr, linealSeq) => {
    let linealClips = [];
    chunkArr.forEach(chunk => {
        const range = { 
            in: chunk.in, 
            out: chunk.out, 
            start: chunk.start, 
            end: chunk.end,
            duration: chunk.duration 
        };
        linealClips.push(...trimLinealClips(linealSeq, range))
    })
    return linealClips
}

export const createNonLinealClips = (clipArr, linealSeq, xmlPath) => {
    const linkedClips = locateFiles(xmlPath, clipArr);
    return setNonLinealClipTracks(linkedClips, linealSeq)
}

export const createAnimaticSeq = (xmlPath, linealSeq) => {
    console.log(linealSeq)
    const { linealChunks, nonLinealChunks } = createChunks(xmlPath, linealSeq)

    const linealClips = createLinealClips(linealChunks, linealSeq);
    const nonLinealClips = createNonLinealClips(nonLinealChunks, linealSeq, xmlPath);
    
    console.log(linealClips)
    console.log(nonLinealClips)
    
    const numOfTracks = [...linealClips, ...nonLinealClips].map(x=>x.track.idx)
        .sort((a,b)=>a-b).reverse()[0] + 1;

    const tempName = "beeyoop";

    const tempId = "aaa";

    const seqInfo = JSON.stringify({
        linealClips: linealClips,
        nonLinealClips: nonLinealClips,
        numTracks: numOfTracks,
        name: tempName,
        id: tempId
    })

    console.log(JSON.parse(seqInfo))
    // cs.addEventListener('boop', function(evt) {
    //     console.log(evt)
    // });
    // cs.evalScript(`testAssemble()`, function(payload) {
    //     console.log(payload)
    // })
    cs.evalScript(`testAssemble(${seqInfo})`, function(payload) {
        console.log(JSON.parse(payload))
    })
}