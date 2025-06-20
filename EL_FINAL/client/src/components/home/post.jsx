import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { Box, Grid, styled, Skeleton } from '@mui/material';
import { SinglePost } from './SinglePost';

const AlternatePost = styled(Box)`
  color: #878787;
  margin: 30px 80px;
  font-size: 18px;
`;

export const Post = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // To track the loading state
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setTimeout(() => {
      const fetchData = async () => {
        setLoading(true); 
        try {
          const accessToken = sessionStorage.getItem('accessToken');
          let endpoint = `${import.meta.env.VITE_REACT_APP_API_URL}/getAllPosts`;
  
          if (category) {
            endpoint += `?category=${category}`;
          }
  
          const response = await axios.get(endpoint, {
            headers: {
              Authorization: `${accessToken}`,
            },
          });
  
          if (response.status === 200) {
            setPosts(response.data);
          }
        } catch (error) {
          console.error('Error fetching posts', error);
        } finally {
          setLoading(false); 
        }
      };
      fetchData();
    }, 100);
    

    
  }, [category]);

  return (
    <>
      {loading ? (
        <Grid container spacing={3}>
         
          {Array.from(new Array(8)).map((_, index) => (
            <Grid item lg={3} sm={4} xs={12} key={index}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={200}
                animation="wave"
              />
            </Grid>
          ))}
        </Grid>
      ) : posts && posts.length > 0 ? (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item lg={3} sm={4} xs={12} key={post._id}>
              <Link
                to={`/details/${post._id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
              >
                <SinglePost post={post} />
              </Link>
            </Grid>
          ))}
        </Grid>
      ) : (
        <AlternatePost>No Data Available to Display</AlternatePost>
      )}
    </>
  );
};
