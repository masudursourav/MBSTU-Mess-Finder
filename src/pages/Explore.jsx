import { Link } from 'react-router-dom';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import houseCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
const Explore = () => {
    return (
        <>
         <div className='explore'>
            <header>
                <p className="pageHeader">Explore</p>
            </header>
            <main>
                <p className="exploreCategoryHeading">Categories</p>
                <div className="exploreCategories">
                    <Link to='/category/rent' >
                        <img src={rentCategoryImage} alt="rent" className='exploreCategoryImg'/>
                        <p className="exploreCategoryName">Rooms For Rent</p>
                    </Link>
                    

                    <Link to='/category/house' >
                        <img src={houseCategoryImage} alt="house" className='exploreCategoryImg'/>
                        <p className="exploreCategoryName">Houses For Rent</p>
                    </Link>
                    

                </div>
            </main>    
        </div>   
        </>
    );
};

export default Explore;