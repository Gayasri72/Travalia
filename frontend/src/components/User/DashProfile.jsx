import { Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(
    currentUser?.rest?.profilePicture || null,
  );
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();

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

  const uploadImage = async () => {
    if (!imageFile) return;
    setImageFileUploadError(null);

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'Travalia'); // Ensure this matches your Cloudinary preset

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

      // Get the Cloudinary URL from response
      const uploadedImageUrl = response.data.secure_url;

      // Update state with the Cloudinary image URL
      setImageFileUrl(uploadedImageUrl);
      setImageFileUploadingProgress(null); // Reset progress after upload
    } catch (error) {
      setImageFileUploadError('Error uploading image');
      console.error('Image upload failed:', error);
      setImageFileUploadingProgress(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />

        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
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
            src={imageFileUrl}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadingProgress && imageFileUploadingProgress < 100 && 'opacity-60'}`}
          />
        </div>

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser?.rest?.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser?.rest?.email}
        />
        <TextInput type="password" id="password" placeholder="password" />

        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>

      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>

      {/* Show upload error if any */}
      {imageFileUploadError && (
        <div className="text-red-500 mt-2">{imageFileUploadError}</div>
      )}
    </div>
  );
}
