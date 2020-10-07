import {
    ERR_NO_PROJECT,
    ERR_NO_SEQUENCES,
} from './errors'

import { seqArr } from './sequence'
// import { clipObj } from './track';

/* eslint-disable no-undef */

export function getSequences() {
    var proj = app.project;
    if (!proj) return JSON.stringify(ERR_NO_PROJECT);
    var sequences = proj.sequences;
    if (!sequences) return JSON.stringify(ERR_NO_SEQUENCES)
    return JSON.stringify(seqArr(sequences))
}


function findProjItem(nodeId) {
    var projItems = app.project.rootItem.children;
    return search(projItems, nodeId);
    
    function search(projItem, id) {
        // var PROJECT_ITEM_CLIP = 1;
        var PROJECT_ITEM_BIN = 2;
        
        for (var i = 0; i < projItem.numItems; i++) {
            var item = projItem[i];
            if (item.type == PROJECT_ITEM_BIN) {
                var found = search(item.children, id)
                if (found) return found
            } else {
                if (item.nodeId === id) {
                    return item
                }
            }
        }
    }
}

// function emit(data) {
//     var xLib = new ExternalObject("lib:\PlugPlugExternalObject");
//     var evt = new CSXSEvent();
//     evt.type = 'boop';
//     evt.data = JSON.stringify({evt: data})
//     evt.dispatch();
// }

export function testAssemble(clipArr) {
    /* eslint-disable no-useless-escape */
    
    var seq = app.project.activeSequence;
    // var item = findProjItem("000f4298");
    // item.setInPoint(1.0);
    // item.setOutPoint(5.0);
    // seq.audioTracks[4].overwriteClip(item, 0.0)
    for (var i = 0; i < clipArr.length; i++) {
        var clip = clipArr[i]
        // alert(clip.nodeId)
        var projItem = findProjItem(clip.projectItem.nodeId);
        
        projItem.setInPoint(clip.inPoint);
        projItem.setOutPoint(clip.outPoint);
        seq.audioTracks[clip.track.idx].overwriteClip(projItem, clip.start)
    }
}