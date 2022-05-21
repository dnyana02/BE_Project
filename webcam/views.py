
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
import smtplib,ssl
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
################# Mail Function #################

def pred_mail(pred_value):
    smtp_server="smtp.gmail.com"
    sender_email="demoaccforstudy@gmail.com"                                  #enter sender mail id
    receiver_email=["dnyaneshm2000@gmail.com","mukulborole13@gmail.com","shahakar.devashish@gmail.com"]                                #enter receiver mail id
    port=465
    pas="Demo@2000"                                      #enter password of account through which you wanna send
    message="""
                Subject:Voialation of Social Distancing
                Respected Sir,
                Threat Detected : {}
            """.format(pred_value)
    context=ssl.create_default_context()
    server=smtplib.SMTP_SSL(smtp_server,port,context=context)
    server.login(sender_email,pas)
    for i in range(len(receiver_email)):
        server.sendmail(sender_email,receiver_email[i],message)
    print("Email sent successfully")
    print("-------------------------------------")



#################################################

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
            return  classes[preds[i]]
    
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
        
        pred_list=[]
        if os.path.isfile(file_path):
            print(file_path)
            time.sleep(5)
            pred=predictions(video_dir =file_path, model = model, nb_frames = 25, img_size = 224)
            time.sleep(5)
            pred_list.append(pred)
            ####################  Mail Function   ##################################
          
            if i%5==0:
                max_pred=max(pred_list)
                print("Maximum of Prediction: ",max_pred)
                pred_mail(max_pred)
                pred_list=[]
 

        ########################################################

        
 



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


