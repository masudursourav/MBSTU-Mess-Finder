import { useEffect, useState } from 'react';
import shareIcon from '../assets/svg/shareIcon.svg'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import Spinner from '../components/Spinner'
import 'swiper/css'
import 'swiper/css/bundle'

import {Swiper, SwiperSlide } from 'swiper/react';

const Listing = () => {
    const [listing,setListing] = useState(null)
    const [loading,setLoading] = useState(true)
    const [shareLinkCopied,setShareLinkCopied] = useState(false)

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()
    if(!auth.currentUser){       
        navigate('/sign-in')
    }
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


    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className='swiperSlideDiv'
            ><img className='swiperSlideImg' src={listing.imageUrls[index]} alt="" /></div>
          </SwiperSlide>
        ))}
    </Swiper>

            

            <div className="listingDetails">
                <p className="listingName">{listing.name} - {listing.offer ? listing.discountedPrice : listing.regularPrice} ৳</p>
                <p className="listingLocation">{listing.location}</p>
                <p className="listingType">For {listing.type === 'rent' ? 'Room' : 'House'}</p>
                {listing.offer && <p className="discountPrice">{listing.regularPrice - listing.discountedPrice} ৳  Discount</p>}


                <ul className="listingDetailsList">
                    <li>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
                    </li>
                     <li>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
                    </li>
                    <li>
                        {listing.parking && 'Have Parking Spot'}
                    </li>
                    <li>
                        {listing.furnished && 'Furnished'}
                    </li>
                </ul>

                <p className="listingLocationTitle">Location</p>
                
                <a href={`https://maps.google.com/maps?q=${listing.location}`} target="_blank" rel="noopener noreferrer">
                    <button className='primaryButton'>Click to see the location on GMap</button></a>

                <p className="listingLocationTitle">Contact Details</p>
                <p className="listingLocation">Phone : {listing.Phone}</p>    
                {
                auth.currentUser.uid !== listing.userRef && (
                    <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>Contact with owner</Link>
                ) }
            </div>
            
            </main> 
        </>
    );
};

export default Listing;