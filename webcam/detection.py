import tensorflow as tf
import numpy as np
import os,glob
import cv2
from keras.models import load_model
import time
'''
class Detection:
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

   



    def predictions(self,video_dir, model, nb_frames = 25, img_size = 224):

        X = self.frames_from_video(video_dir, nb_frames, img_size)
        X = np.reshape(X, (1, nb_frames, img_size, img_size, 3))
    
        predictions = model.predict(X)
        preds = predictions.argmax(axis = 1)

        classes = []
        with open(os.path.join('output', 'classes.txt'), 'r') as fp:
            for line in fp:
                classes.append(line.split()[1])

        for i in range(len(preds)):
            print('Prediction - {} -- {}'.format(preds[i], classes[preds[i]]))


    def pred_model(self):
       ## LOAD MODEL ##

        model = tf.keras.models.load_model('model/slowfast_finalmodel.hd5')

       ## MAKE PREDICTIONS ##
        path="E:/BE Project/Be_Project_final_v1.0/BE_Project/test/"
        os.chdir(path)
        for file in glob.glob("*.mp4"):
           print(path+"/"+file)
           self.predictions(video_dir = file, model = model, nb_frames = 25, img_size = 224)
'''

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

def pred_model():
       ## LOAD MODEL ##
    print("Inside Model")
    model = load_model('E:/BE Project/Be_Project_final_v1.0/BE_Project/webcam/slowfast_finalmodel.hd5')

       ## MAKE PREDICTIONS ##
    path="E:/BE Project/Be_Project_final_v1.0/BE_Project/test/"
    os.chdir(path)
    for file in glob.glob("*.mp4"):
        print(path+"/"+file)
        predictions(video_dir = file, model = model, nb_frames = 25, img_size = 224)


if __name__ == "__main__":
    pred_model()
    time.sleep(10)