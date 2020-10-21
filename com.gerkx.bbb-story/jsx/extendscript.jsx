var ERR_NO_PROJECT = {
    error: "ERR_NO_PROJECT",
    message: "No project available, please open a project and try again"
};

var ERR_NO_SEQUENCES = {
    error: "ERR_NO_SEQUENCES",
    message: "Project doesn't contain any sequences, create a sequence and try again"
};

/* eslint-disable no-undef */

function clipObj(clip) {
    var obj = {
        name: clip.name,
        duration: clip.duration.seconds,
        end: clip.end.seconds,
        inPoint: clip.inPoint.seconds,
        nodeId: clip.nodeId,
        outPoint: clip.outPoint.seconds,
        start: clip.start.seconds,
    };
    if (clip.projectItem) {
        obj.projectItem = {
            name: clip.projectItem.name,
            nodeId: clip.projectItem.nodeId,
            treePath: clip.projectItem.treePath
        };
    }
    return obj
}

function clipArr(clipColl) {
    var clipArr = [];
    for (var i = 0; i < clipColl.numItems; i++) {
        var clip = clipColl[i];
        clipArr.push(clipObj(clip));
    }
    return clipArr
}

function trackObj(track) {
    return {
        name: track.name,
        id: track.id,
        mediaType: track.mediaType,
        clips: clipArr(track.clips)
    }
}

function trackArr(trackColl) {
    var trackArr = [];
    for (var i = 0; i < trackColl.numTracks; i++) {
        var track = trackColl[i];
        trackArr.push(trackObj(track));
    }
    return trackArr
}

function addMissingAudioTracks(seq, numTracks) {
    var numTracksToAdd = numTracks - seq.audioTracks.numTracks;
    if (numTracksToAdd > 0) {
        var seqActive = app.project.openSequence(seq.sequenceID);
        if (seqActive) {
            app.enableQE();
            var qeSeq = qe.project.getActiveSequence();
            for (var j = 0; j < numTracksToAdd; j++) {
                qeSeq.addTracks(0);
            }
        }
    }
    // var updatedSeq = app.project.openSequence(seq.sequenceID);
    return seq.audioTracks.numTracks == numTracks ? true : false
}

/* eslint-disable no-undef */

function findProjItemByNodeId(nodeId) {
    var projItems = app.project.rootItem.children;
    return search(projItems, nodeId);

    function search(projItem, id) {
        var PROJECT_ITEM_BIN = 2;
        for (var i = 0; i < projItem.numItems; i++) {
            var item = projItem[i];
            if (item.type == PROJECT_ITEM_BIN) {
                var found = search(item.children, id);
                if (found) return found
            } else {
                if (item.nodeId === id) {
                    return item
                }
            }
        }
    }
}

function findProjItemByName(name) {
    var projItems = app.project.rootItem.children;
    return search(projItems, name);
    
    function search(projItem, clipName) {
        var PROJECT_ITEM_BIN = 2;
        var baseName = clipName.split('.');
        baseName.pop();
        baseName.join('.');
        
        for (var i = 0; i < projItem.numItems; i++) {
            var item = projItem[i];
            if (item.type == PROJECT_ITEM_BIN) {
                var found = search(item.children, clipName);
                if (found) return found
            } else {
                if (item.name === clipName || item.name === baseName) {
                    return item
                }
            }
        }
    }
}

function findProjItemByPath(mediaPath) {
    var projItems = app.project.rootItem.children;
    return search(projItems, mediaPath);

    function search(projItem, mediaPath) {
        var PROJECT_ITEM_BIN = 2;
        
        for (var i = 0; i < projItem.numItems; i++) {
            var item = projItem[i];
            
            if (item.type == PROJECT_ITEM_BIN) {
                var found = search(item.children, mediaPath);
                if (found) return found
            } else {
                if (item.getMediaPath() === mediaPath) {
                    return item
                }
            }
        }
    }
}

function findProjItem(clip) {
    var projItem = null;
    if ('projectItem' in clip) {
        projItem = findProjItemByNodeId(clip.projectItem.nodeId);

    } else {
        if ('file' in clip) projItem = findProjItemByName(clip.file.name);
    }
    if (!projItem) {
        projItem = importClip(clip);
    }
    return projItem
}



function importClip(clip) {
    var imported = app.project.importFiles([clip.file.path]);
    if (imported) {
        var projItem = findProjItemByPath(clip.file.path);
        if (projItem) {
            return projItem
        } else {
            return null
        }
    }
    return null
}

/* eslint-disable no-undef */


function seqObj(seq) {
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

function seqArr(seqColl) {
    var seqArr = [];
    for (var i = 0; i < seqColl.numSequences; i++) {
        var seq = seqColl[i];
        seqArr.push(seqObj(seq));
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
            seq.audioTracks[clip.track.idx].overwriteClip(projItem, clip.start);
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
            var audioClipIdx = seq.audioTracks[0].clips.numItems - 1;
            seq.audioTracks[0].clips[audioClipIdx].remove(true, true);
            var marker = seq.markers.createMarker(clip.start);
            marker.name = ("0000" + (i*10)).slice(-4);
        }
    }
    
}

function createAnimaticSeq (seqInfo) {
    var seq = app.project.createNewSequence(seqInfo.name, seqInfo.id);
    addVideoClipsToSeq(seq, seqInfo.video);
    var enoughAudioTracks = addMissingAudioTracks(seq, seqInfo.audio.numTracks);
    if (enoughAudioTracks) addAudioClipsToSeq(seq, seqInfo.audio.clips);

    return seq
}

// import { 
//     findProjItemByNodeId, 
//     findProjItemByName ,
// } from './clip';
// import { clipObj } from './track';

/* eslint-disable no-undef */

function getSequences() {
    var proj = app.project;
    if (!proj) return JSON.stringify(ERR_NO_PROJECT);
    var sequences = proj.sequences;
    if (!sequences) return JSON.stringify(ERR_NO_SEQUENCES)
    return JSON.stringify(seqArr(sequences))
}


// function emit(data) {
//     var xLib = new ExternalObject("lib:\PlugPlugExternalObject");
//     var evt = new CSXSEvent();
//     evt.type = 'boop';
//     evt.data = JSON.stringify({evt: data})
//     evt.dispatch();
// }

// export function testAssemble(clipArr) {
function assembleAnimaticSeq(seqInfo) {
    var animatic = createAnimaticSeq(seqInfo);

    return JSON.stringify(animatic)
}


