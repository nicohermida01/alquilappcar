import { PageLayout } from "../components/PageLayout"
import SideMenu from "../components/SideMenu"
import UserData from "../components/UserData"
import UserAlquileres from "../components/UserAlquileres"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../contexts/AuthContext"
import UserEditSettings from "../components/UserEditSettings"

function UserProfile() {
    const { isAuthenticated, loadingAuth } = useAuth();
    const [activeSection, setActiveSection] = useState('myinfo');
    let navigate = useNavigate();

    useEffect(() => {
        if (loadingAuth)
            return;

        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, loadingAuth]); 

    if (loadingAuth)
        return "Cargando...";

    return (
        <PageLayout>
            <div className="flex bg-gray-100 mt-16 h-full">
                <SideMenu onSelect={setActiveSection}/>
                <div className="flex-grow">
                    {activeSection === 'myinfo' && <UserData />}
                    {activeSection === 'alquileres' && <UserAlquileres />}
                    {activeSection === 'settings' && <UserEditSettings />}
                </div>
            </div>
        </PageLayout>
    )
}

export default UserProfile;
