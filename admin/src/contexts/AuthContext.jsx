import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [loadingAuth, setLoadingAuth] = useState(true) // Estado para manejar la carga de autenticación y evitar bugs al cargar paginas -Nico

	useEffect(() => {
		const storedUser = localStorage.getItem('user')
		const storedAccessToken = localStorage.getItem('access-token')

		if (storedUser && storedAccessToken) {
			const user = JSON.parse(storedUser)
			const token = JSON.parse(storedAccessToken)

			setUser({
				userId: user.userId,
				email: user.email,
				isAdmin: user.isAdmin,
				accessToken: token,
			})
		}
		setLoadingAuth(false)
	}, [])

	const login = userData => {
		localStorage.setItem('access-token', JSON.stringify(userData.accessToken))
		localStorage.setItem(
			'user',
			JSON.stringify({
				userId: userData.userId,
				email: userData.email,
				isAdmin: userData.isAdmin,
			})
		)

		setUser(userData)
	}

	const logout = () => {
		localStorage.removeItem('access-token')
		localStorage.removeItem('user')
		setUser(null)
	}

	return (
		<AuthContext.Provider
			value={{ user, login, logout, isAuthenticated: !!user, loadingAuth }}
		>
			{children}
		</AuthContext.Provider>
	)
}
