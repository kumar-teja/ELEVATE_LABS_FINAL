import { Header } from "../home/header";
import { Wrapping } from "../home/Home";
import { UserContext } from "../context/Context";
import { Box, styled, FormControl, InputBase, Button, TextareaAutosize, Typography } from "@mui/material";
import { AddCircle as Add } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Loader } from "./loader";

const Image = styled("img")(({ theme }) => ({
    width: "100%",
    height: "50vh",
    objectFit: "cover",
    [theme.breakpoints.down("sm")]: {
      height: "30vh",
    },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    marginTop: "10px",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
}));

const StyledLabel = styled(InputBase)(({ theme }) => ({
    flex: 1,
    margin: "0 20px",
    fontSize: "24px",
    [theme.breakpoints.down("sm")]: {
      margin: "10px 0",
    },
}));

const Container = styled(Box)(({ theme }) => ({
    margin: "0px 100px 50px 100px",
    [theme.breakpoints.down("md")]: {
      margin: "0px 20px 30px 20px",
    },
    [theme.breakpoints.down("sm")]: {
      margin: "0px 10px 20px 10px",
    },
}));

const TextArea = styled(TextareaAutosize)(({ theme }) => ({
    width: "100%",
    marginTop: "15px",
    fontSize: "18px",
    border: "none",
    "&:focus-visible": {
      outline: "none",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "16px",
    },
}));

const ErrorText = styled(Typography)`
    color: red;
    margin-top: 10px;
`;

const initialPost = {
    title: "",
    description: "",
    picture: "",
    userName: "",
    categories: "",
    createdDate: new Date()
};

export const CreatePost = () => {
    const [post, setPost] = useState(initialPost);
    const [file, setFile] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Add loading state
    const { user } = useContext(UserContext);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const uploadImage = async () => {
            if (file) {
                setLoading(true); // Show loader
                try {
                    const data = new FormData();
                    data.append("file", file);
                    const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/upload`, data);
                    const imageUrl = response.data.imageUrl;
                    setImageUrl(imageUrl);
                    setPost(prevPost => ({ ...prevPost, picture: imageUrl }));
                    setError(""); // Clear error if image is uploaded successfully
                } catch (e) {
                    console.log("Failed to Get Response", e);
                    setError("Failed to upload image");
                } finally {
                    setLoading(false); // Hide loader
                }
            }
        };
        uploadImage();
    }, [file]);

    useEffect(() => {
        setPost(prevPost => ({
            ...prevPost,
            categories: location.search?.split("=")[1] || "All",
            userName: user.userName
        }));
    }, [location.search, user.userName]);

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!post.picture) {
            setError("Please upload an image before submitting your post.");
            return;
        }

        try {
            const token = sessionStorage.getItem('accessToken');
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/posts`, post, {
                headers: {
                    authorization: token,
                }
            });

            if (response.status === 200 || response.data.success) {
                console.log("Post created successfully");
                navigate("/home");
            } else {
                console.error("Failed to create post, response not successful");
            }

        } catch (error) {
            console.error("Failed to create post", error);
        }
    };

    const defaultImageUrl = "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=&ixlib=rb-1.2.1&w=1000&q=80";

    return (
        <Wrapping>
            <Header />
            <Container>
                <Image src={imageUrl || defaultImageUrl} alt="Banner" />
                <StyledFormControl>
                    <label htmlFor="fileInput"><Add fontSize="large" color="action" /></label>
                    <input 
                        type="file" 
                        id="fileInput" 
                        style={{ display: "none" }} 
                        onChange={e => setFile(e.target.files[0])} 
                    />
                    <StyledLabel 
                        placeholder="Title" 
                        onChange={handleChange} 
                        name="title" 
                        value={post.title} 
                    />
                    <Button variant="contained" onClick={handleSubmit}>Post</Button>
                </StyledFormControl>
                <TextArea 
                    minRows={5} 
                    placeholder="Share your Thoughts" 
                    name="description" 
                    onChange={handleChange} 
                    value={post.description} 
                />
                {error && <ErrorText>{error}</ErrorText>}
            </Container>
            {loading && <Loader />} 
        </Wrapping>
    );
};
