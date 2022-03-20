from django.http import HttpResponse
from django.shortcuts import render
from django.http import HttpResponse
def index(request):
    return render(request,'Login.html')
# Create your views here.

def Signup(request):
    return render(request,'SignUp.html')

def forgetpass(request):
    return render(request,'ForgetPass.html')

def homepage(request):
    return render(request,'homepage.html')

def about(request):
    return render(request,'about.html')

def video(request):
    return render(request,'video.html')