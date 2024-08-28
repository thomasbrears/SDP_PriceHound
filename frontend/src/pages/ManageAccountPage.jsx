
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa'; 
import MainHeadTitle from '../components/MainHeadTitle'; 
import PinkButton from '../components/PinkButton';
import '../css/PinkButton.css'; 
import '../css/ManageAccountPage.css';


function ManageAccountPage() {
  // Example state for current user data
  const [currentUser, setCurrentUser] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
});
    // State variables for form inputs
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [newName, setnewName] = useState('');
// // Example: fetch user data on component mount
// useEffect(() => {
//   // Replace with actual data fetching logic
//   // fetchCurrentUser().then(user => setCurrentUser(user));
// }, []);
  
    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Basic validation
      if (newPassword !== confirmNewPassword) {
        alert('New passwords do not match!');
        return;
      }
      if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
      }
      if (newName.length < 1) {
        alert('Please enter a name!');
        return;
      }  
     
      
      // Perform password change logic here
    console.log('Current Password:', currentPassword);
    console.log('New Password:', newPassword);
    if (newName){
        console.log('New Name:', newName);
    }
    
  };


  return (
    <div className="manage-account-page">
    <MainHeadTitle 
      title="Manage Account" 
      subtitle="manage-account placeholder page"
    />
    <div className='top-title'>
        <h3>Manage your account</h3> 
        <p>subtext</p>
    </div>
    <div className='manage-account-page-form'>
    <div className='change-password'>
    <h1>Change Password</h1>
                <form onSubmit={handleSubmit} className='change-Form'>
                <label>Current Password</label>
                    <input 
                    type='password' 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    required 
                    className="formInput" 
                    placeholder='Enter your current password'
                    />
                    <label>New Password</label>
                    <input 
                    type='password' 
                    onChange={(e) => setNewPassword(e.target.value)}
                     required 
                     className="formInput" 
                     placeholder='Enter your new password'
                     />
                     <label>Confirm New Password</label>
                    <input
                     type='password' 
                     onChange={(e) => setConfirmNewPassword(e.target.value)} 
                     required git
                     className="formInput" 
                     placeholder='Confirm your new password'
                     />
                
                    <PinkButton text = "Change Password" />
                   
                </form>
    </div>
    <div className='change-name'>
    <h1>Change Password</h1>
    <p>Current name is {currentUser.name}</p>
                <form onSubmit={handleSubmit} className='change-Form'>
                <label >Enter New Name</label>
                    <input 
                    type='name' 
                    onChange={(e) => setnewName(e.target.value)} 
                    required 
                    className="formInput" 
                    placeholder='Enter your new name'
                    />
                  
                    <PinkButton text = "Change Name" />
                  
                </form>
    </div>
    <div className='change-Email'>
    <h1>Change Email</h1>
    <h3>Your current email address is {currentUser.email} </h3>
    <p>To change this, please contact us </p>
     <div className='delete-account'>           
         <h1>Delete Account</h1>
         <p>If you would like to permanently delete your account , please contact us.</p>       
    </div>
   </div>
   </div>
   </div>
  );
}

export default ManageAccountPage;