import { createContext, useContext, useState } from 'react'

const RentContext = createContext()

export const useRent = () => useContext(RentContext)

export const RentProvider = ({ children }) => {
	const [rentBasic, setRentBasic] = useState(null)

	return (
		<RentContext.Provider
			value={{ rentBasic, setRentBasic, haveRentBasic: !!rentBasic }}
		>
			{children}
		</RentContext.Provider>
	)
}
