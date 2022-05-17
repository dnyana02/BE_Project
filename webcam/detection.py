import tensorflow as tf
import numpy as np
import os
import cv2


'''class Detection:
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

        self.predictions(video_dir = 'E:/BE Project/Be_Project_final_v1.0/BE_Project/test/4.mp4', model = model, nb_frames = 25, img_size = 224)
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
    with open(os.path.join('output', 'classes.txt'), 'r') as fp:
        for line in fp:
            classes.append(line.split()[1])

    for i in range(len(preds)):
        print('Prediction - {} -- {}'.format(preds[i], classes[preds[i]]))

def pred_model():
       ## LOAD MODEL ##

    model = tf.keras.models.load_model('model/slowfast_finalmodel.hd5')

       ## MAKE PREDICTIONS ##

    predictions(video_dir = 'E:/BE Project/Be_Project_final_v1.0/BE_Project/test/4.mp4', model = model, nb_frames = 25, img_size = 224)
