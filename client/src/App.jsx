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

En la página createAlquiler, hay una funcion que retorna el calculo de dias aproximado según la fecha establecida, pero NO posee validaciones
para que si se selecciona una fecha de inicio, entonces la fecha de devolucion deba ser sí o sí posterior, en ese caso no podria resultar nunca
en una fecha inválida, por lo que cambiaría un poco esa función.

En la página createAlquiler NO hay validaciones establecidas o testeadas. Si existe el formData (osea que se lleno el form de la pagina de Home y se submiteó), no se si haya o no
que dejar como inválidos (que no pueda volver a modificar el cliente) aquellos values de los inputs del Home y sólo dejar modificables los nuevos (como categoría). 

En la página createAlquiler NO testeé ni pensé en la versión mobile (no recuerdo si era algo a lo que hacerle caso), y tampoco esta todo muy utilizado
según HeroUI probablemente, quise hacer la funcionalidad rápida y más o menos entendible, puede ser que haya que aclarar un poco o reacomodar algunas cosas.

En la página de createAlquiler se tienen las options del select de categoría de vehículo a mano, si cada sucursal al final resultaba tener todas las categorías, lo más probable
es que se mantenga de esta manera, pero igual habría que especificar bien qué tipos de categorías hay (me olvidé cuales eran asi que puse unas de ejemplo)

En la página de createAlquiler todavía NO se calcula el precio del alquiler, esta escrito re crudo, no se muy bien como era la fórmula a tener en cuenta
creo que dependía de la categoría y el tiempo o algo así, pero no implemente nada.

Forma layout: la página de createAlquiler y probablemente todas las demás tengan la TopBar y mantengan las mismas propiedades "base", y no esta por el momento seteada de 
esa forma "layout" para que herede ciertos componentes, asi que tuve que ponerle TopBar y un div idéntico a la pagina de Home, estaría bueno
Refactorizar y hacer un layout asi no hay que aclarar en cada página que hay una TopBar, etc.

Saqué Home de la TopBar, que Home se dirija clickeando el icono (ya estaba desde antes).

Con los cambios en la base de datos, (acomode algunos campos mistipeados y además ahora ya no habia campos de prueba), NO se puede crear el alquiler, requiere de cliente
y todas las entidades relacionadas, asi que no esta funcionando (pero SI esta la conexión a la base y si la data se envía bien tengo entendido que funciona).

Con los cambios en la base de datos seguro exploten los datos del faker si es que lo siguen teniendo, por las dudas borren todo al pingo.
*/
