import subprocess

command = "ssh -R 80:localhost:3000 serveo.net"
process = subprocess.Popen(command.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)

while True:
    output = process.stdout.readline()
    if not output and process.poll() is not None:
        break
    if output:
        print('yess')
        print(output.decode().strip())
