
from django.shortcuts import render
from django.http import HttpResponse
from django.http.response import StreamingHttpResponse
# import tensorflow as tf
from keras.models import load_model
import numpy as np
import glob, os
import cv2
# from detection import Detection
from background_task import background
import time
############################################

def frames_from_video(video_dir, nb_frames = 25, img_size = 224):

    # Opens the Video file
    cap = cv2.VideoCapture(video_dir)
    i=0
    frames = []
    while(cap.isOpened() and i<nb_frames):
        ret, frame = cap.read()
        if ret == False:
            break
        frame = cv2.resize(frame, (img_size, img_size))
        frames.append(frame)
        i+=1

    cap.release()
    cv2.destroyAllWindows()
    return np.array(frames) / 255.0

def predictions(video_dir, model, nb_frames = 25, img_size = 224):

    X = frames_from_video(video_dir, nb_frames, img_size)
    try:

        X = np.reshape(X, (1, nb_frames, img_size, img_size, 3))
        predictions = model.predict(X)
        preds = predictions.argmax(axis = 1)

        classes = []
        with open('E:/BE Project/Be_Project_final_v1.0/BE_Project/webcam/'+'classes.txt') as fp:
           print(fp)
           for line in fp:
                classes.append(line.split()[1])

        for i in range(len(preds)):
            print('Prediction - {} -- {}'.format(preds[i], classes[preds[i]]))
            return 'Prediction - {} -- {}'.format(preds[i], classes[preds[i]])
    
    except ValueError as ve:
        print("Error")

    # predictions = model.predict(X)
    # preds = predictions.argmax(axis = 1)

    # classes = []
    # with open('E:/BE Project/Be_Project_final_v1.0/BE_Project/webcam/'+'classes.txt') as fp:
    #     print(fp)
    #     for line in fp:
    #         classes.append(line.split()[1])

    # for i in range(len(preds)):
    #     print('Prediction - {} -- {}'.format(preds[i], classes[preds[i]]))
    #     return 'Prediction - {} -- {}'.format(preds[i], classes[preds[i]])

def pred_model():
       ## LOAD MODEL ##
    print("Inside Model")
    model = load_model('E:/BE Project/Be_Project_final_v1.0/BE_Project/webcam/slowfast_finalmodel.hd5')

       ## MAKE PREDICTIONS ##
    path="E:/BE Project/Be_Project_final_v1.0/BE_Project/test/"
    # os.chdir(path)
    # for file in glob.glob("E:/BE Project/Be_Project_final_v1.0/BE_Project/test/*"):
    #     # print(path+"/"+file)
    #     # file=path+"/"+file
    #     latest_file = max(file, key=os.path.getctime)
    #     print(latest_file)
    #     time.sleep(3)
    #     predictions(video_dir = latest_file, model = model, nb_frames = 25, img_size = 224)
    #     time.sleep(3)
    i=1
    while True:
        
        # time.sleep(150)
        # file="E:/BE Project/Be_Project_final_v1.0/BE_Project/test/test ("+str(i)+").mp4"
        # print(file)
        # time.sleep(20)
        # predictions(video_dir =file, model = model, nb_frames = 25, img_size = 224)
        # time.sleep(10)
        file_path="E:/BE Project/Be_Project_final_v1.0/BE_Project/test/test ("+str(i)+").mp4"
        while not os.path.exists(file_path):
            time.sleep(1)

        if os.path.isfile(file_path):
            print(file_path)
            time.sleep(5)
            predictions(video_dir =file_path, model = model, nb_frames = 25, img_size = 224)
            time.sleep(5)
            
            # read file
        
        # else:
        #     raise ValueError("%s isn't a file!" % file_path)
        i+=1


############################################

# Task
# @background(schedule=1)
# def call_model():
#     print("Background")
#     pred_model()

# k=1


def index(request):
    
    return render(request,'webcam.html')

def livecam_detection(request):
    # time.sleep(120)
    return StreamingHttpResponse(pred_model())


