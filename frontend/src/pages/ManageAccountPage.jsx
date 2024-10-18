import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../FirebaseAuth/Firebase';
import { useNavigate } from 'react-router-dom';
import MainHeadTitle from '../components/MainHeadTitle';
import PinkButton from '../components/PinkButton';
import { toast } from 'react-toastify'; // Toastify success/error/info messages
import '../css/PinkButton.css';
import '../pages/css/ManageAccountPage.css';
import  SettingSection from '../components/SettingSection';

function ManageAccountPage() {
  const auth = getAuth();
  const navigate = useNavigate();

  // state for current user data
  const [currentUser, setCurrentUser] = useState({
    name: '',
    uid: '',
    email: '',
    iconUrl: '',
    isVerified: ''
  });

  // State variables for form inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmailPassword, setNewEmailPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newName, setnewName] = useState('');
  const [icon, setIcon] = useState(null);
  const [pfp, setPfp] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState(''); // Password to confirm deletion
  const a = 0;
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
          uid: user.uid,
          isVerified: user.emailVerified
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
  }, [navigate, a]); // 'navigate' as a dependency  

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    // Check if new passwords match and meet length requirement
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match! Please check them and try again');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long! Please correct and try again');
      return;
    }

    try {

      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Sorry, an error occurred well updating you password; Please try again');
    }
  };
  // Handle name change
  const handleChangeName = async (e) => {
    e.preventDefault();
    // Ensure new name is not empty
    if (newName.length < 1) {
      toast.error('Please enter a name!');
      return;
    }

    try {
      const user = auth.currentUser;
      await updateProfile(user, { displayName: newName });
      await user.reload(); // Reload user data from Firebase

      setCurrentUser({ ...currentUser, name: newName });
      localStorage.setItem('user', JSON.stringify({ ...currentUser, name: newName }));

      toast.success('Name updated successfully');
    } catch (error) {
      console.error('Error updating name:', error);
      toast.error('Sorry, an error occurred well updating your name. Please try again');
    }
  };

  // Handle file(icon image)input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // List of acceptable file types
    const acceptableTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'image/heic', 'image/heif'];

    if (file && !acceptableTypes.includes(file.type)) {
      // Set an error message if the file type is not acceptable
      toast.error('File type not accepted. Please upload a valid image file (JPEG, JPG, PNG, WEBP, SVG, or HEIC) and try again.');
      return;
    }

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
      toast.error('Please select an image file!');
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
      toast.success('Profile image updated successfully');
    } catch (error) {
      console.error('Error updating icon:', error);
      toast.error('Sorry a error occurred well updating your profile picture. Please try again');
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
      toast.success('Your account has been deleted successfully; We\'re sorry to see you go!');

      // Delay to show success message
      setTimeout(() => {
        auth.signOut(); // Sign out the user
        localStorage.clear(); // Clear localStorage
        navigate('/'); // Redirect to the homepage
        window.location.reload();
      }, 4000); // 4-second delay
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Sorry, an error occurred well deleting your account. Please try again.');
    }
  };

  // Function to delete related user data (e.g., Firestore, storage)
  const deleteUserData = async (uid) => {
    try {
      // Example: Delete user-related data from Firestore, Storage, etc.
      const storageRef = ref(storage, `icons/${uid}`);
      await deleteObject(storageRef); // Delete profile picture from storage
    } catch (error) {
      toast.error('Sorry, an error occurred well deleting your data. Please try again.');
      console.error('Error deleting user data:', error);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    fetchIcon(storedUser.uid)
  }, []);

  const verifyEmail = async () => {
    //get auth 
    const auth = getAuth();
    const user = auth.currentUser;
    //send user verification email
    await sendEmailVerification(user);
    //redirect to verify email page to await verification
    navigate('/verify-email');
    toast.success('Verification email sent');
  }

  const changeEmail = async (e) => {
    e.preventDefault();
    try {
      //reauthenticate the user for security reason (apparently idfk this is what the documentation said)
      const auth = getAuth();
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, passwordConfirmation);
      await reauthenticateWithCredential(user, credential);
      //then update the email - had to disable a security setting in firebase for this to work
      await updateEmail(user, newEmail);
      //reverify the new address
      await sendEmailVerification(user);
      //redirect to verify email page to await verification
      navigate('/verify-email');
      toast.success('Verification email sent');
    }
    catch (e) {
      //error message if errors
      console.error('Error updating email:', e);
      toast.error('Sorry, an error occurred well updating your email. Please try again');
    }

  }

  return (
    <div className="manage-account-page">

      <MainHeadTitle
        title="Manage Account"
        subtitle={<span><h1><img src={pfp ? pfp : 'images/profile.png'} alt="User Icon" className="subtitle-icon" />&nbsp;&nbsp;{currentUser.name}</h1> </span>}
      />
      
      {/* Main content section with different forms */}
      <div className='manage-account-page-form'>
        {/* Change Password Form */}
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
        {/* Change Name Form */}
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
        {/* Change Profile Picture Form */}
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
        {/* Change Email Section */}
        <div className='change-email'>
          <h1>Change Email</h1>
          <h4>Your current email address is {currentUser.email} </h4>
          {currentUser.isVerified ?
            <>
              <p>Enter a new email below, and please also enter your existing password</p>
              <form onSubmit={changeEmail}>
                <input id='emailChange' className="formInput" type='email' required placeholder='example@email.com' onChange={(e) => setNewEmail(e.target.value)}></input>
                <input
                  id='emailChange'
                  type='password'
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  className="formInput"
                  placeholder='************'
                />
                <PinkButton text="Change Email" />
              </form>
            </> :
            <>
              <p className='ver-button'>Your email is not verified please verify by pressing the button below</p>
              <PinkButton onClick={verifyEmail} text="Verify Email" />
            </>
          }
          <br />

        </div>
        {/* Delete Account Section */}
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
        {/*  SettingsSection  */}
      <div className="settings-section">
      <h1>Settings</h1>
      <SettingSection title="Dark Mode" description="Toggle dark mode on or off" />
       </div>
      </div>
    </div>
  );
}

export default ManageAccountPage;