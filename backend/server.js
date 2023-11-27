const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const SocketServer = require('ws').Server;
const http = require('http');


var corsOptions = {
  origin: "http://localhost:5173"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const {join} = require("path");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

/* routes */
require("./app/routes/user.routes")(app);
require("./app/routes/note.routes")(app);
require("./app/routes/category.routes")(app);

// upload a file
console.log(`upload dir: ${__dirname}/public/files/temp`);
app.use(
    fileUpload({
      useTempFiles: true,
      safeFileNames: true,
      preserveExtension: true,
      tempFileDir: `${__dirname}/public/files/temp`
    })
);

app.post('/api/upload', (req, res, next) => {
  let uploadFile = req.files.file;
  const name = uploadFile.name;
  console.log(name);
  //const md5 = fileUpload.md5();
  //const saveAs = `${md5}_${name}`;
  const saveAs = `${name}`;
    uploadFile.mv(`${__dirname}/public/files/${saveAs}`, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).json({ status: 'uploaded', name, saveAs });
  });
});


// Serve files from the public directory
app.use(express.static(join(__dirname, 'public/files')));

// Define a route to handle file requests
app.get('/api/files/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = join(__dirname, 'public', 'files', fileName);
    console.log(filePath);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file: ', err);
            res.status(404).send('File not found');
        }
    });
});

/* listening */
let PORT = 6969;
/*
function startServer() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${PORT} is already in use`);
    } else {
      // Handle other errors
      console.error(err);
    }
  });
}
*/

let httpServer = app.listen(6969, () => console.log(`Listening on ${ 6969 }`));

/* WEBSOCKET STILL TESTING
const wss = new SocketServer({server: httpServer});

const clients = [];
wss.on('message', (socket) => {
    console.log('thanks');
})
wss.on('connection', (socket) => {
    console.log('Client connected');

    clients.push(socket);
    // Send a welcome message to the client

    // Listen for messages from the client
    socket.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // Broadcast the message to all clients
        clients.forEach(function each(client) {
            if (client.readyState === wss.OPEN) {
                client.send(message);
            }
        });
    });

    // Handle socket closure
    socket.on('close', () => {
        console.log('Client disconnected');
    });
});
*/