import { getAuth, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import {db} from "../../firebase.config"
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg"
import homeIcon from "../assets/svg/homeIcon.svg"
import ListingItem from "../components/ListingItem";

const Profile = () => {
    const auth = getAuth();
    const [changeDetails, setChangeDetails] = useState(false)
    const [listings,setListings] = useState(null)
    const [loading,setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })
    const {name,email} = formData
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchUserListings = async ()=>{
            const listingRef = collection(db, 'listing')
            const q = query(listingRef, where('userRef','==',auth.currentUser.uid),
            orderBy('timestamp','desc'))

            const querySnap = await getDocs(q)
            let listings = []
            querySnap.forEach((doc)=>{
                return listings.push({
                    id:doc.id,
                    data:doc.data()
                })
            })
            setListings(listings)
            setLoading(false)
        }
        fetchUserListings()

    },[auth.currentUser.uid])



    const onLogout = () => {
        auth.signOut();
        navigate('/')
    }
    const onSubmit = async () =>{
        try {
            if(auth.currentUser.displayName !== name){
                await updateProfile(auth.currentUser, {
                    displayName : name
                })

                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name
                })
            }
        } catch (error) {
            toast.error('Could not update changes')            
        }
    }

    const onChange = (e) => {
        setFormData((prevState) =>({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }


    const onDelete = async (listingId) =>{
        if(window.confirm('Are you sure? You want to delete this listing')){
            await deleteDoc(doc(db, 'listing',listingId))
            const updatedListings = listings.filter((listing) => listing.id !== listingId)
            setListings(updatedListings)
            toast.success('The listing deleted successfully')
        }
    }

    const onEdit = (listingId) => {
        navigate(`/edit-listing/${listingId}`)
    }
    return (
        <>
            <div className="profile">
                <header className="profileHeader">
                    <p className="pageHeader">
                        My profile : 
                    </p>
                    <button className="logOut" onClick={onLogout}>
                        Logout
                    </button>
                </header>
                <main>
                    <div className="profileDetailsHeader">
                        <p className="profileDetailsText">Personal Details</p>
                        <p className="changePersonalDetails" onClick={()=>{
                            changeDetails && onSubmit()
                            setChangeDetails((prevState) => !prevState )
                        }}>{changeDetails? 'Done' : 'Change'}</p>
                    </div>
                    <div className="profileCard">
                        <form>
                            <input type="text" id='name'  className={!changeDetails ? 'profileName' : 'profileNameActive'} 
                            disabled = {!changeDetails} value={name} onChange={onChange} />
                            <input type="text" id='email'  className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} 
                            disabled = {!changeDetails} value={email} onChange={onChange} />

                        </form>
                    </div>
                    <Link to='/create-listing' className='createListing'>
                        <img src={homeIcon} alt="home" />
                        <p>Rent your home or rooms</p>
                        <img src={arrowRight} alt="arrow right" />
                    </Link>

                    {!loading && listings?.length > 0 && 
                    <>
                    <p className="listingText">
                        Your Listings 
                    </p>
                    <ul className="listingsList">
                        {listings.map((listing)=>(
                            <ListingItem key = {listing.id} listing = {listing.data} id={listing.id} 
                            onDelete={() => onDelete(listing.id)}
                            onEdit={() => onEdit(listing.id)}
                            />
                        ))}
                    </ul>
                    </>
                    }
                </main>
            </div>    
        </>
    );
};

export default Profile;