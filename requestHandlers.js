/**
 * Created by cnstbmb on 30.10.2016.
 */

var path = require('path');
var appDir = path.dirname(require.main.filename);

var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable"),
    mv = require("mv");

var start = function (response, postData) {
    console.log('Request handler "start" was called');

    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" '+
        'content="text/html; charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/upload" enctype="multipart/form-data" '+
        'method="post">'+
        '<input type="file" name="upload">'+
        '<input type="submit" value="Upload file" />'+
        '</form>'+
        '</body>'+
        '</html>';

    response.writeHead(200, {'Content-Type':'text/html'});
    response.write(body);
    response.end();
};

var upload = function (response, request) {
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    console.log("about to parse");

    form.parse(request, function (error, fields, files) {
        console.log("Parsing done");

        /* Возможна ошибка в Windows: попытка переименования уже существующего файла */
        mv(files.upload.path, appDir+'/test.jpg', function (err) {
            if (err) { throw err; }
            console.log('file moved successfully');
        });
        // fs.rename(files.upload.path, appDir+'/test.jpg', function (err) {
        //     if(err){
        //         fs.unlink(appDir+'/test.jpg');
        //         fs.rename(files.upload.path, appDir+'/test.jpg')
        //     }
        // });
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received image : <br/>");
        response.write("<img src='/show' />");
        response.end();
    });
};

var show = function (response) {
    console.log('Request handler "show" was called');
    fs.readFile(appDir+'/test.jpg', 'binary', function (error, file) {
        if(error){
            response.writeHead(500, {"Content-Type": "text/plane"});
            response.write(error + '\n');
            response.end();
        }else{
            response.writeHead(200, {"Content-Type": "image/jpg"});
            response.write(file, 'binary');
            response.end();
        }
    })
};

exports.start = start;
exports.upload = upload;
exports.show = show;