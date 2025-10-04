import React, { useState, useContext } from "react";
import { HiOutlineX } from "react-icons/hi";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector";
import uploadImage from "../../utils/uploadImage";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const ProfileUpdateModal = ({ isOpen, onClose }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, updateUser } = useContext(UserContext);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileImage) {
      setError("Please select a profile image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Upload image first
      const imgUploadRes = await uploadImage(profileImage);
      const profileImageUrl = imgUploadRes.imageUrl || "";

      // Update user profile with new image URL
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        profileImageUrl
      });

      if (response.data) {
        // Update user context with new profile image
        updateUser({ ...user, profileImageUrl });
        onClose();
        setProfileImage(null);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Profile Picture</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <HiOutlineX className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleUpdateProfile}>
          <div className="mb-6">
            <ProfilePhotoSelector 
              image={profileImage} 
              setImage={setProfileImage} 
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;