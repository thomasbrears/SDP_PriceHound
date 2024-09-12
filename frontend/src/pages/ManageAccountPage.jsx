import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../FirebaseAuth/Firebase';
import { useNavigate } from 'react-router-dom';
import MainHeadTitle from '../components/MainHeadTitle';
import PinkButton from '../components/PinkButton';
import Message from '../components/Message';
import '../css/PinkButton.css';
import '../css/ManageAccountPage.css';


function ManageAccountPage() {
  const auth = getAuth();
  const navigate = useNavigate();

  // state for current user data
  const [currentUser, setCurrentUser] = useState({
    name: '',
    uid: '',
    email: '',
    iconUrl: ''
  });

  const [messageInfo, setMessageInfo] = useState({ message: '', type: '' });
  // State variables for form inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newName, setnewName] = useState('');
  const [icon, setIcon] = useState(null);
  const [pfp, setPfp] = useState(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState(''); // Password to confirm deletion
  //const [newEmail, setNewEmail] = useState('');

  //  fetch user data on component mount
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, update user state
        setCurrentUser({
          name: user.displayName || 'No Name',
          email: user.email,
          uid: user.uid
        });
        localStorage.setItem('user', JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          uid: user.uid
        }));
      } else {
        // User is signed out or account deleted
        localStorage.clear(); // Clear any stored user data
        navigate('/login'); // Redirect to login page or homepage
      }
    });
  
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]); // 'navigate' as a dependency  

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setMessageInfo({ message: 'New passwords do not match!', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setMessageInfo({ message: 'Password must be at least 6 characters long!', type: 'error' });
      return;
    }

    try {

      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessageInfo({ message: 'Password updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating password:', error);
      setMessageInfo({ message: 'Error updating password', type: 'error' });
    }
  };

  const handleChangeName = async (e) => {
    e.preventDefault();

    if (newName.length < 1) {
      setMessageInfo({ message: 'Please enter a name!', type: 'error' });
      return;
    }

    try {
      const user = auth.currentUser;
      await updateProfile(user, { displayName: newName });
      await user.reload(); // Reload user data from Firebase

      setCurrentUser({ ...currentUser, name: newName });
      localStorage.setItem('user', JSON.stringify({ ...currentUser, name: newName }));

      setMessageInfo({ message: 'Name updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating name:', error);
      setMessageInfo({ message: 'Error updating name; Please try again', type: 'error' });
    }
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // List of acceptable file types
    const acceptableTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'image/heic', 'image/heif'];
  
    if (file && !acceptableTypes.includes(file.type)) {
      // Set an error message if the file type is not acceptable
      setMessageInfo({ message: 'File type not accepted. Please upload a valid image file (JPEG, JPG, PNG, WEBP, SVG, or HEIC).', type: 'error' });
      return;
    }
    
    // Clear previous messages and proceed with file handling if valid
    setMessageInfo({ message: '', type: '' });
    setIcon(file); // Set the selected file to the state
  };
  
//function for fetching the icon based on the uid from firebase
  const fetchIcon = async (uid) => {
    try {
      const storageRef = ref(storage, `icons/${uid}`);
      const url = await getDownloadURL(storageRef);
      localStorage.setItem('icon', url)
      setPfp(url);
    }
    catch (error) {
    }
  }
  //function for handling the icon change, gets the file inputed by the user then uploads it to firebase and changes the link in local storage
  const handleChangeIcon = async (e) => {
    if (!icon) {
      setMessageInfo({ message: 'Please select an image file!', type: 'error' });
      return;
    }
    try {
      //here it is uploaded and changes
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storageRef = ref(storage, `icons/${storedUser.uid}`);
      await uploadBytes(storageRef, icon, {
        contentType: icon.type,
      });
      //returns message based on success
      setMessageInfo({ message: 'Icon updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating icon:', error);
      setMessageInfo({ message: 'Error updating icon', type: 'error' });
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your account? THIS ACTION CANOT BE UNDONE!')) {
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, passwordConfirmation); // Reauthenticate with the password
      await reauthenticateWithCredential(user, credential);
      await deleteUserData(user.uid); // Delete user data
      await user.delete(); // Delete user account from Firebase Auth
      setMessageInfo({ message: 'Your account has been deleted successfully; Have a good day', type: 'success' });
            
      // Delay to show success message
      setTimeout(() => {
        auth.signOut(); // Sign out the user
        localStorage.clear(); // Clear localStorage
        navigate('/'); // Redirect to the homepage
        window.location.reload(); 
      }, 4000); // 4-second delay
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessageInfo({ message: 'Error deleting account. Please try again.', type: 'error' });
    }
  };

  // Function to delete related user data (e.g., Firestore, storage)
  const deleteUserData = async (uid) => {
    try {
      // Example: Delete user-related data from Firestore, Storage, etc.
      const storageRef = ref(storage, `icons/${uid}`);
      await deleteObject(storageRef); // Delete profile picture from storage
    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    fetchIcon(storedUser.uid)
  }, []);

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
        subtitle={<span><h1><img src={pfp ? pfp : 'images/profile.png'} alt="User Icon" className="subtitle-icon" />&nbsp;&nbsp;{currentUser.name}</h1> </span>}
      />

      <div className='manage-account-page-form'>

        <div className='change-password'>
          <h1>Change Password</h1>
          <form onSubmit={handleChangePassword} className='change-Form'>
            <label>Please enter your Current Password</label>
            <input
              type='password'
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="formInput"
              placeholder='************'
            />
            <label>Please enter your New Password</label>
            <input
              type='password'
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="formInput"
              placeholder='************'
            />
            <label>Please Confirm your New Password</label>
            <input
              type='password'
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required git
              className="formInput"
              placeholder='************'
            />

            <PinkButton text="Change Password" />

          </form>
        </div>
        <div className='change-name'>
          <h1>Change Name </h1>
          <p>Currently your name is set to, {currentUser.name}</p>
          <br />
          <form onSubmit={handleChangeName} className='change-Form'>
            <label >Please enter a new name</label> 
            <input
              type='name'
              onChange={(e) => setnewName(e.target.value)}
              required
              className="formInput"
              placeholder='e.g. John Doe'
            />

            <PinkButton text="Change Name" />

          </form>
        </div>
        <div className='change-icon'>
          <h1>Change Profile Picture</h1>
          <form onSubmit={handleChangeIcon} className='change-Form'>
            <label>Please select New Profile Picture</label>
            <input
              type='file'
              accept='.jpg, .jpeg, .png, .webp, .svg, .heic, .heif' // Specify accepted image file types
              onChange={handleFileChange}
              required
              className="formInput"
            />
            <PinkButton text="Change Picture" />
          </form>
        </div>

        <div className='change-email'>
          <h1>Change Email</h1>
          <h4>Your current email address is {currentUser.email} </h4>
          <p>To change this, please contact us</p>
          <br />
          <PinkButton text="Contact us" to="/contact" />
        </div>

        <div className='delete-account'>
          <h1>Delete Account</h1>
          <p>To permanently delete your account, please authenticate by entering your password below. <br /> <b>This action is irreversible</b></p>
          <input
            type='password'
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            className="formInput"
            placeholder='*************'
          />
          <PinkButton text="Delete Account" onClick={handleDeleteAccount} />
        </div>

      </div>
      {messageInfo.message && ( <Message key={Date.now()} message={messageInfo.message} type={messageInfo.type} />)}                
    </div>
  );
}

export default ManageAccountPage;