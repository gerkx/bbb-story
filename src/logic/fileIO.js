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