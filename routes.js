var fs = require('fs'),
  request = require('request'),
  kittydar = require("./kittydar/kittydar"),
  Canvas = require("./kittydar/node_modules/canvas"),
  Image = Canvas.Image,
  lwip = require("lwip");

var files = fs.readdirSync("/kittyface/kittens");
var numFiles = files.length;

var download = function (uri, ext) {
  request.get({
    url: uri,
    encoding: null
  }, function (err, res, body) {
    var image = new Image();

    image.onerror = function (err) {
      console.error(err);
    };

    image.onload = function () {
      var canvas = new Canvas(image.width, image.height);
      var ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0);
      var cats = kittydar.detectCats(canvas);
      console.log("Found", cats);
      if (!cats) {
        return;
      }
      var cat = null;
      for (var i = 0; i < cats.length; i++) {
        if (!cat || cat.value < cats[i].value) {
          cat = cats[i];
        }
      }

      if (!cat) {
        return;
      }

      lwip.open(body, ext, function (err, image) {
        if (err) {
          return;
        }

        image.crop(cat.x, cat.y, cat.x + cat.width, cat.y + cat.height, function (err, result) {
          var filepath = "/kittyface/kittens/" + numFiles + "." + ext;
          numFiles += 1;
          result.scale(200.0 / result.width(), function (err, toSave) {
            toSave.writeFile(filepath, function (err, result) {
              console.log("Wrote", filepath);
              files = fs.readdirSync("/kittyface/kittens");
            });
          });
        });
      });
    }

    image.src = body;
  });
};

var randInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = function (app) {
  app.post("/process", function (req, res) {
    var post = req.body;
    var urls = post["urls"];
    for (var i = 0; i < urls.length; i++) {
      var uri = urls[i];
      var ext = uri.substring(uri.lastIndexOf(".") + 1);
      download(uri, ext);
    }

    res.status(200).json({
      "processed": post["urls"].length
    });
  });

  app.get("/images", function (req, res) {
    res.status(200).json({
      "images": numFiles
    });
  });

  app.get("/random", function (req, res) {
    res.sendFile("/kittyface/kittens/" + files[randInt(0, files.length)]);
  });
};
