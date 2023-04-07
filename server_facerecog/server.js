const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const chokidar = require('chokidar');
const path = require('path');
const cors = require('cors')
const ip  = require('ip')

// middleware untuk mengakses file statis
app.use(express.static(__dirname + '/public'));
app.use(cors())
//console.log("enabling cors...")

// route untuk halaman utama
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
//	res.send({ msg: "success" });
});


app.get('/getIp', function (req, res){
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  console.log(ip)
  res.send({ msg: "Okeh" })
})

//console.log(ip.address())

const dirs_unknowFace = './../face_recognition-skripsi/unknowFace/';
const dirs_knowFace = './../face_recognition-skripsi/dataSet/'
const fs = require('fs');

const readFileImage = (file_list) => {
  let listFile = []
  file_list.forEach((img, idx) => {
    const file = fs.readdirSync(dirs_unknowFace)[idx];
    const filePath = path.join(dirs_unknowFace, file);

    const base64Image = fs.readFileSync(filePath, { encoding: 'base64' });
    listFile.push(base64Image)
  })
  return listFile
}

function readCapture() {
  let imageData = fs.readFileSync('./../face_recognition-skripsi/capture.txt', 'utf8');
  return imageData;
}

// koneksi socket
io.on('connection', function(socket) {
  console.log('Client terhubung.');

  let fileList = []
  // menggunakan chokidar untuk memonitor direktori
  const watcher = chokidar.watch(dirs_unknowFace);
  watcher
    .on('add', () => {
      updateFileList();
    })
    .on('unlink', () => {
      updateFileList();
    });

  // fungsi untuk mengambil daftar file dari direktori
  function getFileList() {
    return new Promise((resolve, reject) => {
      fs.readdir(dirs_unknowFace, (err, files) => {
        if (err) reject(err);
        resolve(files);
      });
    });
  }

  // fungsi untuk mengupdate daftar file dan mengirim ke socket
  async function updateFileList() {
    try {
      const files = await getFileList();
      fileList = files;
      let listBase64Img = readFileImage(fileList)
      socket.emit('count_unknowFace', {
        total: fileList.length,
        allFiles: fileList,
        image: listBase64Img
      });
    } catch (err) {
      console.error(err);
    }
  }

  // inisialisasi daftar file
  updateFileList();
  
  // capture cctv
  setInterval(() => {
    let imageData = readCapture();
    socket.emit('imageData', imageData);
  }, 1000);

  // event untuk save new face
  socket.on("saveFace", data => {
    fs.rename(dirs_unknowFace + data?.fileName, dirs_knowFace + data?.name + '.png', function(err, data){
      if (err){
        socket.emit("saveFaceSuccess", "fail")
      }else{
        socket.emit("saveFaceSuccess", "success")
      }
    })
  })

  // event untuk disconnect
  socket.on('disconnect', function() {
    console.log('Client terputus.');
    watcher.close();
  });
});

// jalankan server
server.listen(3001, "0.0.0.0" , function() {
  console.log('Server berjalan pada port 3000');

	//require("./startTunnel")
});
