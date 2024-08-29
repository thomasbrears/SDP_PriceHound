import React, { useState } from "react";
import '../css/WishListPage.css'
import MainHeadTitle from "../components/MainHeadTitle";
import ProductCard from "../components/ProductCard";
import PinkButton from "../components/PinkButton";
function WishlistPage() {
  const name = "John"
  const title = name + "'s Wishlist"
  const wishlistItems = [
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" },
    { productName: "Product 1", price: 200.00, link: "/product/1" }

  ];

  const [itemsToShow, setItemsToShow] = useState(7);

  function LoadMore() {
    setItemsToShow(itemsToShow + 7)
  }
  function LoadLess(){
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
        {wishlistItems != 0 ?
        displayedItems.map((item, index) => (
          <ProductCard
            productName={item.productName}
            price={item.price}
            link={item.link}
          /> 
        )) : <p>Your wishlist is empty ... to add items press the add to wishlist button while viewing an item you like</p>}
      </div>

      <div className="buttonCenter">
        
        <p>Displaying {count} of a total of {total} items</p>
       {count != total ? <PinkButton
          text="Load More"
          onClick={LoadMore}
        /> : <PinkButton
        text="Load Less"
        onClick={LoadLess}
      />
       }
      </div>
    </div>
  );
}

export default WishlistPage;
