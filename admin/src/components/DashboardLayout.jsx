import { Topbar } from './Topbar'

export function DashboardLayout({ children }) {
	return (
		<div>
			<Topbar />
			{children}
		</div>
	)
}
