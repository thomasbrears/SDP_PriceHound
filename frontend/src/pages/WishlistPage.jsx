import React, { useEffect, useState } from "react";
import '../pages/css/WishListPage.css'
import MainHeadTitle from "../components/MainHeadTitle";
import WishlistCard from "../components/WishlistCard";
import PinkButton from "../components/PinkButton";
import { toast } from 'react-toastify'; // Toastify success/error/info messages
import axios from 'axios';
import Loading from "../components/Loading";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../FirebaseAuth/Firebase';

function WishlistPage() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const name = storedUser.displayName;
  const title = name + "'s Wishlist"
  const [backendData, setBackendData] = useState({})
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Dynamically determine the API URL based on environment
  const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://pricehound.tech/api'
    : 'http://localhost:8000/api';

  //runs a use effect when the page is loaded, this useeffect retrieves the wishlist information based on the uid stored in the local storage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const getItems = async () => {
      //sends an object as the request body
      const formData =
      {
        uid: storedUser.uid
      }
      try {
        const response = await axios.post(`${API_URL}/wishlist/get`, formData);
        console.log(response.data)
        //set the usestate variable to the repsonse
        setBackendData(response.data)
      }
      catch (error) {
        toast.error('Sorry, we ran into an error retrieving your wishlist');
        console.error('Error retrieving wishlist:', error);
      }
    }
    getItems();
  }, [])

  const wishlistItems = Object.values(backendData || {});

  //code for handling how many items to show theres 7 items per line,
  // it starts by showing 1 line and if the use presses show more it adds 7
  //and when its showing all show less appears where it sets the showing count to 7

  const [itemsToShow, setItemsToShow] = useState(7);

  function LoadMore() {
    setItemsToShow(itemsToShow + 7)
  }
  function LoadLess() {
    setItemsToShow(7)
  }

  //function for removing item from wishlist, sends the uid and the item name to the backend
  //and updates with the new data everytime one is removed
  const handleRemove = () => {
    const fetchData = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const formData = { uid: storedUser.uid };
      try {
        const response = await axios.post(`${API_URL}/wishlist/get`, formData);
        setBackendData(response.data);
      } catch (error) {
        toast.error('Sorry, we ran into an error retrieving your wishlist');
        console.error('Error fetching wishlist:', error);
      }
    };
    fetchData();
  };

  const displayedItems = wishlistItems.slice(0, itemsToShow);
  const count = displayedItems.length;
  const total = wishlistItems.length;
  return (
    <div className="wishlist-page" style={{ backgroundColor: 'var(--secondary-bg-color)' }}>
      {loading && <Loading message={loadingMessage} />}
      
      <MainHeadTitle
        title={title}
        subtitle="When viewing a product press Add to wishlist to be able to view it here"
      />
      <div className="products">
        {(typeof backendData === 'undefined') ? <p>Loading ....</p> : wishlistItems != 0 ?
          displayedItems.map((item, index) => (
            <WishlistCard
              productImg={item.logo}
              productName={item.name}
              price={item.price}
              link={item.link}
              date={item.date}
              //calls remove item function with onRemove is called in the comparision card
              onRemove={handleRemove}
            />
          )) : <p>Your wishlist is empty ... to add items press the add to wishlist button while viewing an item you like</p>}
      </div>

      <div className="buttonCenter">

        <p>Displaying {count} of {total} products</p>
        {count != total ? <PinkButton
          text="Load More"
          onClick={LoadMore}
        /> : total <= 7 ? <></> : <PinkButton
          text="Load Less"
          onClick={LoadLess}
        />
        }
      </div>
    </div>
  );
}

export default WishlistPage;
