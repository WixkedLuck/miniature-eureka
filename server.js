const express= require('express');
const notes = require('./db/db.json');
const fs = require('fs'); 
const path = require('path'); 
const PORT = process.env.Port || 3001; 
const app =express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public')); 



// API routes

//Get Request 
app.get('/api/notes', (req,res) => {
    res.json(notes); 
    console.info(`${req.method} request received`);
}); 
//Post Request 
app.post('/api/notes', (req,res) => {
    console.info(`${req.method} request received`);
    req.body.id =notes.length; 
    const latestNote = req.body; 
    notes.push(latestNote); 
    fs.writeFileSync(
        path.join(__dirname, '/db/db.json'),
        JSON.stringify(notes, null, 2)
    );
    res.json(latestNote);
})

//Delete Request
app.delete('/api/notes/:id', (req,res) => {
const deletePost = req.params.id; 
notes.splice(deletePost, 1); 
//Update ids when deleted 
for( i=0; i < notes.length; i++){
    notes[i].id=i;
}
// rewrite to file
fs.writeFileSync(
    path.join(__dirname, '/db/db.json'),
    JSON.stringify(notes,null, 2)
);
res.json(req.body); 
});



// Routes for html 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,"/public/index.html"));
});

app.get('/notes',(req,res) => {
    res.sendFile(path.join(__dirname,"/public/notes.html"));
});


app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname,"/public/index.html"));
});
//Listener 
app.listen(PORT, () => {
    console.log(`Now listening at ${PORT}`); 
}); 