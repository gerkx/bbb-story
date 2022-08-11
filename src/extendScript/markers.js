export function markersToArr(markerColl) {
    // alert(markerColl.numMarkers)
    var arr = [];
    var curr = null;
    for (var i = 0; i < markerColl.numMarkers; i++) {
        if (i === 0) { 
            curr = markerColl.getFirstMarker();
            arr.push(curr)
         } else {
             curr = markerColl.getNextMarker(curr);
             arr.push(curr)
         }
    }
    return arr
}