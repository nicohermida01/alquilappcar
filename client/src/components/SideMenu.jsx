function SideMenu({ onSelect }) {
	return (
		<div className="w-64 bg-color-2 text-white h-100">
			<ul className="sticky p-4 space-y-2 top-0">
				<li className="bg-color-5 hover:bg-color-4 p-2 rounded cursor-pointer" onClick={() => onSelect('myinfo')}>
					<p>Mis datos</p>
				</li>
				<li className="bg-color-5 hover:bg-color-4 p-2 rounded cursor-pointer" onClick={() => onSelect('alquileres')}>
					<p>Mis alquileres</p>
				</li>
				<li className="bg-color-5 hover:bg-color-4 p-2 rounded cursor-pointer" onClick={() => onSelect('settings')}>
					<p>Editar informacion</p>
				</li>
			</ul>
		</div>
	);
}

export default SideMenu;
