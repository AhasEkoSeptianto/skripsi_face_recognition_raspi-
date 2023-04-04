import sys
import subprocess
from pymongo import MongoClient
import time

#sys.path.append('..')
from networkCheck import CheckNetwork


dirs = "/home/puput/skripsi_face_recognition_raspi-/"
# check connection
network = False

while True:
   network = CheckNetwork()
   with open(dirs + 'connection.txt', "w") as f:
       print(str(network))
       f.write(str(network))

   if (network):
       break
   else:
       print('connection refuces')

# db config
cluster = MongoClient("mongodb+srv://ahaseko:aaseko100465@cluster0.hqm02.mongodb.net/skripsi?retryWrites=true&w=majority")
db = cluster['skripsi']
col = db['raspi_configs']

host = ""
raspiID = ""

with open(dirs + 'raspiID.txt') as f:
    contents = f.read()
    raspiID = contents

def SaveServer():

    with open(dirs + 'serverMobileuri.txt', "w") as f:
        f.write(host)

    data = col.find_one({ "raspi_id": raspiID })
    if (data):
        col.find_one_and_update({ "raspi_id": raspiID }, { "$set": {"mobileAppsCon": host}})
        
    else:
        print("raspi not found")


#time.sleep(60)

while True:
    command = "ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 serveo.net"
    process = subprocess.Popen(command.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    output = process.stdout.readline()
    print('output > ', output)
    if not output and process.poll() is not None:
        break
    if output:
        if b"Are you sure you want to continue" in output:
            print('okeh')
            process.stdin.write(b"yes\n")
            process.stdin.flush()
        host = output.decode().strip()
        print(host)
        SaveServer()
        if (host != ""):
            break

