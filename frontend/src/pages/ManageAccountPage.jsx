
import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import MainHeadTitle from '../components/MainHeadTitle';
import PinkButton from '../components/PinkButton';
import '../css/PinkButton.css';
import '../css/ManageAccountPage.css';
import { storage } from '../FirebaseAuth/Firebase';
import Message from '../components/Message';

function ManageAccountPage() {
  const auth = getAuth();
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
  //const [newEmail, setNewEmail] = useState('');
  //  fetch user data on component mount
  useEffect(() => {
    const url = localStorage.getItem('icon');
    setPfp(url)
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setCurrentUser({
        name: storedUser.displayName || storedUser.email || 'No Name', // Or default name if displayName is not set
        email: storedUser.email,
        uid: storedUser.uid,
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
  const handleFileChange = (e) => {
    setIcon(e.target.files[0]); // Set the selected file to the state
    //https post goes here.
  };

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

  const handleChangeIcon = async (e) => {
    if (!icon) {
      alert('Please select an icon file!');
      return;
    }
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storageRef = ref(storage, `icons/${storedUser.uid}`);
      await uploadBytes(storageRef, icon, {
        contentType: icon.type,
      });
      alert("pfp change successful")
      fetchIcon(storedUser.uid)
    } catch (error) {
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

            <PinkButton text="Change Password" />

          </form>
        </div>
        <div className='change-name'>
          <h1>Change Name </h1>
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

            <PinkButton text="Change Name" />

          </form>
        </div>
        <div className='change-icon'>
          <h1>Change Icon</h1>
          <form onSubmit={handleChangeIcon} className='change-Form'>
            <label>Select New Icon</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              required
              className="formInput"
            />
            <PinkButton text="Change Icon" />
          </form>
        </div>
        <div className='change-email'>
          <h1>Change Email</h1>
          <h3>Your current email address is {currentUser.email} </h3>
          <p>To change this, please contact us.</p>
        </div>
        <div className='delete-account'>
          <h1>Delete Account</h1>
          <p>If you would like to permanently delete your account , please contact us.</p>
        </div>
      </div>
    </div>
  );
}

export default ManageAccountPage;