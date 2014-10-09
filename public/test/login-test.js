/**
 * Created by bisconti on 09/10/14.
 */

var Nightmare = require('nightmare');
var gsTransfer = require('./nightmare-gstransfer');
new Nightmare()
    .use(gsTransfer.login('F00000001', 'P@$$w0rd'))
    //.use(gsTransfer.task(instructions, uploads, path))
    .run(function (err, nightmare) {
        if (err) {return console.log(err);}
        console.log('Done!');
    });