const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const chokidar = require("chokidar");
const path = require("path");
const cors = require("cors");
const ip = require("ip");
const sendPushNotification = require("./sendPushNotification");

// middleware untuk mengakses file statis
app.use(express.static(__dirname + "/public"));
app.use(cors());
//console.log("enabling cors...")

// route untuk halaman utama
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
  //	res.send({ msg: "success" });
});

app.get("/getIp", function (req, res) {
  var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log(ip);
  res.send({ msg: "Okeh" });
});

//console.log(ip.address())

const dirs_unknowFace = "./../face_recognition-skripsi/unknowFace/";
const dirs_knowFace = "./../face_recognition-skripsi/dataSet/";
const fs = require("fs");

const readFileImageUnknowFace = (file_list) => {
  let listFile = [];
  file_list.forEach((img, idx) => {
    const file = fs.readdirSync(dirs_unknowFace)[idx];
    const filePath = path.join(dirs_unknowFace, file);

    const base64Image = fs.readFileSync(filePath, { encoding: "base64" });
    listFile.push(base64Image);
  });
  return listFile;
};

const readFileImageKnowFace = (file_list) => {
  let listFile = [];
  file_list.forEach((img, idx) => {
    const file = fs.readdirSync(dirs_knowFace)[idx];
    const filePath = path.join(dirs_knowFace, file);

    const base64Image = fs.readFileSync(filePath, { encoding: "base64" });
    listFile.push(base64Image);
  });
  return listFile;
};

function readCapture() {
  let imageData = fs.readFileSync(
    "./../face_recognition-skripsi/capture.txt",
    "utf8"
  );
  return imageData;
}

// koneksi socket
io.on("connection", function (socket) {
  console.log("Client terhubung.");

  let fileList = [];
  // menggunakan chokidar untuk memonitor direktori
  const watcher = chokidar.watch(dirs_unknowFace);
  const watcherKnowface = chokidar.watch(dirs_knowFace);
  watcher
    .on("add", () => {
      updateFileList();
      sendPushNotification.sendPushNotification(
        "Peringatan !!",
        "Terdeteksi wajah seseorang yang tidak dikenal"
      );
    })
    .on("unlink", () => {
      updateFileList();
    });

  watcherKnowface.on("unlink", () => {
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

  function getKnowingFace() {
    return new Promise((resolve, reject) => {
      fs.readdir(dirs_knowFace, (err, files) => {
        if (err) reject(err);
        resolve(files);
      });
    });
  }

  // fungsi untuk mengupdate daftar file dan mengirim ke socket
  async function updateFileList() {
    try {
      const unknowFace = await getFileList();
      const knowingFace = await getKnowingFace();

      fileLists = unknowFace;
      let listBase64Img = readFileImageUnknowFace(fileLists);
      socket.emit("count_unknowFace", {
        total: fileLists.length,
        allFiles: fileLists,
        image: listBase64Img,
      });

      let listBase64ImgKnowFaces = readFileImageKnowFace(knowingFace);
      socket.emit("knowFaces", {
        total: unknowFace.length,
        allFiles: knowingFace,
        image: listBase64ImgKnowFaces,
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
    socket.emit("imageData", imageData);
  }, 1000);

  // event untuk save new face
  socket.on("saveFace", (data) => {
    const sourcePath = dirs_unknowFace + data?.fileName;
    const destinationPath = `${dirs_knowFace}${data?.name}_${data.fileName}.png`;

    fs.copyFile(sourcePath, destinationPath, (err) => {
      if (err) return socket.emit("saveFaceSuccess", "fail");

      fs.unlink(sourcePath, (err) => {
        if (err) {
          socket.emit("saveFaceSuccess", "fail");
        } else {
          socket.emit("saveFaceSuccess", "success");
        }
      });
    });
  });

  // socket untuk hapus
  socket.on("deleteFace", (data) => {
    const fileSrc = `${dirs_knowFace}${data.fileName}`;
    fs.unlink(fileSrc, (err) => {
      if (err) {
        socket.emit("deleteFace", "fail");
      } else {
        socket.emit("deleteFace", "success");
      }
    });
  });

  // event untuk disconnect
  socket.on("disconnect", function () {
    console.log("Client terputus.");
    watcher.close();
  });
});

// jalankan server
server.listen(3001, "0.0.0.0", function () {
  console.log("Server berjalan pada port 3000");

  //require("./startTunnel")
});
