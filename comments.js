// Create web Server

var http = require("http");
var url = require("url");
var fs = require("fs");
var qs = require("querystring");

// 1. Create Server
var server = http.createServer(function(request, response) {
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj.pathname;
    if (pathname == "/") {
        // 2. Read file
        var fileContent = fs.readFileSync("comment.html");
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(fileContent);
    } else if (pathname == "/post") {
        var str = "";
        request.on("data", function(chunk) {
            str += chunk;
        });
        request.on("end", function() {
            var obj = qs.parse(str);
            console.log(obj);
            var date = new Date();
            obj.time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            var comment = JSON.stringify(obj);
            fs.readFile("comment.json", function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    var commentArr = JSON.parse(data);
                    commentArr.unshift(obj);
                    var commentStr = JSON.stringify(commentArr);
                    fs.writeFile("comment.json", commentStr, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            response.writeHead(200, { "Content-Type": "text/plain" });
                            response.end(commentStr);
                        }
                    });
                }
            });
        });
    } else if (pathname == "/get") {
        fs.readFile("comment.json", function(err, data) {
            if (err) {
                console.log(err);
            } else {
                response.writeHead(200, { "Content-Type": "text/plain" });
                response.end(data);
            }
        });
    } else {
        var fileContent = fs.readFileSync("comment.html");
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end(fileContent);
    }
});

// 3. Listen port
server.listen(8080, "localhost");