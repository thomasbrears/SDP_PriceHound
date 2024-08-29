/* USE THIS PAGE TO TEST COMPONENTS ETC. */

import React from 'react';
import MainHeadTitle from '../components/MainHeadTitle'; 
import PinkButton from '../components/PinkButton'; 
import SearchBarBig from '../components/SearchBarBig'; 
import ProductCard from '../components/ProductCard';
import CategoryButton from '../components/CategoryButton';
import ComparisonCard from '../components/ComparisonCard';

function TestPage() {
  return (
    <div style={styles.container}>
      <MainHeadTitle />
      <PinkButton text="Try it out today: Search a product" />
      <SearchBarBig onSearch={(query) => console.log('Searching for:', query)} />
      <ProductCard productName="Product Name" price={9.99} />
      <CategoryButton categoryName="Laptops" />
      <ComparisonCard
        logo="/images/apple.png"
        title="PB Technologies Ltd"
        price="$1098.99"
        link="#"
        shippingInfo="This retailer typically offers Free worldwide shipping on orders over $100"
        deliveryTime="Estimated delivery is 2-5 Working Days"
        location="This seller is based in and ships from New Zealand"
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
};

export default TestPage;