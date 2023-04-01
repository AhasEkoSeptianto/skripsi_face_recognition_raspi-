import subprocess
from pymongo import MongoClient

# db config
cluster = MongoClient("mongodb+srv://ahaseko:aaseko100465@cluster0.hqm02.mongodb.net/skripsi?retryWrites=true&w=majority")
db = cluster['skripsi']
col = db['raspi_configs']



command = "ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 serveo.net"
process = subprocess.Popen(command.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
host = ""
raspiID = ""

with open('./../raspiID.txt') as f:
    contents = f.read()
    raspiID = contents

def SaveServer():
    data = col.find_one({ "raspi_id": raspiID })
    if (data):
        col.find_one_and_update({ "raspi_id": raspiID }, { "$set": {"mobileAppsCon": host}})
        
    else:
        print("raspi not found")
    
    

while True:
    output = process.stdout.readline()
    print(output)
    if not output and process.poll() is not None:
        break
    if output:
        if b"Are you sure you want to continue" in output:
            print('okeh')
            process.stdin.write(b"yes\n")
            process.stdin.flush()
        host = output.decode().strip()
        
        SaveServer()
