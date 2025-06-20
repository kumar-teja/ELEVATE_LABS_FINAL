import { Box, TextField, styled, Button, Typography, IconButton, InputAdornment ,CircularProgress} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../context/Context";
import { useNavigate } from "react-router-dom";

const Component = styled(Box)(({ theme }) => ({
  width: '400px',
  margin: 'auto',
  boxShadow: '5px 2px 5px 2px rgb(0 0 0 / 0.6)',
  [theme.breakpoints.down('sm')]: {
    width: '300px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
    boxShadow: "none",
  },
}));

const Image = styled('img')(({ theme }) => ({
  width: 100,
  margin: 'auto',
  display: 'flex',
  paddingTop: '50px',
  [theme.breakpoints.down('sm')]: {
    paddingTop: '30px',
  },
  [theme.breakpoints.down('md')]: {
    paddingTop: '40px',
  },
}));

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: '25px 35px',
  flex: 1,
  flexDirection: 'column',
  '& > div, & > button, & > p': {
    marginTop: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '20px 25px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '15px 20px',
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  background: '#fb641b',
  height: '48px',
  borderRadius: '10px',
}));

const SignupButton = styled(Button)(({ theme }) => ({
  background: '#fff',
  color: '#2874f0',
  height: '48px',
  boxShadow: '0 2px 4px 0 rgb(0 0 0 / 20%)',
}));

const TextColour = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: '#878787',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '15px',
  },
}));

export function Signup({ setAuthenticated }) {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage,setErrormessage]=useState("")
  const [firstName, setFirstname] = useState("");
  const [loading,setLoading]=useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const imageURL = "https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png";
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onClickHandler = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/users/signup`, {
        userName, // Remember to match these fields with your backend
        password,
        firstName,
      });
      if (response.status === 200) {
        const userName = response.data.userName;
        const firstName = response.data.firstName;
        const accessToken = response.data.accessToken;
        sessionStorage.setItem("accessToken", `Bearer ${accessToken}`);
        setUser({ userName, firstName });
        console.log(response.data); // Log the response data
        
        setAuthenticated(true);
        navigate("/home");
      }
    } catch (e) {
      
      console.error("Error during signup:", e.message);
      setErrormessage("Username already exists..")
      
    }finally{
      setLoading(false)
    }
  };
  sessionStorage.clear();

  return (
    <Component style={{ marginTop: "40px" }}>
      <Box>
        <Image src={imageURL} alt="Login" />
        <Wrapper>
          <TextField
            variant="standard"
            onChange={(e) => setFirstname(e.target.value)}
            label="Enter Name"
            name="firstName"
          />
          <TextField
            variant="standard"
            type="email"
            onChange={(e) => setUsername(e.target.value)}
            label="Enter Email"
            name="username"
          />
          <TextField
            variant="standard"
            onChange={(e) => setPassword(e.target.value)}
            label="Enter Password"
            name="password"
            type={showPassword ? "text" : "password"} // Toggle between text and password
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errorMessage && (
            <Typography color="error" style={{ marginTop: "10px" }}>
              {errorMessage}
            </Typography>
          )}
          
            {
              loading ? <Box 
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="50px">
                <CircularProgress></CircularProgress>
              </Box> : 
              <LoginButton variant="contained" onClick={onClickHandler}>
                Sign Up
              </LoginButton>
            }  
          <TextColour style={{ textAlign: "center" }}>OR</TextColour>
          <SignupButton
            variant="text"
            onClick={() => {
              navigate("/login");
            }}
          >
            Already have an Account
          </SignupButton>
        </Wrapper>
      </Box>
    </Component>
  );
}
