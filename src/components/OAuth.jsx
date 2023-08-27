import { useLocation, useNavigate } from 'react-router-dom';
import googleIcon from '../assets/svg/googleIcon.svg'
import { toast } from 'react-toastify';
import { GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
const OAuth = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const onGoogleClick = async()=>{
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            const docRef = doc(db,'users',user.uid)
            const docSnap = await getDoc(docRef)

            if(!docSnap.exists()){
                await setDoc(doc(db,'users',user.uid),{
                    name:user.displayName,
                    email: user.email,
                    timestamp:serverTimestamp()
                })
               
            }
            navigate('/')

        } catch (error) {
            toast.error("Authentication Error")
        }
    }
    return (
        <>
          <div className="socialLogin">
            <p>Sign {location.pathname ==='/sign-up' ? 'Up':'In'} With</p>
          <button className='socialIconDiv' onClick={onGoogleClick}>
            <img className='socialIconImg' src={googleIcon}/></button>  
          </div>
        </>
    );
};

export default OAuth;