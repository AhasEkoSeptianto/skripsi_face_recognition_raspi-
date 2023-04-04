import sys
import subprocess
from pymongo import MongoClient
import time

#sys.path.append('..')
from networkCheck import CheckNetwork


# dirs = "/home/puput/skripsi_face_recognition_raspi-/"
dirs = ""
# check connection
network = False

while True:
   network = CheckNetwork()
   with open(dirs + 'connection.txt', "w") as f:
    #    print(str(network))
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
isHaveSave = False

with open(dirs + 'raspiID.txt') as f:
    contents = f.read()
    raspiID = contents

def SaveServer():
    global isHaveSave
    with open(dirs + 'serverMobileuri.txt', "w") as f:
        f.write(host)

    if (not isHaveSave):

        data = col.find_one({ "raspi_id": raspiID })
        if (data):
            col.find_one_and_update({ "raspi_id": raspiID }, { "$set": {"mobileAppsCon": host}})
            isHaveSave = True
        else:
            print("raspi not found")

process = False

while not process :
    command = "ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 serveo.net"
    process = subprocess.Popen(command.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)


while True:    
    output = process.stdout.readline()
    
    if not output and process.poll() is not None:
        break
    
    if output:
        if b"Are you sure you want to continue" in output:
            process.stdin.write(b"yes\n")
            process.stdin.flush()
        host = output.decode().strip()
        
        SaveServer()
        print(host)
