var ERR_NO_PROJECT = {
    error: "ERR_NO_PROJECT",
    message: "No project available, please open a project and try again"
};

var ERR_NO_SEQUENCES = {
    error: "ERR_NO_SEQUENCES",
    message: "Project doesn't contain any sequences, create a sequence and try again"
};

var ERR_MOGRT_IMPORT = {
    error: "ERR_MOGRT_IMPORT",
    message: "Error importing MOGRT template"
};

/* eslint-disable no-undef */

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

function addMissingAudioTracks(seq, numTracks) {
    var numTracksToAdd = numTracks - seq.audioTracks.numTracks;
    if (numTracksToAdd > 0) {
        var seqActive = app.project.openSequence(seq.sequenceID);
        if (seqActive) {
            app.enableQE();
            var qeSeq = qe.project.getActiveSequence();
            for (var j = 0; j < numTracksToAdd; j++) {
                qeSeq.addTracks(0);
            }
        }
    }
    // var updatedSeq = app.project.openSequence(seq.sequenceID);
    return seq.audioTracks.numTracks == numTracks ? true : false
}

function getNumberOfVidTracks() {
    var seq = app.project.activeSequence;
    return seq.videoTracks.numTracks
}

/* eslint-disable no-undef */

function findProjItemByNodeId(nodeId) {
    var projItems = app.project.rootItem.children;
    return search(projItems, nodeId);

    function search(projItem, id) {
        var PROJECT_ITEM_BIN = 2;
        for (var i = 0; i < projItem.numItems; i++) {
            var item = projItem[i];
            if (item.type == PROJECT_ITEM_BIN) {
                var found = search(item.children, id);
                if (found) return found
            } else {
                if (item.nodeId === id) {
                    return item
                }
            }
        }
    }
}

function findProjItemByName(name) {
    var projItems = app.project.rootItem.children;
    return search(projItems, name);
    
    function search(projItem, clipName) {
        var PROJECT_ITEM_BIN = 2;
        var baseName = clipName.split('.');
        baseName.pop();
        baseName.join('.');
        
        for (var i = 0; i < projItem.numItems; i++) {
            var item = projItem[i];
            if (item.type == PROJECT_ITEM_BIN) {
                var found = search(item.children, clipName);
                if (found) return found
            } else {
                if (item.name === clipName || item.name === baseName) {
                    return item
                }
            }
        }
    }
}

function findProjItemByPath(mediaPath) {
    var projItems = app.project.rootItem.children;
    return search(projItems, mediaPath);

    function search(projItem, mediaPath) {
        var PROJECT_ITEM_BIN = 2;
        
        for (var i = 0; i < projItem.numItems; i++) {
            var item = projItem[i];
            
            if (item.type == PROJECT_ITEM_BIN) {
                var found = search(item.children, mediaPath);
                if (found) return found
            } else {
                if (item.getMediaPath() === mediaPath) {
                    return item
                }
            }
        }
    }
}

function findProjItem(clip) {
    var projItem = null;
    if ('projectItem' in clip) {
        projItem = findProjItemByNodeId(clip.projectItem.nodeId);

    } else {
        if ('file' in clip) projItem = findProjItemByName(clip.file.name);
    }
    if (!projItem) {
        projItem = importClip(clip);
    }
    return projItem
}



function importClip(clip) {
    var imported = app.project.importFiles([clip.file.path]);
    if (imported) {
        var projItem = findProjItemByPath(clip.file.path);
        if (projItem) {
            return projItem
        } else {
            return null
        }
    }
    return null
}

/* eslint-disable no-undef */
function getSep() {
    if(Folder.fs == 'Macintosh'){
        return '/';
    }else {
        return '\\';
    }
}

function joinPath(pathSectionArr) {
    var path = "";
    for (var i = 0; i < pathSectionArr.length; i++) {
        if (i == 0) {
            path += pathSectionArr[i];
        } else {
            path += getSep() + pathSectionArr[i];
        }
    }
    return path
}

function padZero(num, zeros) {
    var base = "";
    for (var i = 0; i < parseInt(zeros, 10); i++) {
        base += "0";
    }
    num = num.toString();
    return (base + num).slice(-(parseInt(zeros, 10)))
  }

function markersToArr(markerColl) {
    var arr = [];
    var curr = null;
    for (var i = 0; i < markerColl.numMarkers; i++) {
        if (i === 0) { 
            curr = markerColl.getFirstMarker();
            arr.push(curr);
         } else {
             curr = markerColl.getNextMarker(curr);
             arr.push(curr);
         }
    }
    return arr
}

/* eslint-disable no-undef */


