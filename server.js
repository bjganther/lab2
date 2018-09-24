const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')


require('cross-fetch/polyfill');

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); 
const host = '127.0.0.1';
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const API_KEY = "612d52d0-b77f-11e8-bf0e-e9322ccde4db";


let comments = {};
let helper = [];

// behavior for the index route
app.get('/', (req, res) => {
  const url = `https://api.harvardartmuseums.org/gallery?size=100&apikey=${API_KEY}`;
  fetch(url)
  .then(response => response.json())
  .then(data => {
    res.render('index', {galleries: data.records});
  });
});



app.get('/gallery/:gallery_id', function(req, res) {
  //res.send("hello");
  //res.send(`You are on gallery ${req.params.gallery_id}`);
  galleryurl= `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&gallery=${req.params.gallery_id}`
    console.log("what");
    fetch(galleryurl)
  .then(response => response.json())
  .then(data => {
  
    //logic for calling comments from local storage
    res.render('gallery', {objects: data.records});
    //showObjectsTable(req.params.gallery_id, {}));

    //local storage

    //instead of writing to database, write it to local storage
   
    
  });
});


/*
app.get('/gallery/:gallery_id', function(req, res) {
  //res.send("hello");
  //res.send(`You are on gallery ${req.params.gallery_id}`);
    console.log(req.params.gallery_id);
    galleryurl= `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&gallery=${req.params.gallery_id}`;
    let alldata = getGallery(galleryurl, helper)
    .then(console.log(alldata))
    .then(
    res.render('gallery', {objects: alldata}));
   
    

});
*/
app.get('/object/:object_objectnumber', function(req, res) {
  //res.send("hello");
  //res.send(`You are on gallery ${req.params.gallery_id}`);
  objecturl= `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&objectnumber=${req.params.object_objectnumber}`
    console.log("what");
    fetch(objecturl)
  .then(response => response.json())
  .then(data => {
    //logic for calling comments from local storage
    comments["one"] =["comment1", "comment2", "comment3"];
    //comments[`${req.params.object_objectnumber}`] = [{thisname: "name1", thiscomment: "comment2"}, {thisname: "name2", thiscomment:"comment2"}];
    console.log(comments);
    console.log("Middle");
    console.log( comments[`${req.params.object_objectnumber}`]);
    res.render('object', {objects: data.records, commentssection: comments[`${req.params.object_objectnumber}`]});
    //showObjectsTable(req.params.gallery_id, {}));

    //local storage

    //instead of writing to database, write it to local storage
   
    
  });
});


  
/*app.get('/object/:object_objectnumber',function(req,res){
  console.log("helllooooooo");
  //console.log(req.body.thiscomment);
  //comments[`${req.params.object_objectnumber}`].push(req.body.thiscomment);
  //console.log(comments[`${req.params.object_objectnumber}`]);
  res.render('object', {topicHead: 'Create Comment'});
  
  });*/

  app.post('/object/:object_objectnumber',function(req,res){
    let addcomment = req.body;
    console.log(addcomment);
    let num = req.params.object_objectnumber;
    console.log("byeee");
   
    comments[`${num}`].push(addcomment);
    console.log(comments[`${num}`]);
    res.redirect(`/object/${num}`);
  });


app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}/`);
});





 function getGallery(galleryurl, thehelper) {
    console.log("no");
    fetch(galleryurl)
    .then(response => response.json())
    .then(data => {
      data.records.forEach(object=> {
  
        thehelper.push(object);
   
      });
    if (data.info.next) {
        getGallery(data.info.next, thehelper);
        console.log("repeat");
    }
})
    console.log("64");
    return thehelper;

    
  
}

/*

function showObject(objectnumber ) {

 
  

  console.log("hello");
  document.querySelector("#all-objects").style.display = "none";
  document.querySelector("#all-galleries").style.display = "none";
  document.querySelector("#this-object").style.display = "block";
  objecturl= `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&objectnumber=${objectnumber}`
  fetch(objecturl)
  .then(response => response.json())
  .then(data => {
  data.records.forEach(object=> {
      document.querySelector("#object").innerHTML = `
      <li>
          <a href="#object_${object.objectnumber}" onclick="showObject(${object.objectnumber})">
           ${object.title}</a>
           Object #${object.objectnumber} (Description ${object.description})(Provenance ${object.provenance})
          (Accession Year ${object.accessionyear}) 
          </a>
          <a href="${object.url}">Website</a>
          <img src =${object.primaryimageurl} style = "width: 500px; height: 600px">
      </li>
      `;
      document.querySelector("#object-title").innerHTML= object.title;

  });
  if (data.info.next) {
      showObjectsTable(data.info.next);
  }
  })
  document.querySelector(".a").style.color= "green"; 
  document.querySelector('button').style.color="crimson";
}
*/