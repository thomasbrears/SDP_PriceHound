import React, { useEffect, useState } from "react";
import '../css/WishListPage.css'
import MainHeadTitle from "../components/MainHeadTitle";
import ProductCard from "../components/ProductCard";
import PinkButton from "../components/PinkButton";
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../FirebaseAuth/Firebase';
function WishlistPage() {
  const name = "John"
  const title = name + "'s Wishlist"
  const firestoreURL = 'https://firebasestorage.googleapis.com/v0/b/pricehound-aut.appspot.com/o/';
  const [backendData, setBackendData] = useState({})

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const getItems = async () => {
      const formData =
      {
        uid: storedUser.uid
      }
      try {
        const response = await axios.post('http://localhost:8000/api/wishlist/get', formData);
        console.log(response.data)
        setBackendData(response.data)
      }
      catch (error) {
        alert("unlucky")
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

  const displayedItems = wishlistItems.slice(0, itemsToShow);
  const count = displayedItems.length;
  const total = wishlistItems.length;
  return (
    <div className="wishlist-page">
      <MainHeadTitle
        title={title}
        subtitle=" wishlist plsaceholder page"
      />
      <div className="products">
        {(typeof backendData === 'undefined') ? <p>Loading ....</p> : wishlistItems != 0 ?
          displayedItems.map((item, index) => (
            <ProductCard
              productImg={item.logo}
              productName={item.name}
              price={item.price}
              link={item.link}
              date={item.date}
            />
          )) : <p>Your wishlist is empty ... to add items press the add to wishlist button while viewing an item you like</p>}
      </div>

      <div className="buttonCenter">

        <p>Displaying {count} of a total of {total} items</p>
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
