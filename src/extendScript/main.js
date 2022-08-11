import {
    ERR_NO_PROJECT,
    ERR_NO_SEQUENCES,
    ERR_NO_ACTIVE_SEQUENCE,
} from './errors'

import { seqArr, createAnimaticSeq, createShotSupers } from './sequence';

import {getNumberOfVidTracks } from './track'

import { markersToArr } from './markers'

import { joinPath } from './util'

// import {joinPath} from './util'

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

export function exportClips(obj) {
    var jobIds = [];
    var seq = app.project.activeSequence;
    if (!seq) return JSON.stringify(ERR_NO_ACTIVE_SEQUENCE);

    var preset = new File(obj.preset);
    var shotPath = new File(obj.shotPath);
    var ext = seq.getExportFileExtension(preset.fsName);

    var markers = markersToArr(seq.markers);
    for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];

        var shot = joinPath([shotPath.fsName, marker.name + '.' + ext]);

        var out = new Time();
        if (i == markers.length - 1) {
            out.ticks = seq.end;
        } else {
            out.ticks = markers[i+1].start.ticks
        }
        seq.setInPoint(marker.start.ticks);
        seq.setOutPoint(out.ticks);

        var job = app.encoder.encodeSequence(
            seq, // seq to render from
            shot, // output path
            preset.fsName, // preset path
            1, // encode in to out
            0 // don't remove from ame
        )
        if (job) { 
            jobIds.push({name: marker.name, job:job}) 
        }

        
    }
    shotPath.close()
    preset.close()

    return jobIds
}

