import { useState } from 'react';
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const onChange = (e) =>{
        setEmail(e.target.value)
    }

    const onSubmit = async(e) =>{
        e.preventDefault()
        try {
            const auth = getAuth()
            await sendPasswordResetEmail(auth,email)
            toast.success('Check your Email for Password Reset')
        } catch (error) {
            toast.error('Could not send Rest Email')
        }

    }
    return (
        <>
        <div className='pageContainer'>
            <header>
                <p className="pageHeader">
                    Forgot Password 
                </p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                    <input type="email" className="emailInput"  placeholder='Email' id='email' onChange={onChange}
                    value={email}/>
                    <Link className='forgotPasswordLink' to='/sign-in'>Sign In</Link> 
                </form>
                <div className="signInBar">
                    <div className="signInText">Send Reset Link</div>
                    <button className='signInButton'> <ArrowRightIcon fill='#ffffff' width='34px' height='34px' /></button>
                </div>
            </main>
        </div>
        </>
    );
};

export default ForgotPassword;