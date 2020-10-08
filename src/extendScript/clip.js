/* eslint-disable no-undef */

export function findProjItemByNodeId(nodeId) {
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

export function findProjItemByName(name) {
    var baseName = name.split('.')[0]
    var projItems = app.project.rootItem.children;
    return search(projItems, baseName);

    function search(projItem, clipName) {
        // var PROJECT_ITEM_CLIP = 1;
        var PROJECT_ITEM_BIN = 2;
        
        for (var i = 0; i < projItem.numItems; i++) {
            var item = projItem[i];
            if (item.type == PROJECT_ITEM_BIN) {
                var found = search(item.children, clipName)
                if (found) return found
            } else {
                if (item.name === clipName) {
                    return item
                }
            }
        }
    }
}

export function findProjItemByPath(mediaPath) {
    // var baseName = name.split('.')[0]
    var projItems = app.project.rootItem.children;
    return search(projItems, mediaPath);

    function search(projItem, mediaPath) {
        // var PROJECT_ITEM_CLIP = 1;
        var PROJECT_ITEM_BIN = 2;
        
        for (var i = 0; i < projItem.numItems; i++) {
            var item = projItem[i];
            if (item.type == PROJECT_ITEM_BIN) {
                var found = search(item.children, mediaPath)
                if (found) return found
            } else {
                if (item.getMediaPath() === mediaPath) {
                    return item
                }
            }
        }
    }
}

export function findProjItem(clip) {
    var projItem = null;
    if ('projectItem' in clip) {
        projItem = findProjItemByNodeId(clip.projectItem.nodeId)
    } else {
        if ('file' in clip) projItem = findProjItemByName(clip.file.name);
    }
    if (!projItem) {
        projItem = importClip(clip);
    }
    return projItem
}



export function importClip(clip) {
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