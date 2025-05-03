import { Alert, Button, Modal, TextInput, Card, Avatar, Badge, Tabs } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutSuccess,
} from '../../redux/user/userSlice';
import { 
  HiOutlineExclamationCircle, 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineCalendar, 
  HiOutlineCog, 
  HiOutlineLogout, 
  HiOutlineTrash,
  HiOutlinePencil
} from 'react-icons/hi';

export default function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(
    currentUser?.profilePicture || currentUser?.rest?.profilePicture || null,
  );
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const [updateUserSuccess, setupdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file)); // Preview image before upload
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  // Upload Image to Cloudinary
  const uploadImage = async () => {
    if (!imageFile) return;
    setImageFileUploadError(null);

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'Travalia');

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dbonnmmkj/image/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setImageFileUploadingProgress(progress);
          },
        },
      );

      const uploadedImageUrl = response.data.secure_url;
      setImageFileUrl(uploadedImageUrl);
      setFormData((prevFormData) => ({
        ...prevFormData,
        profilePicture: uploadedImageUrl,
      }));
      setImageFileUploadingProgress(null);
    } catch (error) {
      setImageFileUploadError('Error uploading image');
      setImageFileUploadingProgress(null);
      console.error('Image upload error:', error);
    }
  };

  // Handle Form Input Changes
  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };

  // Handle Profile Update Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes were made.');
      return;
    }

    try {
      dispatch(updateStart());

      const res = await fetch(
        `/api/users/update/${currentUser?._id || currentUser?.rest?._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setupdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `/api/users/delete/${currentUser?._id || currentUser?.rest?._id}`,
        {
          method: 'DELETE',
        },
      );
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/users/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="md:col-span-1">
          <Card className="mb-4">
            <div className="flex flex-col items-center pb-10">
              <div className="relative mb-3">
                <div
                  className="relative w-32 h-32 cursor-pointer"
                  onClick={() => filePickerRef.current.click()}
                >
                  {imageFileUploadingProgress !== null && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <CircularProgressbar
                        value={imageFileUploadingProgress}
                        text={`${imageFileUploadingProgress}%`}
                        strokeWidth={5}
                        styles={{
                          path: {
                            stroke: `rgba(62,152,199,${imageFileUploadingProgress / 100})`,
                          },
                          text: { fill: '#fff', fontSize: '16px' },
                        }}
                      />
                    </div>
                  )}
                  <img
                    src={imageFileUrl || currentUser?.profilePicture || currentUser?.rest?.profilePicture}
                    alt="user"
                    className="rounded-full w-full h-full object-cover border-4 border-gray-200"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={filePickerRef}
                    hidden
                  />
                </div>
              </div>
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                {currentUser?.username || currentUser?.rest?.username}
              </h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentUser?.email || currentUser?.rest?.email}
              </span>
              <div className="mt-4">
                <Badge color={currentUser?.rest?.isAdmin ? "success" : "info"}>
                  {currentUser?.rest?.isAdmin ? "Admin" : "User"}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                color={activeTab === 'profile' ? 'blue' : 'gray'}
                onClick={() => setActiveTab('profile')}
                className="justify-start"
              >
                <HiOutlineUser className="mr-2 h-5 w-5" />
                Profile
              </Button>
              <Button
                color={activeTab === 'settings' ? 'blue' : 'gray'}
                onClick={() => setActiveTab('settings')}
                className="justify-start"
              >
                <HiOutlineCog className="mr-2 h-5 w-5" />
                Settings
              </Button>
              <Button
                color="gray"
                onClick={handleSignout}
                className="justify-start"
              >
                <HiOutlineLogout className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
              <Button
                color="failure"
                onClick={() => setShowModel(true)}
                className="justify-start"
              >
                <HiOutlineTrash className="mr-2 h-5 w-5" />
                Delete Account
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <Card>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              {activeTab === 'profile' ? 'Profile Information' : 'Account Settings'}
            </h5>

            {activeTab === 'profile' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Username
                    </label>
                    <TextInput
                      type="text"
                      id="username"
                      placeholder="Username"
                      defaultValue={currentUser?.username || currentUser?.rest?.username}
                      onChange={handleChange}
                      icon={HiOutlineUser}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Email
                    </label>
                    <TextInput
                      type="email"
                      id="email"
                      placeholder="Email"
                      defaultValue={currentUser?.email || currentUser?.rest?.email}
                      onChange={handleChange}
                      icon={HiOutlineMail}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <TextInput
                    type="password"
                    id="password"
                    placeholder="New Password"
                    onChange={handleChange}
                    icon={HiOutlineLockClosed}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" gradientDuoTone="purpleToBlue">
                    Update Profile
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h6 className="text-lg font-semibold mb-2">Account Details</h6>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-600 dark:text-gray-300">
                      <HiOutlineUser className="mr-2 h-5 w-5" />
                      Username: {currentUser?.username || currentUser?.rest?.username}
                    </p>
                    <p className="flex items-center text-gray-600 dark:text-gray-300">
                      <HiOutlineMail className="mr-2 h-5 w-5" />
                      Email: {currentUser?.email || currentUser?.rest?.email}
                    </p>
                    <p className="flex items-center text-gray-600 dark:text-gray-300">
                      <HiOutlineCalendar className="mr-2 h-5 w-5" />
                      Member since: {new Date(currentUser?.createdAt || currentUser?.rest?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h6 className="text-lg font-semibold mb-2">Security</h6>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    For security reasons, please change your password regularly.
                  </p>
                  <Button gradientDuoTone="purpleToBlue" onClick={() => setActiveTab('profile')}>
                    Change Password
                  </Button>
                </div>
              </div>
            )}

            {/* Alerts */}
            {imageFileUploadError && (
              <Alert color="failure" className="mt-4">
                {imageFileUploadError}
              </Alert>
            )}
            {updateUserError && (
              <Alert color="failure" className="mt-4">
                {updateUserError}
              </Alert>
            )}
            {updateUserSuccess && (
              <Alert color="success" className="mt-4">
                {updateUserSuccess}
              </Alert>
            )}
          </Card>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal show={showModel} onClose={() => setShowModel(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModel(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
