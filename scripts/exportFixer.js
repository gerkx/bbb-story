const fs = require('fs');

fs.readFile('com.gerkx.bbb-story/jsx/extendscript.jsx', 'utf8', function(err, data){
    if(err) {
        return console.log(err);
    }
    const reg = /export.+;/g;
    const res = data.replace(reg, "");
    fs.writeFile("com.gerkx.bbb-story/jsx/extendscript.jsx", res, 'utf8', function (err) {
        if (err) return console.log(err);
     });
})