/* eslint-disable no-undef */

import { trackArr, addMissingAudioTracks } from './track';
import { findProjItem,  } from './clip'


export function seqObj(seq) {
    return {
        name: seq.name,
        sequenceID: seq.sequenceID,
        timebase: seq.timebase,
        zeroPoint: seq.zeroPoint,
        audioTracks: trackArr(seq.audioTracks),
        projectItem: {
            name: seq.projectItem.name,
            nodeId: seq.projectItem.nodeId,
            treePath: seq.projectItem.treePath
        }
        // videoTracks: trackArr(seq.videoTracks)
    }
}

export function seqArr(seqColl) {
    var seqArr = [];
    for (var i = 0; i < seqColl.numSequences; i++) {
        var seq = seqColl[i]
        seqArr.push(seqObj(seq))
    }
    return seqArr
}

function addAudioClipsToSeq(seq, clipArr) {
    for (var i = 0; i < clipArr.length; i++) {
        var clip = clipArr[i];
        var projItem = findProjItem(clip);
        if (projItem) {
            projItem.setInPoint(clip.inPoint);
            projItem.setOutPoint(clip.outPoint);
            seq.audioTracks[clip.track.idx].overwriteClip(projItem, clip.start)
        }
    }
}

export function createAnimaticSeq (seqInfo) {
    var seq = app.project.createNewSequence(seqInfo.name, seqInfo.id);
    var enoughAudioTracks = addMissingAudioTracks(seq, seqInfo.numTracks);
    if (enoughAudioTracks) addAudioClipsToSeq(seq, seqInfo.clips);

    return seq
}