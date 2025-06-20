import React, { useContext, useState } from 'react';
import { TextField, Box, Button, Grid, Typography, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { UserContext } from '../context/Context';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StyledBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const MessageBar = styled(Box)(({ theme, type }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: type === 'success' ? 'green' : 'red',
  color: 'white',
  textAlign: 'center',
  padding: theme.spacing(2),
  zIndex: 1000,
}));

export const PasswordUpdate = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // Toggle for current password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle for new password visibility

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const userName = user.userName;
    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/updatePassword`,
        { userName, currentPassword, newPassword },
        {
          headers: {
            authorization: sessionStorage.getItem('accessToken'),
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setMessage('Password updated successfully');
        setMessageType('success');
      }
    } catch (e) {
      setMessage('Failed in updating password');
      setMessageType('error');
    } finally {
      setShowMessage(true);
      setLoading(false); // Stop loading
      setTimeout(() => setShowMessage(false), 2000); // Hide after 2 seconds
    }
  };

  const handleClickShowPassword = (setter) => {
    setter((prevState) => !prevState);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault(); // Prevent default behavior when clicking the icon
  };

  return (
    <StyledBox>
      <Typography variant="h5" align="center" gutterBottom>
        {user?.userName ? `You : ${user.userName}` : 'Hello, User'}
      </Typography>

      <form onSubmit={handlePasswordChange}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword(setShowCurrentPassword)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword(setShowNewPassword)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Button variant="contained" color="primary" type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
              {loading && <CircularProgress size={24} sx={{ marginLeft: 2 }} />} {/* CircularProgress */}
            </Box>
          </Grid>
        </Grid>
      </form>

      {showMessage && (
        <MessageBar type={messageType}>
          {message}
        </MessageBar>
      )}
    </StyledBox>
  );
};
