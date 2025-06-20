import { Header } from "../home/header";
import { Wrapping } from "../home/Home";
import { UserContext } from "../context/Context";
import { Box, styled, FormControl, InputBase, Button, TextareaAutosize } from "@mui/material";
import { AddCircle as Add } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Loader } from "./loader";
import axios from "axios";

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

const initialPost = {
  title: "",
  description: "",
  picture: "",
  userName: "",
  categories: "",
  createdDate: new Date(),
};

export const UpdatePost = () => {
  const [post, setPost] = useState(initialPost);
  const [file, setFile] = useState(null);
  const [loading,setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(
    initialPost.picture ||
      "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=&ixlib=rb-1.2.1&w=1000&q=80"
  );

  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/getpost/${id}`, {
          headers: {
            authorization: `${token}`,
          },
        });

        if (response.status === 200) {
          setPost(response.data);
          setImageUrl(
            response.data.picture ||
              "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=&ixlib=rb-1.2.1&w=1000&q=80"
          );
        } else {
          console.error("Failed to fetch post data");
        }
      } catch (error) {
        console.error("Error fetching post data", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const uploadImage = async () => {
      if (file) {
        setLoading(true)
        try {
          const data = new FormData();
          data.append("file", file);
          const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/upload`, data); 
          const imageUrl = response.data.imageUrl;
          setImageUrl(imageUrl);  // Update the state with the new image URL
          setPost(prevPost => ({ ...prevPost, picture: imageUrl }));
        } catch (e) {
          console.log("Failed to Get Response", e);
        } finally{
          setLoading(false);
        }
      }
    };
    uploadImage();
  }, [file]);

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/updatepost/${id}`,
        post,
        {
          headers: {
            authorization: token,
          },
        }
      );

      if (response.status === 200 || response.data.success) {
        console.log("Post updated successfully");
        navigate(`/details/${id}`);
      } else {
        console.error("Failed to update post");
      }
    } catch (error) {
      console.error("Failed to update post", error);
    }
  };

  return (
    <Wrapping>
      <Header />
      <Container>
        <Image src={imageUrl} alt="Banner" />
        <StyledFormControl>
          <label htmlFor="fileInput">
            <Add fontSize="large" color="action" />
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <StyledLabel
            placeholder="Title"
            onChange={handleChange}
            name="title"
            value={post.title}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Update
          </Button>
        </StyledFormControl>
        <TextArea
          minRows={5}
          placeholder="Share your Thoughts"
          name="description"
          onChange={handleChange}
          value={post.description}
        />
      </Container>
      {loading ? <Loader></Loader> : <></>}
    </Wrapping>
  );
};
