const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'points.json');

app.use(bodyParser.json());

let points = [];

if (fs.existsSync(DATA_FILE)) {
    points = JSON.parse(fs.readFileSync(DATA_FILE));
}

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/save-point', (req, res) => {
    const { lat, lng } = req.body;
    const newPoint = {
        id: points.length,
        lat,
        lng,
        datetime: new Date().toISOString()
    };

    points.push(newPoint);
    fs.writeFileSync(DATA_FILE, JSON.stringify(points));
    res.json(newPoint);
});

app.get("/", (req, res) =>{
    res.sendFile('C:\\Users\\diyar\\Desktop\\samm150324\\frontend\\index.html')
});

app.get('/points/points', (req, res) => {
    res.json(points);
});

app.delete('/delete-point/:id', (req, res) => {
    const { id } = req.params;
    points = points.filter(point => point.id !== parseInt(id));
    fs.writeFileSync(DATA_FILE, JSON.stringify(points));
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
