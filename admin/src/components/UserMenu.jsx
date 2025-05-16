import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Avatar,
	User,
} from '@heroui/react'

export function UserMenu() {
	return (
		<Dropdown placement='bottom-end'>
			<DropdownTrigger>
				<Avatar
					isBordered
					as='button'
					className='transition-transform'
					src='https://i.pinimg.com/736x/cf/1b/9c/cf1b9c414bcd16d6e9f7fcd4ea698dcd.jpg'
				/>
			</DropdownTrigger>
			<DropdownMenu aria-label='Profile Actions' variant='flat'>
				<DropdownItem key='settings'>Ver perfil</DropdownItem>
				<DropdownItem key='logout' color='danger'>
					Log Out
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}
