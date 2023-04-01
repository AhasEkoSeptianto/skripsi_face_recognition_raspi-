import cv2
import numpy as np
import face_recognition
import os
from PIL import Image
import requests
import base64


# set config webcam
URL = "http://192.168.100.27/cam-lo.jpg"
# video_capture = cv2.VideoCapture(URL + ":81/stream")
# video_capture = cv2.VideoCapture(URL + "/capture")
# video_capture.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
# video_capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

# setup dataset
dataSet = []
listDir = os.listdir('./dataSet')
faceName = []
isUnkowFace = False

# untuk update dataset
def setup_dataSet():
    for files in listDir:
        pict = face_recognition.load_image_file('dataSet/' + files)
        face_locations_pict = face_recognition.face_locations(pict)
        face_encodings = face_recognition.face_encodings(pict, face_locations_pict)

        for face in face_encodings:
            dataSet.append(face)
        
    isUnkowFace = False

# menyimpan wajah yang tidak diketahui
def SaveUnknowFaces(frame, face_locations):
    # Iterate through each face location
    for face_location in face_locations:
        # Extract the coordinates of the face location
        top, right, bottom, left = face_location

        # Extract the face image from the original image
        face_image = frame[top:bottom, left:right]

        # Convert the face image to PIL format
        pil_image = Image.fromarray(face_image)

        # Save the face image
        pil_image.save(f"unknowFace/{left}_{top}_{right}_{bottom}.jpg")

    setup_dataSet()


setup_dataSet()

# 
while True:
    dataSets = dataSet
    # ret, frame = video_capture.read()

    response = requests.get(URL)
    img_array = np.array(bytearray(response.content), dtype=np.uint8)
    frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    

    small_frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
    
    face_locations = face_recognition.face_locations(small_frame)
    face_encodings = face_recognition.face_encodings(small_frame, face_locations)
    
    faceName = []

    # bandingkan kedua encoding wajah
    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(dataSets, face_encoding)

        if True in matches:
            first_match_index = matches.index(True)
            name = listDir[first_match_index]
            faceName.append(name)
        elif not isUnkowFace:
            name = "unknow"
            faceName.append(name)
            face_locations_hd = face_recognition.face_locations(frame)
            SaveUnknowFaces( frame ,face_locations_hd)
            isUnkowFace = True

    for (top, right, bottom, left), name in zip(face_locations, faceName):
        
        # create rectangle
        cv2.rectangle(small_frame, (left, top), (right, bottom), (0, 0, 255), 2)

        # create label name
        font = cv2.FONT_HERSHEY_DUPLEX
        cv2.putText(small_frame, name, (left + 6, bottom - 6), font, 0.3, (255, 255, 255), 1)
    
    cv2.imshow("frame", small_frame)

    # menyimpan gambar sebagai base 64
    retval, buffer = cv2.imencode('.jpg', small_frame)
    jpg_as_text = base64.b64encode(buffer).decode('utf-8')
    with open('capture.txt', 'w') as f:
        f.write(jpg_as_text)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


# Release handle to the webcam
cv2.destroyAllWindows()