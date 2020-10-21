import {
    ERR_NO_PROJECT,
    ERR_NO_SEQUENCES,
} from './errors'

import { seqArr, createAnimaticSeq, createShotSupers } from './sequence';

import {getNumberOfVidTracks } from './track'

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
export function assembleAnimaticSeq(seqInfo) {
    var animatic = createAnimaticSeq(seqInfo);

    return JSON.stringify(animatic)
}

export function createSupers(info) {
    var markers = createShotSupers(info)
    return markers
}

export function getNumberOfVideoTracks() {
    return getNumberOfVidTracks()
}