function seqObj(seq) {
    return {
        name: seq.name,
        sequenceID: seq.sequenceID,
        timebase: seq.timebase,
        zeroPoint: seq.zeroPoint,
        audioTracks: trackArr(seq.audioTracks),
        projectItem: {
            name: seq.projectItem.name,
            nodeId: seq.projectItem.nodeId,
            treePath: seq.projectItem.treePath
        }
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

function addAudioClipsToSeq(seq, clipArr) {
    
    for (var i = 0; i < clipArr.length; i++) {
        var clip = clipArr[i];
        var projItem = findProjItem(clip);
        if (projItem) {
            projItem.setInPoint(clip.inPoint);
            projItem.setOutPoint(clip.outPoint);
            seq.audioTracks[clip.track.idx].overwriteClip(projItem, clip.start);
        }
    }
}

function addVideoClipsToSeq(seq, vidObj) {
    var projItem = findProjItem(vidObj);
    if (projItem){
        for (var i = 0; i < vidObj.clips.length; i++) {
            var clip = vidObj.clips[i];
            projItem.setInPoint(clip.in);
            projItem.setOutPoint(clip.out);
            seq.videoTracks[0].overwriteClip(projItem, clip.start);
            var audioClipIdx = seq.audioTracks[0].clips.numItems - 1;
            seq.audioTracks[0].clips[audioClipIdx].remove(true, true);
            var marker = seq.markers.createMarker(clip.start);
            marker.name = ("0000" + (i*10)).slice(-4);
        }
    }
    
}

function createAnimaticSeq (seqInfo) {
    var seq = app.project.createNewSequence(seqInfo.name, seqInfo.id);
    addVideoClipsToSeq(seq, seqInfo.video);
    var enoughAudioTracks = addMissingAudioTracks(seq, seqInfo.audio.numTracks);
    if (enoughAudioTracks) addAudioClipsToSeq(seq, seqInfo.audio.clips);

    return seq
}

function createShotStr(info, marker) {
    var shotNum = parseInt(marker.name, 10);
    var seqNum = (Math.floor(shotNum / 100) + 1) * 10;
    var shotStr = padZero(shotNum, 4);
    var seqStr = padZero(seqNum, 4);
    return info.program + "_S" + padZero(info.season, 2) +
        "E" + padZero(info.episode, 2) + "_SQ" + seqStr + "_SH" + shotStr
    
}

function createShotSupers (info) {
    var seq = app.project.activeSequence;
    var seqEnd = new Time();
    seqEnd.ticks = seq.end;
    if (!seq) return false;
    
    var mogrtPath = joinPath([info.extPath, 'mogrt', 'shotSuper_T02_v001.mogrt']);
    var mogrt = new File(mogrtPath);
    var importMogrtErr = false;
    
    markers = markersToArr(seq.markers);
    for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        if (!isNaN(parseInt(marker.name, 10))) {
            var seqMogrt = seq.importMGT(
                mogrt.fsName, // mogrt file to import
                marker.start.ticks, // sequence target time
                info.target - 1, // target video track
                0 // target audio track
            );
            if (seqMogrt) {
                var shotDur = 0;
                var shotEnd = new Time();
                if (i === markers.length - 1) {
                    shotEnd.seconds = seqEnd.seconds;
                    shotDur = Math.round((seqEnd.seconds - marker.start.seconds) * 25);
                } else {
                    shotEnd.seconds = markers[i+1].start.seconds;
                    shotDur = Math.round(
                        (shotEnd.seconds - marker.start.seconds) * 25
                    );
                }

                seqMogrt.end = shotEnd;
                var shotStr = createShotStr(info, marker);

                var mogrtComponent = seqMogrt.getMGTComponent();
                if (mogrtComponent) {
                    var props = mogrtComponent.properties;
                    var shotProp = props.getParamForDisplayName('shot');
                    if (shotProp) { shotProp.setValue(shotStr); }
                    var durProp = props.getParamForDisplayName('dur');
                    if (durProp) { durProp.setValue(padZero(shotDur, 4)); }

                    marker.name = shotStr;
                }
            } else {
                importMogrtErr = true;
                break;
            }
        }
    }
    if (importMogrtErr) return JSON.stringify(ERR_MOGRT_IMPORT)
    mogrt.close();

    return JSON.stringify(markers)


}

/* eslint-disable no-undef */

function getSequences() {
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
function assembleAnimaticSeq(seqInfo) {
    var animatic = createAnimaticSeq(seqInfo);

    return JSON.stringify(animatic)
}

function createSupers(info) {
    var markers = createShotSupers(info);
    return markers
}

function getNumberOfVideoTracks() {
    return getNumberOfVidTracks()
}

function exportClip() {
//     // var seq = app.project.activeSequence;
//     // if (!seq) return JSON.stringify(ERR_NO_ACTIVE_SEQUENCE)


//     // var presetPath = joinPath([ext, 'epr', 'sommelierAIFF.epr']);
//     // var preset = new File(presetPath);

    // return app.project.exportTimeline("SDK Export Controller")

    alert("x");
}


