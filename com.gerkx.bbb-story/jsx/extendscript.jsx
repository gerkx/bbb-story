var ERR_NO_PROJECT = {
    error: "ERR_NO_PROJECT",
    message: "No project available, please open a project and try again"
};

var ERR_NO_SEQUENCES = {
    error: "ERR_NO_SEQUENCES",
    message: "Project doesn't contain any sequences, create a sequence and try again"
};

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

/* eslint-disable no-undef */

function findProjItemByNodeId(nodeId) {
    var projItems = app.project.rootItem.children;
    return search(projItems, nodeId);

    function search(projItem, id) {
        // var PROJECT_ITEM_CLIP = 1;
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
    var baseName = name.split('.')[0];
    var projItems = app.project.rootItem.children;
    return search(projItems, baseName);

    function search(projItem, clipName) {
        // var PROJECT_ITEM_CLIP = 1;
        var PROJECT_ITEM_BIN = 2;
        
        for (var i = 0; i < projItem.numItems; i++) {
            var item = projItem[i];
            if (item.type == PROJECT_ITEM_BIN) {
                var found = search(item.children, clipName);
                if (found) return found
            } else {
                if (item.name === clipName) {
                    return item
                }
            }
        }
    }
}

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
function testAssemble(seqInfo) {
    /* eslint-disable no-useless-escape */
    
    // var seq = app.project.activeSequence;
    var seq = app.project.createNewSequence(seqInfo.name, seqInfo.id);
    var numTracksToAdd = seqInfo.numTracks - seq.audioTracks.numTracks;
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

    // var seq = app.project.createNewSequence(seqInfo.name, seqInfo.id);

    var clipArr = seqInfo.linealClips;
    for (var i = 0; i < clipArr.length; i++) {
            var clip = clipArr[i];
            // alert(clip.nodeId)
            var projItem = findProjItemByNodeId(clip.projectItem.nodeId);
    
            projItem.setInPoint(clip.inPoint);
            projItem.setOutPoint(clip.outPoint);
            seq.audioTracks[clip.track.idx].overwriteClip(projItem, clip.start);
    }

    var nonLinealClipPaths = [];
    for (var x = 0; x < seqInfo.nonLinealClips.length; x++) {
        nonLinealClipPaths.push(seqInfo.nonLinealClips[x].file.path);
    }
    app.project.importFiles(nonLinealClipPaths);
    // var nonLinealClips = [];
    for (var k = 0; k < seqInfo.nonLinealClips.length; k++) {
        var nonLinearClip = seqInfo.nonLinealClips[k];
        var clipItem = findProjItemByName(nonLinearClip.file.name);
        if (clipItem) {
            clipItem.setInPoint(nonLinearClip.in);
            clipItem.setOutPoint(nonLinearClip.out);

            seq.audioTracks[nonLinearClip.track.idx].overwriteClip(clipItem, nonLinearClip.start);
        }
    }

    return JSON.stringify(seq)
}


