/* eslint-disable no-undef */
export function getSep() {
    if(Folder.fs == 'Macintosh'){
        return '/';
    }else{
        return '\\';
    }
}

export function joinPath(pathSectionArr) {
    var path = "";
    for (var i = 0; i < pathSectionArr.length; i++) {
        if (i == 0) {
            path += pathSectionArr[i]
        } else {
            path += getSep() + pathSectionArr[i]
        }
    }
    return path
}

export function padZero(num, zeros) {
    var base = ""
    for (var i = 0; i < parseInt(zeros, 10); i++) {
        base += "0"
    }
    num = num.toString();
    return (base + num).slice(-(parseInt(zeros, 10)))
  }

export function pad2(num) {
    return padZero(num, 2)
}

export function pad3(num) {
    return padZero(num, 3)
}

export function pad4(num) {
    return padZero(num, 4)
}