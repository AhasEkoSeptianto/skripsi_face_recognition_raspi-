import websocket

websocket_url = "ws://192.168.100.27/websocket"

with open('IPESP32CAM.txt') as f:
    IP = f.read()
    websocket_url = "ws://"+ IP + "/websocket"

img_base64 = ""

def on_message(ws, message):
	global img_base64
	print(img_base64)
	img_base64 = message

def on_openWs(ws):
	print("connected ws")

ws = websocket.WebSocketApp(websocket_url, on_message=on_message)
ws.onOpen = on_openWs

ws.run_forever()



while True:
	print(img_base64)
