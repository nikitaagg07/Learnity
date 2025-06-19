import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { PhotoCamera, Close as CloseIcon } from '@mui/icons-material';

const EditProfileModal = ({ open, onClose, userData, onSave }) => {
  // Log received userData for debugging
  console.log('EditProfileModal received userData:', userData);
  
  // Create default empty profile
  const defaultProfile = {
    name: userData?.name || '',
    email: userData?.email || '',
    bio: '',
    interests: '',
    avatar: ''
  };

  // Try to get stored profile from localStorage if available
  const getStoredProfile = () => {
    try {
      const storedProfile = localStorage.getItem('user-profile');
      return storedProfile ? JSON.parse(storedProfile) : null;
    } catch (e) {
      console.error('Error parsing stored profile:', e);
      return null;
    }
  };

  // Combine sources to get best available profile data
  const getInitialProfile = () => {
    const storedProfile = getStoredProfile();
    console.log('Stored profile:', storedProfile);
    // Prioritize userData from props, then localStorage, then default
    return {
      ...defaultProfile,
      ...(storedProfile || {}),
      ...(userData || {})
    };
  };

  // Initialize form state with best available data
  const [formData, setFormData] = useState(() => {
    console.log('Initializing form with userData:', userData);
    const initialProfile = getInitialProfile();
    console.log('Initial profile data:', initialProfile);
    return {
      name: initialProfile.name || '',
      email: initialProfile.email || '',
      bio: initialProfile.bio || '',
      interests: Array.isArray(initialProfile.interests) 
        ? initialProfile.interests.join(', ')
        : initialProfile.interests || ''
    };
  });

  // Update form when userData changes
  useEffect(() => {
    console.log('userData changed:', userData);
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || prev.name,
        email: userData.email || prev.email,
        bio: userData.bio || prev.bio,
        interests: Array.isArray(userData.interests)
          ? userData.interests.join(', ')
          : userData.interests || prev.interests
      }));
    }
  }, [userData]);

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(() => {
    // Try several sources for avatar in order of priority
    return userData?.avatar || 
           localStorage.getItem('user-avatar') || 
           '';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatarPreview(base64String);
        setAvatar(file);  // Save the file itself for future use
        localStorage.setItem('user-avatar', base64String);  // Store avatar in localStorage
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare updated profile data - handle case where userData might be null
      const updatedProfile = { 
        ...(userData || {}), // Keep existing data if available
        ...formData,  // Override with form data
      };

      // Convert interests string to array
      if (formData.interests) {
        updatedProfile.interests = formData.interests.split(',').map(item => item.trim());
      }

      // If a new avatar is selected, update it
      if (avatar) {
        updatedProfile.avatar = avatarPreview;
      }

      console.log('Saving updated profile:', updatedProfile);
      
      // In a real app, you would send this data to your backend
      // For now, just simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Store in localStorage as a fallback
      localStorage.setItem('user-profile', JSON.stringify(updatedProfile));

      // Call the onSave callback from parent
      onSave(updatedProfile);
      
      // Show success message
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // We now handle the case of no userData gracefully instead of rendering nothing

  return (
    <Dialog 
      open={open} 
      onClose={loading ? null : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Edit Profile</Typography>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={onClose}
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>Profile updated successfully!</Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={avatarPreview || userData?.avatar}
              alt={formData.name}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                border: theme => `4px solid ${theme.palette.primary.light}`
              }}
            >
              {formData.name?.charAt(0)}
            </Avatar>

            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
              disabled={loading}
            />
            <label htmlFor="avatar-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                disabled={loading}
              >
                Change Photo
              </Button>
            </label>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="dense"
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="bio"
                label="Bio"
                value={formData.bio}
                onChange={handleChange}
                fullWidth
                margin="dense"
                multiline
                rows={3}
                placeholder="Tell us a bit about yourself..."
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="interests"
                label="Interests"
                value={formData.interests}
                onChange={handleChange}
                fullWidth
                margin="dense"
                placeholder="e.g. Programming, Data Science, Web Development (comma separated)"
                helperText="Enter your interests separated by commas"
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={onClose}
            color="inherit"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProfileModal;