/* eslint-disable no-undef */

import { trackArr, addMissingAudioTracks } from './track';
import { findProjItem,  } from './clip'
import { joinPath, padZero } from './util'
import { markersToArr } from './markers'


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

function addVideoClipsToSeq(seq, vidObj) {
    var projItem = findProjItem(vidObj);
    if (projItem){
        for (var i = 0; i < vidObj.clips.length; i++) {
            var clip = vidObj.clips[i];
            projItem.setInPoint(clip.in);
            projItem.setOutPoint(clip.out);
            seq.videoTracks[0].overwriteClip(projItem, clip.start);
            var audioClipIdx = seq.audioTracks[0].clips.numItems - 1
            seq.audioTracks[0].clips[audioClipIdx].remove(true, true);
            var marker = seq.markers.createMarker(clip.start);
            marker.name = ("0000" + (i*10)).slice(-4)
        }
    }
    
}

export function createAnimaticSeq (seqInfo) {
    var seq = app.project.createNewSequence(seqInfo.name, seqInfo.id);
    addVideoClipsToSeq(seq, seqInfo.video)
    var enoughAudioTracks = addMissingAudioTracks(seq, seqInfo.audio.numTracks);
    if (enoughAudioTracks) addAudioClipsToSeq(seq, seqInfo.audio.clips);

    return seq
}

export function createShotSupers (info) {
    var seq = app.project.activeSequence;
    if (!seq) return false;
    markers = markersToArr(seq.markers);

    return JSON.stringify(markers)

    // var mogrtPath = joinPath([info.extPath], 'mogrt', 'super.mogrt');
    // var mogrt = new File(mogrtPath);
}