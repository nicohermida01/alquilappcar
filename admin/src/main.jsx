import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HeroUIProvider } from '@heroui/react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<HeroUIProvider>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<DashboardPage />} />
					<Route path='/login' element={<LoginPage />} />
				</Routes>
			</BrowserRouter>
		</HeroUIProvider>
	</StrictMode>
)
