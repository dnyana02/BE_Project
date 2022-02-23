from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request,'Login.html')

def Signup(request):
    return render(request,'SignUp.html')

def forgetpass(request):
    return render(request,'ForgetPass.html')

def home(request):
    return render(request,'home.html')

def about(request):
    return render(request,'about.html')

def video(request):
    return render(request,'video.html')