import { PageLayout } from "../components/PageLayout"
import SideMenu from "../components/SideMenu"
import UserData from "../components/UserData"
import UserAlquileres from "../components/UserAlquileres"
import UserSettings from "../components/UserSettings"
import { useState } from 'react'

function UserProfile() {
    const [activeSection, setActiveSection] = useState('myinfo');

    return (
        <PageLayout>
            <div className="flex bg-gray-100 mt-16 h-[93vh]">
                <SideMenu onSelect={setActiveSection}/>
                <div className="flex-grow">
                    {activeSection === 'myinfo' && <UserData />}
                    {activeSection === 'alquileres' && <UserAlquileres />}
                    {activeSection === 'settings' && <UserSettings />}
                </div>
            </div>
        </PageLayout>
    )
}

export default UserProfile;
