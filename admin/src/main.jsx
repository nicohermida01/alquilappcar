import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { EmployeePage } from './pages/EmployeePage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import VehiclesPage from './pages/VehiclesPage.jsx'
import { DashboardLayout } from './components/DashboardLayout.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import BrandsPage from './pages/BrandsPage.jsx'
import CategoriasPage from './pages/CategoriasPage.jsx'
import CancelacionesPage from './pages/CancelacionesPage.jsx'
import PaquetesPage from './pages/PaquetesPage.jsx'
import ClientsPage from './pages/ClientPage.jsx'
import LocalidadesPage from './pages/LocalidadesPage.jsx'
import SucursalesPage from './pages/SucursalesPage.jsx'
import AdminPwRecoveryPage from './pages/AdminPwRecoveryPage.jsx'
import AlquileresPage from './pages/AlquileresPage.jsx'

// Todas las páginas que se agregan dentro de la ruta van a tener el layout definido, está agregado dentro de
// el componente DashboardLayout.jsx, que es el que se encarga de renderizar el sidebar y el topbar. Si se fijan,
// tiene el componente Outlet, ese es el que muestra los hijos de la route que tiene el dashboardLayout como elemento.
createRoot(document.getElementById('root')).render(
	<StrictMode>
		<HeroUIProvider>
			<AuthProvider>
				<ToastProvider />
				<BrowserRouter>
					<Routes>
						<Route element={<DashboardLayout />}>
							<Route path='/' element={<DashboardPage />} />
							<Route path='/vehiculos' element={<VehiclesPage />} />
							<Route path='/empleados' element={<EmployeePage />} />
							<Route path='/marcas' element={<BrandsPage />} />
							<Route path='/categorias' element={<CategoriasPage />} />
							<Route path='/cancelaciones' element={<CancelacionesPage />} />
							<Route path='/paquetes' element={<PaquetesPage />} />
							<Route path='/clientes' element={<ClientsPage />} />
							<Route path='/localidades' element={<LocalidadesPage />} />
							<Route path='/sucursales' element={<SucursalesPage />} />
							<Route path='/alquileres' element={<AlquileresPage />} />
						</Route>
						<Route path='/admrecovery' element={<AdminPwRecoveryPage />} />
						<Route path='/login' element={<LoginPage />} />
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</HeroUIProvider>
	</StrictMode>
)
