import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Offers = () => {
    const [listings,setListings] = useState(null)
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        const fetchListing = async ()=>{
            try {
                const listingRef = collection(db, 'listing')

                const q = query(
                    listingRef,
                    where('offer','==',true),
                    orderBy('timestamp','desc'), 
                    limit(10)
                    )
                const querySnap = await getDocs(q)
                let listing = []
                querySnap.forEach((doc)=>{
                    return listing.push({
                        id: doc.id,
                        data:doc.data()
                    })
                })
                setListings(listing)
                setLoading(false)
            } catch (error) {
                toast.error('Could Not Fetch the data')
            }
        }
        fetchListing()
    },[])
    return (
        <>
         <div className="category">
            <header>
                <p className="pageHeader">
                    Offers
                </p>
            </header>
            {loading ? <Spinner /> : listings && listings.length > 0 ?
             <main>
                <ul className="categoryListings">
                    {listings.map((listing)=>(
                        <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
                    ))}

                </ul>
             </main>
              : <p>There are no offers</p>}
         </div>
        </>
    );
};

export default Offers;