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
    email=request.POST.get('email')
    pasw=request.POST.get('pass')
    print("Email",email)
    print("Pass",pasw)
    try:
        # if there is no error then signin the user with given email and password
        user=authe.sign_in_with_email_and_password(email,pasw)
        message1="Login Successfully!!!"
        print(message1)
    except:
        message="Invalid Credentials!!Please ChecK your Data"
        print(message)
        return render(request,"Login.html",{"message":message})
    session_id=user['idToken']
    request.session['uid']=str(session_id)
   
    print("After POST")
    return render(request,'homepage.html',{"message":message1})

def about(request):
    return render(request,'about.html')

def video(request):
    return render(request,'video.html')

def postsignUp(request):
     email = request.POST.get('email')
     passs = request.POST.get('password')
    
     try:
        # creating a user with the given email and password
        user=authe.create_user_with_email_and_password(email,passs)
        uid = user['localId']
        idtoken = request.session['uid']
        print(uid)
     except:
        return render(request, "SignUp.html")
     return render(request,"Login.html")