import subprocess

ssid = "poccox3"
psk = "123456789"

# menjalankan perintah dengan hak akses superuser/root
subprocess.call(f"sudo sed -i '/ssid=\".*\"/c\ssid=\"{ssid}\"' /etc/wpa_supplicant/wpa_supplicant.conf", shell=True)
subprocess.call(f"sudo sed -i '/psk=\".*\"/c\psk=\"{psk}\"' /etc/wpa_supplicant/wpa_supplicant.conf", shell=True)
