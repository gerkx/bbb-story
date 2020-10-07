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