const express = require("express");
const fs = require("fs");
const path = require("path");  
const database = require('./db/db.json'); 
const uuid = require("uuid");

var app = express();
var PORT = process.env.PORT || 3000; 

app.use(express.static('public')); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
}); 

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
}); 

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname,'index.html'));
}); 

app.get('/api/notes', function (req, res) {
    fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, data) {
      if (error) {
        return console.log(error)
      }
      data = JSON.parse(data)
  
      return res.json(data)
    })
  }); 

  app.post("/api/notes", function (req, res) {
    let allNotes = [];
    let newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuid.v4(),
    }
    fs.readFile(__dirname + "/../db/db.json", (err, data) => {
        if (err) throw err;
        allNotes = JSON.parse(data);
        allNotes.push(newNote);
        fs.writeFile(__dirname + "/../db/db.json", JSON.stringify(allNotes), "utf-8", (err) => {
            if (err) throw err;
            console.log("The note has been saved.")
            res.end();
        })
    })
    console.log(newNote)
}); 

app.listen(PORT, function () {
    console.log(`App is listening on PORT: ${PORT}`);
  });