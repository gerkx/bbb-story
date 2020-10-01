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
        duration: clip.duration,
        end: clip.end,
        inPoint: clip.inPoint,
        nodeId: clip.nodeId,
        outPoint: clip.outPoint,
        start: clip.start,
        // projectItem: {
        //     name: clip.projectItem.name,
        //     nodeId: clip.projectItem.nodeId,
        //     // treePath: clip.projectItem.treePath
        // }
    };
    if (clip.projectItem) {
        obj.projectItem = {
            name: clip.projectItem.name,
            nodeId: clip.projectItem.nodeId,
            // treePath: clip.projectItem.treePath
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


