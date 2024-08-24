import React from 'react';
import MainHeadTitle from '../components/MainHeadTitle'; 
import PinkButton from '../components/PinkButton'; 
import SearchBarBig from '../components/SearchBarBig'; 
import ProductCard from '../components/ProductCard';
import CategoryButton from '../components/CategoryButton';

function TestPage() {
  return (
    <div style={styles.container}>
      <MainHeadTitle />
      <PinkButton text="Try it out today: Search a product" />
      <SearchBarBig onSearch={(query) => console.log('Searching for:', query)} />
      <ProductCard productName="Product Name" price={9.99} />
      <CategoryButton categoryName="Laptops" />
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