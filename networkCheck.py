import socket

def CheckNetwork():
    try:
        socket.setdefaulttimeout(3)
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(("8.8.8.8", 53))
        s.close()
        return True
    except:
        return False

#while True:
#    network = CheckNetwork()
#    with open('connection.txt', "w") as f:
#        f.write(str(network))
#    if (network):
#        print("connect")
#    else:
#        print("not connect")
