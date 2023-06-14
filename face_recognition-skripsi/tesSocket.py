import websocket

def on_message(ws, message):
    # Callback function untuk menangani pesan yang diterima
    print(f"Received message: {message}")

def on_error(ws, error):
    # Callback function untuk menangani kesalahan
    print(f"Error: {error}")

def on_close(ws):
    # Callback function untuk menangani penutupan koneksi
    print("Connection closed")

def on_open(ws):
    # Callback function untuk menangani pembukaan koneksi
    print("Connection opened")

# URL WebSocket server
websocket_url = "ws://192.168.100.27/websocket"

# Inisialisasi WebSocket client
ws = websocket.WebSocketApp(websocket_url,
                            on_message=on_message,
                            on_error=on_error,
                            on_close=on_close)
ws.on_open = on_open

# Jalankan client dalam mode asinkron
ws.run_forever()