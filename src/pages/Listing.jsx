import { useEffect, useState } from 'react';
import shareIcon from '../assets/svg/shareIcon.svg'
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import Spinner from '../components/Spinner'
const Listing = () => {
    const [listing,setListing] = useState(null)
    const [loading,setLoading] = useState(true)
    const [shareLinkCopied,setShareLinkCopied] = useState(false)

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(()=>{
        const fetchListing = async ()=>{
            const docRef = doc(db,'listing',params.listingId)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                setListing(docSnap.data())
                setLoading(false)
            }
        }
        fetchListing()
    },[navigate,params.listingId])
    if(loading){
        return <Spinner />
    }
    return (
        <>
           <main>
            <div className="shareIconDiv" onClick={()=>{
                navigator.clipboard.writeText(window.location.href)
                setShareLinkCopied(true)
                setTimeout(()=>{
                    setShareLinkCopied(false)
                },2000)
            }}>
                <img src={shareIcon} alt="share icon" />
                {shareLinkCopied && <p className='linkCopied'>Link Copied</p>}
            </div>
            
            </main> 
        </>
    );
};

export default Listing;