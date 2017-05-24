'use strict'

const express = require('express');
const expressFileUpload = require('express-fileupload');

const app = express();

app.use(express.static('public'));

app.use((request, response, next) => {
  console.log(request.method + " " + request.url + " " + request.params);
  next();
})

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.use(expressFileUpload({
  safeFileNames: true
}));

app.post("/upload", function (request, response) {
  console.log(request.files);
  let uploaded = [];
  let files = request.files.upload;
  
  if (!Array.isArray(files)) {
    files = [files];
  }
  
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    
    uploaded.push({
      "filename": file.name,
      "bytesize": file.data.length,
      "encoding": file.encoding,
      "mimetype": file.mimetype
    });
  }
  
  response.json(JSON.stringify({"files": uploaded}));
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
