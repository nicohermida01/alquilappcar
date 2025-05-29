import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

// Hook para usar el contexto -Nico
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)

	useEffect(() => {
		const storedUser = localStorage.getItem('user')
		const storedAccessToken = localStorage.getItem('access-token')

		if (storedUser && storedAccessToken) {
			const user = JSON.parse(storedUser)
			const token = JSON.parse(storedAccessToken)

			setUser({
				clientId: user.clientId,
				email: user.email,
				accessToken: token,
			})
		}
	}, [])

	const login = userData => {
		localStorage.setItem('access-token', JSON.stringify(userData.accessToken))
		localStorage.setItem(
			'user',
			JSON.stringify({
				clientId: userData.clientId,
				email: userData.email,
			})
		)
		setUser(userData)
	}

	const logout = () => {
		setUser(null)
		localStorage.removeItem('user')
		localStorage.removeItem('access-token')
	}

	return (
		<AuthContext.Provider
			value={{ user, login, logout, isAuthenticated: !!user }}
		>
			{children}
		</AuthContext.Provider>
	)
}
