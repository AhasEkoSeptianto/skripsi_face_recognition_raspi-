import cv2
import numpy as np
import face_recognition
import os
from PIL import Image
import requests
import base64
import time

# set config webcam
URL = "http://<IP>/cam-mid.jpg"

with open('IPESP32CAM.txt') as f:
    IP = f.read()
    URL = "http://" +  IP + "/cam-mid.jpg"

# print(URL)
# setup dataset
dataSet = []
unknowFaceSet = []
listDir = os.listdir('./dataSet')
faceName = []
isUnkowFace = False

# untuk update dataset
def setup_dataSet():
    for files in os.listdir('./dataSet'):
        pict = face_recognition.load_image_file('dataSet/' + files)
        face_locations_pict = face_recognition.face_locations(pict)
        face_encodings = face_recognition.face_encodings(pict, face_locations_pict)

        for face in face_encodings:
            dataSet.append(face)
    
    
    for files in os.listdir('./unknowFace'):
        pict = face_recognition.load_image_file('unknowFace/' + files)
        face_locations_pict = face_recognition.face_locations(pict)
        face_encodings = face_recognition.face_encodings(pict, face_locations_pict)

        for face in face_encodings:
            unknowFaceSet.append(face)
        
    

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



# 
while True:
    dataSets = dataSet
    unknowFaceSets = unknowFaceSet
    isUnkowFaces = isUnkowFace
    print("running...")
    # ret, frame = video_capture.read()

    try: 
        response = requests.get(URL)
        # img_array = np.array(bytearray(response.content), dtype=np.uint8)
        # frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        decoded_data = base64.b64decode(response.text)

        # Mengubah data gambar menjadi array numpy dengan tipe data uint8
        img_array = np.frombuffer(decoded_data, dtype=np.uint8)

        # Mendecode array menjadi objek gambar menggunakan OpenCV
        frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        # small_frame = frame
        small_frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
        
        face_locations = face_recognition.face_locations(small_frame, number_of_times_to_upsample=1)
        face_encodings = face_recognition.face_encodings(small_frame, face_locations)
        
        faceName = []
        # print(isUnkowFace, '<==== is unknow face')
        # bandingkan kedua encoding wajah
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(dataSets, face_encoding)

            if True in matches:
                first_match_index = matches.index(True)
                name = listDir[first_match_index]
                faceName.append(name)
            else:
                
                isMatchesUnknowFace = face_recognition.compare_faces(unknowFaceSets, face_encoding)
                if True in isMatchesUnknowFace:
                    print("mathches")
                else:
                    name = "unknow"
                    faceName.append(name)
                    face_locations_hd = face_recognition.face_locations(frame)
                    SaveUnknowFaces( frame ,face_locations_hd)



        for (top, right, bottom, left), name in zip(face_locations, faceName):
            
            # create rectangle
            cv2.rectangle(small_frame, (left, top), (right, bottom), (0, 0, 255), 2)

            # create label name
            font = cv2.FONT_HERSHEY_DUPLEX
            cv2.putText(small_frame, name, (left + 6, bottom - 6), font, 0.3, (255, 255, 255), 1)
        
        #cv2.imshow("frame", small_frame)

        # menyimpan gambar sebagai base 64
        retval, buffer = cv2.imencode('.jpg', small_frame)
        jpg_as_text = base64.b64encode(buffer).decode('utf-8')
        with open('capture.txt', 'w') as f:
            f.write(jpg_as_text)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    except BaseException as e:
        print(str(e))

    

# Release handle to the webcam
cv2.destroyAllWindows()
