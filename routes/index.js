//#region eski
var express = require('express');
var router = express.Router();

const fs = require("fs");

// dinamik route yapısını oluştur 
// eslint-disable-next-line no-undef
let routes = fs.readdirSync(__dirname);
for (let route of routes) {
    // js dosyalarını adını index.js dosyasını hariç  alıp route yapısı oluşturuyoruz56
    if (route.includes(".js") && route !== "index.js") {
        const routePath = route.replace(".js", "");  // dosya ismini alıp .js ifadesini siliyor
        const routeModule = require('./' + route);   // Route modülünü dinamik olarak yükle
        router.use(`/${routePath}`, routeModule);    // `/routeName` şeklinde kullan
    }
}

module.exports = router;
//#endregion

