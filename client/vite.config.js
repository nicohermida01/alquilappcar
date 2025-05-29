import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			allow: ['..'],
		},
		port: 3000,
	},
	plugins: [react()],
})
