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

function getSequences() {
    var proj = app.project;
    if (!proj) return JSON.stringify(ERR_NO_PROJECT);
    var sequences = proj.sequences;
    if (!sequences) return JSON.stringify(ERR_NO_SEQUENCES)
    return JSON.stringify(seqArr(sequences))
}

function search(projItem, id) {
    alert("enter");
    alert(projItem.name);
    var match = null;
    for (var i = 0; i < projItem.numItems; i++) {
        var item = projItem[i];
        alert(item.name);
        alert(item.type == 2);
        if (item.type == 2) {
            alert('beep');
            search(item, id);
        }
        if (item.nodeId == id) {
            match = item;
            return match
        }
    }
    return match
}

function findProjItem(projItemRef) {
    var projItems = app.project.rootItem.children;
    var match = search(projItems, projItemRef.nodeId);

    return match
    // var match = search(projItems)
    // alert(projItems.numItems)
    // var treeLevels = projItemRef.treePath.split('\\')

    // // var item = null;
    // for (var i = 0; i < treeLevels.length; i++) {
    //     var parentName = treeLevels[i];
    //     for (var k = 0; k < projItems.numItems; k++) {
    //         var item = projItems[k];
    //         alert("testing: " + item.name + " vs " + parentName) 
    //         if (item.name == parentName) {
    //             alert("matched: " + item.name)
    //             projItems = item;
    //             alert(projItems.name)
    //             break;
    //         }
    //     }
    // }
    // return projItems
    // for (var i = 0; i < projItems.numItems; i++) {
    //     var item = projItems[i];
    //     alert(item.treePath)
    //     if (item.nodeId == nodeId) return item
    // }
}

// function emit(data) {
//     var xLib = new ExternalObject("lib:\PlugPlugExternalObject");
//     var evt = new CSXSEvent();
//     evt.type = 'boop';
//     evt.data = JSON.stringify({evt: data})
//     evt.dispatch();
// }

function testAssemble(clipArr) {
    /* eslint-disable no-useless-escape */
    
    var seq = app.project.activeSequence;
    for (var i = 0; i < 1; i++) {
        var clip = clipArr[i];
        // alert(clip.nodeId)
        var projItem = findProjItem(clip.projectItem);
        projItem.setInPoint(clip.inPoint);
        projItem.setOutPoint(clip.outPoint);
        seq.audioTracks[clip.track.idx].overwriteClip(projItem, clip.start);
    }
}


