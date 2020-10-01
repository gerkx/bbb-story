/* eslint-disable no-undef */
const cs = new CSInterface();


export const getSequences = () => {
    return new Promise((resolve, reject) => {
        cs.evalScript('getSequences()', function(payload) {
            const data = JSON.parse(payload);
            if (data.error) { return reject(data) }
            else { return resolve(data) }
        })
    })
} 