from django.http import HttpResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect
import pyrebase


config={
    "apiKey": "AIzaSyBhSyM-U48oCp1BFE62RracVPfUR-GyYHs",
    "authDomain": "smart-threat-analysis-system.firebaseapp.com",
    "databaseURL": "https://smart-threat-analysis-system-default-rtdb.firebaseio.com",
    "projectId": "smart-threat-analysis-system",
    "storageBucket": "smart-threat-analysis-system.appspot.com",
    "messagingSenderId": "226245128419",
    "appId": "1:226245128419:web:363d7521e610cd39a415d6",
    
}
firebase=pyrebase.initialize_app(config)
authe=firebase.auth()
db=firebase.database()

@csrf_protect
def index(request):
    user_login=db.child('UserLogin').child('email').get().val()
    print(user_login)
    return render(request,'Login.html')
# Create your views here.

def Signup(request):
    return render(request,'SignUp.html')

def forgetpass(request):
    return render(request,'ForgetPass.html')

def homepage(request):
    print("before POST")
    

    print("inside POST")
    email=request.POST['email']
    print("Email",email)
    print("After POST")
    return render(request,'homepage.html')

def about(request):
    return render(request,'about.html')

def video(request):
    return render(request,'video.html')