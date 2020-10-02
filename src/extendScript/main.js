import {
    ERR_NO_PROJECT,
    ERR_NO_SEQUENCES,
} from './errors'

import { seqArr } from './sequence'
import { clipObj } from './track';

/* eslint-disable no-undef */

export function getSequences() {
    var proj = app.project;
    if (!proj) return JSON.stringify(ERR_NO_PROJECT);
    var sequences = proj.sequences;
    if (!sequences) return JSON.stringify(ERR_NO_SEQUENCES)
    return JSON.stringify(seqArr(sequences))
}

function search(projItem, id) {
    alert("enter")
    alert(projItem.name)
    var match = null;
    for (var i = 0; i < projItem.numItems; i++) {
        var item = projItem[i];
        alert(item.name)
        alert(item.type == 2)
        if (item.type == 2) {
            alert('beep')
            search(item, id)
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
    var match = search(projItems, projItemRef.nodeId)

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

export function testAssemble(clipArr) {
    /* eslint-disable no-useless-escape */
    
    var seq = app.project.activeSequence;
    for (var i = 0; i < 1; i++) {
        var clip = clipArr[i]
        // alert(clip.nodeId)
        var projItem = findProjItem(clip.projectItem);
        projItem.setInPoint(clip.inPoint);
        projItem.setOutPoint(clip.outPoint);
        seq.audioTracks[clip.track.idx].overwriteClip(projItem, clip.start)
    }
}