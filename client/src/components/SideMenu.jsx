function SideMenu({ onSelect }) {
	return (
		<div className="w-64 bg-gray-800 text-white h-screen">
			<ul className="sticky p-4 space-y-2 top-0">
				<li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => onSelect('myinfo')}>
					<p>Mis datos</p>
				</li>
				<li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => onSelect('alquileres')}>
					<p>Mis alquileres</p>
				</li>
				<li className="hover:bg-gray-700 p-2 rounded cursor-pointer" onClick={() => onSelect('settings')}>
					<p>Ajustes y preferencias</p>
				</li>
			</ul>
		</div>
	);
}

export default SideMenu;
