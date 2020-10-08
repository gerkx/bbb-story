import {
    ERR_NO_PROJECT,
    ERR_NO_SEQUENCES,
} from './errors'

import { seqArr, createAnimaticSeq } from './sequence';

// import { 
//     findProjItemByNodeId, 
//     findProjItemByName ,
// } from './clip';
// import { clipObj } from './track';

/* eslint-disable no-undef */

export function getSequences() {
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
export function testAssemble(seqInfo) {
    var animatic = createAnimaticSeq(seqInfo);

    /* eslint-disable no-useless-escape */
    
    // var seq = app.project.activeSequence;
    // var seq = app.project.createNewSequence(seqInfo.name, seqInfo.id);
    // var enoughTracks = addMissingAudioTracks(seq, seqInfo.numTracks);

    // if (enoughTracks) {

    // }

    // var seq = app.project.createNewSequence(seqInfo.name, seqInfo.id);
    // var nonLinealClipPaths = [];
    // for (var x = 0; x < seqInfo.nonLinealClips.length; x++) {
    //     nonLinealClipPaths.push(seqInfo.nonLinealClips[x].file.path)
    // }
    // app.project.importFiles(nonLinealClipPaths)

    // var clipArr = seqInfo.linealClips
    // for (var i = 0; i < clipArr.length; i++) {
    //         var clip = clipArr[i]
    //         // alert(clip.nodeId)
    //         var projItem = findProjItemByNodeId(clip.projectItem.nodeId);
    
    //         projItem.setInPoint(clip.inPoint);
    //         projItem.setOutPoint(clip.outPoint);
    //         seq.audioTracks[clip.track.idx].overwriteClip(projItem, clip.start)
    // }

    // // var nonLinealClips = [];
    // for (var k = 0; k < seqInfo.nonLinealClips.length; k++) {
    //     var nonLinearClip = seqInfo.nonLinealClips[k];
    //     var clipItem = findProjItemByName(nonLinearClip.file.name);
    //     if (clipItem) {
    //         clipItem.setInPoint(nonLinearClip.in);
    //         clipItem.setOutPoint(nonLinearClip.out);

    //         seq.audioTracks[nonLinearClip.track.idx].overwriteClip(clipItem, nonLinearClip.start)
    //     }
    // }

    return JSON.stringify(animatic)
}