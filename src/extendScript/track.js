export function clipObj(clip) {
    var obj = {
        name: clip.name,
        duration: clip.duration,
        end: clip.end,
        inPoint: clip.inPoint,
        nodeId: clip.nodeId,
        outPoint: clip.outPoint,
        start: clip.start,
    }
    if (clip.projectItem) {
        obj.projectItem = {
            name: clip.projectItem.name,
            nodeId: clip.projectItem.nodeId,
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
