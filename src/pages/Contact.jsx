import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";

const Contact = () => {
    const [message, setMessage] = useState('')
    const [landlord, setLandlord] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()

    const params = useParams()

    const onChange = (e)=>{
            setMessage(e.target.value)
    }

    useEffect(()=> {
        const getLandlord = async ()=>{
            const docRef = doc(db,'users',params.landlordId)
            const docSnap =  await getDoc(docRef)

            if(docSnap.exists()){
                setLandlord(docSnap.data())
            }
            else{
                toast.error('Could not get owner data')
            }
        }
        getLandlord()

    },[params.landlordId])

    return (
        <>
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Contact Landlord</p>
                { landlord !== null && (
                    <main>
                        <div className="contactLandlord">
                            <p className="landlordName">Contact with {landlord?.name}</p>
                        </div>

                        <form className="messageForm">
                            <div className="messageDiv">
                                <label htmlFor="message" className="messageLabel">Message</label>
                                <textarea name="message" id="message" className="textarea" value={message}
                                onChange={onChange}></textarea>
                            </div>

                            <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                                <button className="primaryButton" type="button">Send Message</button>
                            </a>
                        </form>
                    </main>
                )
                }
            </header>    
        </div> 
        </>
    );
};

export default Contact;