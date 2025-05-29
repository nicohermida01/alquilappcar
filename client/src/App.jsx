import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CreateAlquiler from './pages/CreateAlquiler'
import UserProfile from './pages/UserProfile'
import { AuthProvider } from './contexts/AuthContext'

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/login' element={<LoginPage />} />
					<Route path='/register' element={<RegisterPage />} />
					<Route path='/alquiler' element={<CreateAlquiler />} />
					<Route path='/mi-perfil' element={<UserProfile />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	)
}

export default App

/* ACLARACIONES DEL CABESAURIO: 
En la página createAlquiler NO hay validaciones establecidas o testeadas. Si existe el formData (osea que se lleno el form de la pagina de Home y se submiteó), no se si haya o no
que dejar como inválidos (que no pueda volver a modificar el cliente) aquellos values de los inputs del Home y sólo dejar modificables los nuevos (como categoría). 

En la página de createAlquiler todavía NO se calcula el precio del alquiler, esta escrito re crudo, no se muy bien como era la fórmula a tener en cuenta
creo que dependía de la categoría y el tiempo o algo así, pero no implemente nada.
*/
