
import React, { useState , useEffect} from 'react'; 
import { getAuth, updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import MainHeadTitle from '../components/MainHeadTitle'; 
import PinkButton from '../components/PinkButton';
import '../css/PinkButton.css'; 
import '../css/ManageAccountPage.css';


function ManageAccountPage() {
  const auth = getAuth();
  // state for current user data
  const [currentUser, setCurrentUser] = useState({
    name: '',
    uid: '',
    email: '',
});
    // State variables for form inputs
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [newName, setnewName] = useState('');
    //const [newEmail, setNewEmail] = useState('');
//  fetch user data on component mount
    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setCurrentUser({
          name: storedUser.displayName || storedUser.email || 'No Name', // Or default name if displayName is not set
          email: storedUser.email,
          uid: storedUser.uid
        });
      }
    }, []);
  
    const handleChangePassword = async (e) => {
      e.preventDefault();
  
      if (newPassword !== confirmNewPassword) {
        alert('New passwords do not match!');
        return;
      }
      if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
      }
  
      try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        alert('Password updated successfully');
      } catch (error) {
        console.error('Error updating password:', error);
        alert('Error updating password');
      }
    };
    const handleChangeName = async (e) => {
      e.preventDefault();
  
      if (newName.length < 1) {
        alert('Please enter a name!');
        return;
      }
  
      try {
        const user = auth.currentUser;
        await updateProfile(user, { displayName: newName });
        setCurrentUser({ ...currentUser, name: newName });
        localStorage.setItem('user', JSON.stringify({ ...currentUser, name: newName })); 
        alert('Name updated successfully');
      } catch (error) {
        console.error('Error updating name:', error);
        alert('Error updating name');
      }
    };
    // const handleChangeEmail = async (e) => {
    //   e.preventDefault();
  
    //   if (newEmail === currentUser.email) {
    //     alert('The new email is the same as the current email!');
    //     return;
    //   }
  
    //   try {
    //     const user = auth.currentUser;
    //     const credential = EmailAuthProvider.credential(user.email, currentPassword);
    //     await reauthenticateWithCredential(user, credential);
    //     await updateEmail(user, newEmail);
    //     setCurrentUser({ ...currentUser, email: newEmail });
    //     alert('Email updated successfully');
    //   } catch (error) {
    //     console.error('Error updating email:', error);
    //     alert('Error updating email');
    //   }
    // };
  

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
                <form onSubmit={handleChangePassword} className='change-Form'>
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
                <form onSubmit={handleChangeName} className='change-Form'>
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