/* eslint-disable no-undef */

export function clipObj(clip) {
    var obj = {
        name: clip.name,
        duration: clip.duration.seconds,
        end: clip.end.seconds,
        inPoint: clip.inPoint.seconds,
        nodeId: clip.nodeId,
        outPoint: clip.outPoint.seconds,
        start: clip.start.seconds,
    }
    if (clip.projectItem) {
        obj.projectItem = {
            name: clip.projectItem.name,
            nodeId: clip.projectItem.nodeId,
            treePath: clip.projectItem.treePath
        }
    }
    return obj
}

export function clipArr(clipColl) {
    var clipArr = [];
    for (var i = 0; i < clipColl.numItems; i++) {
        var clip = clipColl[i];
        clipArr.push(clipObj(clip))
    }
    return clipArr
}

export function trackObj(track) {
    return {
        name: track.name,
        id: track.id,
        mediaType: track.mediaType,
        clips: clipArr(track.clips)
    }
}

export function trackArr(trackColl) {
    var trackArr = [];
    for (var i = 0; i < trackColl.numTracks; i++) {
        var track = trackColl[i];
        trackArr.push(trackObj(track))
    }
    return trackArr
}

export function addMissingAudioTracks(seq, numTracks) {
    var numTracksToAdd = numTracks - seq.audioTracks.numTracks
    if (numTracksToAdd > 0) {
        var seqActive = app.project.openSequence(seq.sequenceID);
        if (seqActive) {
            app.enableQE();
            var qeSeq = qe.project.getActiveSequence();
            for (var j = 0; j < numTracksToAdd; j++) {
                qeSeq.addTracks(0)
            }
        }
    }
    // var updatedSeq = app.project.openSequence(seq.sequenceID);
    return seq.audioTracks.numTracks == numTracks ? true : false
}