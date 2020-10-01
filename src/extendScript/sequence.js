import { trackArr } from './track'


export function seqObj(seq) {
    return {
        name: seq.name,
        sequenceID: seq.sequenceID,
        timebase: seq.timebase,
        zeroPoint: seq.zeroPoint,
        audioTracks: trackArr(seq.audioTracks),
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