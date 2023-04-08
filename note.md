# untuk menjalankan index html sebagai service http
php -S localhost:8080

# untuk menjalan kan port forwading tcp menggunakan openssh / openssh-server
sudo apt-get install openssh-server / brew install openssh

ssh -R 80:localhost:4000 serveo.net


#crontab dijalankan dengan perintah berikut
@reboot cd /home/puput/skripsi_face_recognition_raspi-/server_facerecog/ && /usr/local/bin/node server.js >> /home/puput/nodeServer.log 2>&1 &
@reboot sleep 1m && /snap/bin/ngrok http 3001 --authtoken 2NOkZdYZriDRKWHtmkbSZ1r68UP_4y6sJ5jWGja4xLCHumjng
@reboot sleep 2m && cd /home/puput/skripsi_face_recognition_raspi-/server_facerecog/ && /usr/local/bin/node startTunnel.js >> /home/puput/startTunnel.log 2>&1 
@reboot sleep 3m && cd /home/puput/skripsi_face_recognition_raspi-/face_recognition-skripsi/getIPESP32CAM && /usr/local/bin/node getIpAddressESP32CAM.js >> /home/puput/getESP32CAM.log 2>&1 
@reboot sleep 4m && cd /home/puput/skripsi_face_recognition_raspi-/face_recognition-skripsi && /usr/bin/python3 main.py >> /home/puput/main.log 2>&1 

