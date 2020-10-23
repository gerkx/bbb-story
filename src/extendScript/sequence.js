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

function createShotStr(info, marker) {
    var shotNum = parseInt(marker.name, 10);
    var seqNum = (Math.floor(shotNum / 100) + 1) * 10;
    var shotStr = padZero(shotNum, 4);
    var seqStr = padZero(seqNum, 4)
    return info.program + "_S" + padZero(info.season, 2) +
        "E" + padZero(info.episode, 2) + "_SQ" + seqStr + "_SH" + shotStr
    
}

export function createShotSupers (info) {
    var seq = app.project.activeSequence;
    var seqEnd = new Time()
    seqEnd.ticks = seq.end;
    if (!seq) return false;
    
    var mogrtPath = joinPath([info.extPath, 'mogrt', 'shotSuper_T02_v001.mogrt']);
    var mogrt = new File(mogrtPath);
    var importMogrtErr = false
    
    markers = markersToArr(seq.markers);
    for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        if (!isNaN(parseInt(marker.name, 10))) {
            var seqMogrt = seq.importMGT(
                mogrt.fsName, // mogrt file to import
                marker.start.ticks, // sequence target time
                info.target - 1, // target video track
                0 // target audio track
            )
            if (seqMogrt) {
                var shotDur = 0
                var shotEnd = new Time()
                if (i === markers.length - 1) {
                    shotEnd.seconds = seqEnd.seconds
                    shotDur = Math.round((seqEnd.seconds - marker.start.seconds) * 25)
                } else {
                    shotEnd.seconds = markers[i+1].start.seconds
                    shotDur = Math.round(
                        (shotEnd.seconds - marker.start.seconds) * 25
                    )
                }

                seqMogrt.end = shotEnd
                var shotStr = createShotStr(info, marker);

                var mogrtComponent = seqMogrt.getMGTComponent();
                if (mogrtComponent) {
                    var props = mogrtComponent.properties;
                    var shotProp = props.getParamForDisplayName('shot');
                    if (shotProp) { shotProp.setValue(shotStr) }
                    var durProp = props.getParamForDisplayName('dur');
                    if (durProp) { durProp.setValue(padZero(shotDur, 4)) }
                }
            } else {
                importMogrtErr = true;
                break;
            }
        }
    }
    if (importMogrtErr) { alert('unable to import MOGRT file: ' + mogrt.fsName ) }
    mogrt.close()

    return true


}