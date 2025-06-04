import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CreateAlquiler from './pages/CreateAlquiler'
import UserProfile from './pages/UserProfile'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from '@heroui/react'
import { RentProvider } from './contexts/RentContext'

function App() {
	return (
		<AuthProvider>
			<RentProvider>
				<ToastProvider placement='top-center' />
				<BrowserRouter>
					<Routes>
						<Route path='/' element={<HomePage />} />
						<Route path='/login' element={<LoginPage />} />
						<Route path='/register' element={<RegisterPage />} />
						<Route path='/alquiler' element={<CreateAlquiler />} />
						<Route path='/mi-perfil' element={<UserProfile />} />
					</Routes>
				</BrowserRouter>
			</RentProvider>
		</AuthProvider>
	)
}

export default App

/* ACLARACIONES DEL CABESAURIO: 
EN LA PAGINA DE CREATEALQUILER EN EL SUBMIT HAY QUE AGREGAR LA LOGICA DEL MODULO DE PAGO.
EN LA PAGINA DE USERALQUILERES HAY QUE HACER EL MODAL A MODO DE DETAIL MOSTRANDO LA DATA, HAY COMENTADAS COSAS QUE DEJÉ PARA MOSTRAR CÓMO ACCEDER A LA DATA.
AGREGUE UN CONDICIONAL EN AL TOPBAR PARA QEU SOLO SE MUESTRE EL BOTON DE RESEVAR SI ESTAS LOGUEADO.
EN LA PAGINA DE USER ALQUILERES YA ESTA FUNCIONAL EL DAR DE BAJA.
EN LA PAGINA DE CREATEALQUILER YA SE MUESTRA EL ERORR AL NO SELECCIONAR SUCURSAL.
*/
