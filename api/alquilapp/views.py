from django.shortcuts import render
from rest_framework import viewsets
from .models import Alquiler, PaqueteExtra
from .serializers import AlquilerSerializer, PaqueteExtraSerializer

class AlquilerViewSet(viewsets.ModelViewSet):
    queryset = Alquiler.objects.all()
    serializer_class = AlquilerSerializer

class PaqueteExtraViewSet(viewsets.ModelViewSet):
    queryset = PaqueteExtra.objects.all()
    serializer_class = PaqueteExtraSerializer