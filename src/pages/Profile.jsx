import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

const Profile = () => {
    const [user, setUser] = useState(null)
    const auth = getAuth();
    useEffect(()=>{
        setUser(auth.currentUser)
    },[])
    return (
        <>
            <div>
                {user ? <h1>{user.displayName}</h1> : <h1>Not logged in</h1>}
            </div>    
        </>
    );
};

export default Profile;