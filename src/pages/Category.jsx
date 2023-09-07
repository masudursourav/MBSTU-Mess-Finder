import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Category = () => {
    const [listings,setListings] = useState(null)
    const [loading,setLoading] = useState(true)
    const [lastFetchedListing,setLastFetchedListing] = useState(null)
    const params = useParams()

    useEffect(() => {
        const fetchListing = async ()=>{
            try {
                const listingRef = collection(db, 'listing')

                const q = query(
                    listingRef,
                    where('type','==',params.categoryName),
                    orderBy('timestamp','desc'), 
                    limit(10)
                    )
                const querySnap = await getDocs(q)
                
                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchedListing(lastVisible)

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
    },[params.categoryName])



    const onFetchMoreListing = async ()=>{
        try {
            const listingRef = collection(db, 'listing')

            const q = query(
                listingRef,
                where('type','==',params.categoryName),
                orderBy('timestamp','desc'),
                startAfter(lastFetchedListing), 
                limit(10)
                )
            const querySnap = await getDocs(q)
            
            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible)

            let listing = []
            querySnap.forEach((doc)=>{
                return listing.push({
                    id: doc.id,
                    data:doc.data()
                })
            })
            setListings((prevState) => [...prevState,...listing])
            setLoading(false)
        } catch (error) {
            toast.error('Could Not Fetch the data')
        }
    }


    return (
        <>
         <div className="category">
            <header>
                <p className="pageHeader">
                    {params.categoryName ==='rent' ? 'Rooms For Rent' : 'House For Rent'}
                </p>
            </header>
            {loading ? <Spinner /> : listings && listings.length > 0 ?
             <>
             <main>
                <ul className="categoryListings">
                    {listings.map((listing)=>(
                        <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
                    ))}

                </ul>
             </main>
             <br/>
             <br/>
             {lastFetchedListing && (
                <p className="loadMore" onClick={onFetchMoreListing}>Load More</p>
             )}
             </>
              : <p>No Listing for {params.categoryName}</p>}
         </div>
        </>
    );
};

export default Category;