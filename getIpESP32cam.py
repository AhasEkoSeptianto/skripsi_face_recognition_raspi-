import subprocess
import re
import requests

# Jalankan perintah ifconfig dan ambil outputnya
output = subprocess.check_output(["ifconfig"]).decode()

# Cari baris yang mengandung "inet " dan "192."
for line in output.split('\n'):
    if "inet " in line and "192." in line:
        # Ambil alamat IP dari baris tersebut
        ip = line.split(' ')[1]

        # Jika ada beberapa alamat IP, ambil yang pertama
        if ',' in ip:
            ip = ip.split(',')[0]
        
        # Keluar dari loop setelah alamat IP ditemukan
        break

# print(ip)  # Output: alamat IP dari interface yang sedang aktif dengan format 192.xxx.xxx.xxx
rangeIP = ip.split('.')
rangeIP = rangeIP[0] + "." + rangeIP[1] + "." + rangeIP[2] + "." + "1/24"


# Jalankan perintah nmap untuk mencari alamat IP dari modul ESP32CAM
nmap_output = subprocess.check_output(["sudo", "nmap", "-sn", rangeIP])
# # Ambil alamat IP dari hasil nmap
ip_address = nmap_output.decode('utf-8').split(').')
macAddStart1 = "24:0A:C4"
# macAddStart2 = "30:AE:A4"
macAddStart2 = "8C:D9:D6"

idx = 0
ip = ""
for n in ip_address:
    if macAddStart1 in n or macAddStart2 in n:
        # print(n, idx - 1)
        
        ip = ip_address[idx-1]
        ip = re.findall(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', ip)[0]
        # print(ip)
    idx += 1

# check falid url
def check_url(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return True
        else:
            return False
    except:
        return False
    
print(ip)
isValid = check_url("http://" + ip + "/capture")

# # Simpan alamat IP ke dalam file ipaddress.txt
if isValid:
    with open("ipaddress.txt", "w") as f:
        f.write(ip_address)