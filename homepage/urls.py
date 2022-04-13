from django import views
from django.urls import path
from homepage import views
urlpatterns=[
    path('',views.index,name='index'),
    path('forgetpass/',views.forgetpass,name='forgetpass'),
    path('Signup/',views.Signup,name='Signup'),
    path('homepage/',views.homepage,name='homepage'),
    path('about/',views.about,name='about'),
    path('video/',views.video,name='video'),
    path('postsignUp/',views.postsignUp,name='postsignUp')
]