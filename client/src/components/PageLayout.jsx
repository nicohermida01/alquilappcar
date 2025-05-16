import Topbar from './Topbar'

export function PageLayout({ children }) {
	return (
		<div>
			<Topbar />
			{children}
		</div>
	)
}
