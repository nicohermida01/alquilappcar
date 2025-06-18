from django.urls import path, include
from rest_framework import routers
from alquilapp import views

router = routers.DefaultRouter()
router.register(r'vehiculos', views.VehiculoView, basename='vehiculo')
router.register(r'marcas', views.MarcaView, basename='marca')
router.register(r'cancelaciones', views.CancelacionView, basename='cancelacion')
router.register(r'admins', views.AdminViewSet, basename='admin')
router.register(r'empleados', views.EmpleadoViewSet, basename='empleado')
router.register(r'sucursales', views.SucursalViewSet, basename='sucursal')
router.register(r'alquileres', views.AlquilerViewSet, basename='alquiler')
router.register(r'paquetes', views.PaqueteExtraViewSet, basename='paqueteextra')
router.register(r'localidades', views.LocalidadViewSet, basename='localidad')
router.register(r'categorias', views.CategoriaVehiculoViewSet, basename='categoria')
router.register(r'clientes', views.ClienteViewSet, basename='cliente')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api/v1/login/', views.LoginAPIView.as_view(), name='login'),
    path('api/v1/login/admin/', views.LoginAdminAPIView.as_view(), name='login_admin'),
    path('api/v1/login/admin/2fa/<int:id>/', views.Confirm2FAAPIView.as_view(), name='login_admin_2fa'),
    path('api/v1/clientes/by-email/<str:email>', views.Cliente.get_by_email)
]
