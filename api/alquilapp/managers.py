from django.db import models

class ActivosManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(activo=True)