/* eslint-disable no-undef */
const cs = new CSInterface();
const fs = cep_node.require('fs');
const path = cep_node.require('path');

export const chooseFile = (extArr=[]) => {
    const opts = [
        false,
        false,
        "Cargar una secuencia en XML",
        '',
        extArr
    ];
    const loc = window.cep.fs.showOpenDialog(...opts)
    if (loc.err !== 0) return console.log('oops');
    if (loc) return loc.data[0]
    return null
}

export const locateFiles = (xmlPath, clipArr) => {
    const xmlDir = path.dirname(xmlPath);
    const xmlDirContents = fs.readdirSync(xmlDir);
    console.log(xmlDirContents)
    let prevDir = '';
    let prevDirContents = [];
    const linkedClips = clipArr.map(clip => {
        if (xmlDirContents.includes(clip.file.name)) {
            clip.file.path = path.join(xmlDir, clip.file.name)
        } else {
            clip.file.path = null;
            if (prevDirContents.includes(clip.file.name)) {
                clip.file.path = path.join(prevDir, clip.file.name)
            } else {
                const opts = [
                    false, 
                    false, 
                    `Localizar ${clip.file.name}`, 
                    xmlDir,
                    [path.extname(clip.file.name)]
                ]
                const loc = window.cep.fs.showOpenDialog(...opts);
                if (loc) {
                    const locPath = loc.data[0];
                    clip.file.path = locPath;
                    prevDir = path.dirname(locPath);
                    prevDirContents = fs.readdirSync(prevDir)
                }   
            }
        }
        return clip
    })
    console.log(linkedClips)
    const offlineClips = linkedClips.filter(clip => !clip.file.path)
        .map(clip => clip.file.name);
    if(offlineClips.length > 0){
        alert(`Los siguientes clips no tienen archivos vinculados y no serán importados: ${offlineClips.join(", ")}`)
    }

    return linkedClips.filter(clip => clip.file.path)
}

export const getPresets = () => {
    const extPath = cs.getSystemPath(SystemPath.EXTENSION);
    const presetPath = path.join(extPath, 'epr');
    const presets = fs.readdirSync(presetPath);
    const multiChan = presets.find(x=> x=="ProRes422_14Ch.epr");
    return {
        path: presetPath,
        presets: presets,
        model: multiChan
    }
}