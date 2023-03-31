import subprocess

command = "ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 serveo.net"
process = subprocess.Popen(command.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)

while True:
    output = process.stdout.readline()
    if not output and process.poll() is not None:
        break
    if output:
        if b"Are you sure you want to continue" in output:
            print('okeh')
            process.stdin.write(b"yes\n")
            process.stdin.flush()
        print(output.decode().strip())
