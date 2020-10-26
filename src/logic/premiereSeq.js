/* eslint-disable no-undef */
const cs = new CSInterface();
const path = cep_node.require('path');

import { storySeq } from './xml';
import { locateFiles } from './fileIO'
import { generateId } from './id';


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
        var ioClip = {
            ...clip,
            inPoint: clip.in,
            outPoint: clip.out
        }
        const conflictingClips = clips.filter(x=> {
            return x.start < ioClip.end && x.end > ioClip.start
        })
        if (conflictingClips.length < 1) {
            clips.push({
                ...ioClip,
                track: { idx: firstAvailTrack }
            })
        } else {
            const conflictTracks = conflictingClips.map(x=> x.track.idx)
                .sort((a,b) => a-b).reverse()
            if (!(conflictTracks.includes(firstAvailTrack))) {
                clips.push({
                    ...ioClip,
                    track: { idx: firstAvailTrack }
                })
            } else {
                clips.push({
                    ...ioClip,
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

export const createAnimaticSeq = (xmlPath, vidPath, linealSeq, seqName) => {
    const { linealChunks, nonLinealChunks } = createChunks(xmlPath, linealSeq)

    const linealClips = createLinealClips(linealChunks, linealSeq);
    const nonLinealClips = createNonLinealClips(nonLinealChunks, linealSeq, xmlPath);
    
    const numOfTracks = [...linealClips, ...nonLinealClips].map(x=>x.track.idx)
        .sort((a,b)=>a-b).reverse()[0] + 1;

    const seqInfo = JSON.stringify({
        audio: {
            clips: [...linealClips, ...nonLinealClips],
            numTracks: numOfTracks,
        },
        video: {
            file: { path: vidPath, name: path.basename(vidPath) },
            clips: storySeq(xmlPath).video
        },
        name: seqName,
        id: generateId()
    })

    console.log(JSON.parse(seqInfo))
    cs.evalScript(`assembleAnimaticSeq(${seqInfo})`, function(payload) {
        console.log(JSON.parse(payload))
    })
}

export const createSupers = (payload) => {
    const extPath = cs.getSystemPath(SystemPath.EXTENSION);
    return new Promise((resolve, reject) => {
        cs.evalScript(`createSupers(${JSON.stringify(
            {...payload, extPath: extPath}
        )})`, function(success) {
            if(!success) { return reject(sucess)}
            else { return resolve(success) }
        })
    })
}

export const getNumberOfVideoTracks = () => {
    return new Promise((resolve, reject) => {
        cs.evalScript('getNumberOfVideoTracks()', function(res) {
            if (!res) { return reject(res) }
            else { return resolve(res) }
        })
    })
}

export const exportShots = (presetPath, exportPath) => {
    const payload = JSON.stringify({ preset:presetPath, export: exportPath });
    return new Promise((resolve, reject) => {
        cs.evalScript(`exportShots(${payload})`, function(res) {
            const data = JSON.parse(res);
            if (data.error) { return reject(data)}
            else { return resolve(data) }
        })
    })
}