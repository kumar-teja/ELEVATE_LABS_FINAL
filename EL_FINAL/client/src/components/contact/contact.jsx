import React, { useState } from 'react';
import { Box, TextField, Button, Typography, styled , CircularProgress} from '@mui/material';
import { Header } from '../home/header';
import axios from 'axios';

export const Wrapping = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 58px;
`;

export const Contact = () => {
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading , setLoading] =  useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(false);
    setError('');
    setLoading(true)

    // Clear the input fields
    setContactInfo({
      name: '',
      email: '',
      message: '',
    });

    const accessToken = sessionStorage.getItem('accessToken');

    try {
      // Make the POST request with axios
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/contact`, contactInfo, {
        headers: {
          Authorization: `${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error('Error sending contact form:', err);
      setError('Failed to send your message. Please try again later.');
    }finally{
      setLoading(false);
    }
  };

  return (
    <Wrapping>
      <Header />
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          mt: 4,
        }}
        onSubmit={handleSubmit}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          Contact Us
        </Typography>

        <TextField
          label="Name"
          name="name"
          value={contactInfo.name}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={contactInfo.email}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Message"
          name="message"
          value={contactInfo.message}
          onChange={handleChange}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          sx={{ mb: 2 }}
        />
      {loading ? <Box 
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="50px"> <CircularProgress/></Box>: <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>}
        

        {isSubmitted && (
          <Typography variant="body1" color="green" sx={{ mt: 2 }}>
            Thank you for contacting us! Your message has been received.
          </Typography>
        )}

        {error && (
          <Typography variant="body1" color="red" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Wrapping>
  );
};
