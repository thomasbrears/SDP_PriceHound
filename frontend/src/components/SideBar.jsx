// import React, { useState } from 'react';

// const Sidebar = ({ onFilterChange }) => {
 
//   const [selectedBrands, setSelectedBrands] = useState([]);
//   const [selectedCategories, setSelectedCategories] = useState([]);
  
//   // Function to handle filter change
//   const handleFilterChange = () => {
//     onFilterChange({  selectedBrands, selectedCategories });
//   };

//   return (
//     <div className="sidebar">
      

//       {/* Brand Section */}
//       <div className="sidebar-section">
//         <h4>Brand</h4>
//         {['Brand 1', 'Brand 2', 'Brand 3'].map((brand, index) => (
//           <div key={index}>
//             <input
//               type="checkbox"
//               value={brand}
//               onChange={(e) => {
//                 const newSelection = e.target.checked
//                   ? [...selectedBrands, brand]
//                   : selectedBrands.filter((b) => b !== brand);
//                 setSelectedBrands(newSelection);
//                 handleFilterChange();
//               }}
//             />
//             {brand}
//           </div>
//         ))}
//       </div>

//       {/* Category Section */}
//       <div className="sidebar-section">
//         <h4>Category</h4>
//         {['Category 1', 'Category 2', 'Category 3'].map((category, index) => (
//           <div key={index}>
//             <input
//               type="checkbox"
//               value={category}
//               onChange={(e) => {
//                 const newSelection = e.target.checked
//                   ? [...selectedCategories, category]
//                   : selectedCategories.filter((c) => c !== category);
//                 setSelectedCategories(newSelection);
//                 handleFilterChange();
//               }}
//             />
//             {category}
//           </div>
//         ))}
//       </div>

     
//     </div>
//   );
// };

// export default Sidebar;
