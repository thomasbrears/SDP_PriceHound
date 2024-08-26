import React from 'react'
import ProductCard from '../components/ProductCard'
import LogOutButton from '../components/LogOutButton'
import LoginButton from '../components/LoginButton'

function WishList() {
  return (
    <div>
      <LoginButton/>
      <ProductCard productName="Product name" price={200.00} link="/product/1" />
    </div>
  )
}

export default WishList
