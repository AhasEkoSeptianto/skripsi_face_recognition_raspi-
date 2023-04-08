import socket

# Mendapatkan alamat IP v4 dari mesin
def get_ipv4_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(('8.8.8.8', 80))  # Memilih DNS server Google sebagai sumber
    ip_address = s.getsockname()[0]
    s.close()
    return ip_address

IPADDRESS = get_ipv4_address()
#print(IPADDRESS)

# network={
#         ssid="poccox3"
#         psk=195ea4755841024ccdd92047df222923c9320e799d12f6312ffcc5ffc4b3cbce
# }
