import React from 'react';
import MainHeadTitle from '../components/MainHeadTitle';
import SearchBarBig from '../components/SearchBarBig'; 


function SearchPage() {
  return (
    <>
    <MainHeadTitle title="Search for your favorite products" subtitle="We're sniffing out and comparing over 1000 products for the best deals worlwide"/> 
    <SearchBarBig onSearch={(query) => console.log(query)} /> 
    </>
  );
}

export default SearchPage;
