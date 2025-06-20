const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { z } = require('zod');
const jwt = require("jsonwebtoken");
const { User,  Post , Comment} = require("./db/db");
const dotenv=require("dotenv");
const cron=require("node-cron")
const axios = require("axios")
const authenticateToken=require("./middlewares/authenticateToken")



const nodemailer=require("nodemailer")
const admin = require('firebase-admin');
const path = require('path');
const multer=require("multer")


const app = express();
dotenv.config()



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Define the validation schema
const UserValidationSchema = z.object({
  userName: z.string(),
  password: z.string(),
  firstName: z.string()
});

app.post("/users/signup", async (req, res) => {
  const newuser = req.body;

  // Validate the user input
  const validationResult = UserValidationSchema.safeParse(newuser);
  
  if (!validationResult.success) {
    return res.status(400).json({
      msg: "Validation failed",
      errors: validationResult.error.issues
    });
  }

  try {
    const saltRounds = 10;
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(newuser.password, saltRounds);

    // Create the user object with the hashed password
    const userToCreate = { ...newuser, password: hashedPassword };
    const createdUser = await User.create(userToCreate);

    // Generate the access token
    const accessToken = jwt.sign(
      { userId: createdUser._id, userName: createdUser.userName },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '2h' }
    );

    // Respond with a success message and the access token
    res.json({
      msg: "User created successfully",
      accessToken,
      userName: createdUser.userName,
      firstName: createdUser.firstName
    });
  } catch (e) {
    // Handle any errors during the signup process
    res.status(500).json({
      msg: "Error while creating user",
      error: e.message
    });
  }
});


app.post("/users/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });
    
    if (!user) {
      return res.status(400).json({ msg: "Invalid username or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    
    if (match) {
      const accessToken = jwt.sign({ userId: user._id, userName: user.userName }, ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
      
      res.json({
        msg: "Login successful",
        accessToken,
        
        userName: user.userName,
        firstName: user.firstName
      });
    } else {
      res.status(400).json({ msg: "Invalid username or password" });
    }
  } catch (e) {
    res.status(500).json({ msg: "Error during login", error: e.message });
  }
});




const serviceAccount = require("../server/uploadinfiles-firebase-adminsdk-9tvlz-c9fdcfe27f.json"); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:  process.env.BUCKET_NAME
});
const bucket = admin.storage().bucket();



const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });


app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { originalname, buffer } = req.file;
    const file = bucket.file(originalname);

    await file.save(buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });
    await file.makePublic();
    // Construct public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    res.status(200).json({ imageUrl: publicUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file.');
  }
});







app.post("/posts",authenticateToken,async(req,res)=>{
  try{
  const newUser=await Post.create(req.body);
  res.status(200).json({
    msg:"user created successfully"
  })
  console.log("post created successfully")

}
  catch(e){
   res.status(500).json(e);
  }
})

//get all posts endpoint


app.get("/getAllPosts", authenticateToken, async (req, res) => {
  try {
    const category = req.query.category;
    let posts;

    if (category) {
      // Fetch posts that belong to the specified category
      posts = await Post.find({ categories: category });
    } else {
      // Fetch all posts if no category is specified
      posts = await Post.find({});
    }

    return res.status(200).json(posts);
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
});


app.get("/getPost/:id", authenticateToken, async (req, res) => {
  try {
      const post = await Post.findById(req.params.id);
      if (!post) {
          return res.status(404).json({ msg: "Post not found" });
      }
      return res.status(200).json(post);
  } catch (e) {
      return res.status(500).json({ msg: e.message });
  }
});


app.put('/updatepost/:id', authenticateToken, async (req, res) => {
  try {
      const { id } = req.params;
      const updatedData = req.body;

      // Find the post by ID and update it with the new data
      const updatedPost = await Post.findByIdAndUpdate(id, updatedData, { new: true });

      if (!updatedPost) {
          return res.status(404).json({ success: false, message: 'Post not found' });
      }

      res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

//Delete post

app.delete("/deletepost/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).send("Post not found");
    }
    res.status(200).send("Post deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting post");
  }
});




//All comments for a post
app.get('/comments/:postId', authenticateToken, async (req, res) => {
  try {
      const { postId } = req.params;
      const comments = await Comment.find({ postId: postId });

      if (!comments || comments.length === 0) {
          return res.status(404).json({ msg: 'No comments found for this post.' });
      }

      res.status(200).json(comments);
  } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ msg: 'Server Error', error: error.message });
  }
});

//Adding comment
app.post("/comment", authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(200).json({ msg: "Comment created successfully" });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

app.delete('/deletecomment/:id', authenticateToken, async (req, res) => {
  try {
      const commentId = req.params.id;

      // Find the comment by ID and delete it
      const deletedComment = await Comment.findByIdAndDelete(commentId);

      if (!deletedComment) {
          return res.status(404).json({ msg: 'Comment not found' });
      }

      res.status(200).json({ msg: 'Comment deleted successfully' });
  } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ msg: 'Server Error', error: error.message });
  }
});

// Endpoint to handle form data and send an email
app.post('/api/contact' ,authenticateToken, async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please fill out all fields' });
  }

  try {
      // Configure the email transport using nodemailer
      let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'kumarteja20052201@gmail.com', // replace with your email
              pass: process.env.APP_PASSWORD   // replace with your email password
          }
      });

      // Set up email data
      let mailOptions = {
          from: email, // sender address
          to: 'kumarteja20052201@gmail.com', // replace with your default email address
          subject: 'New Contact Form Submission',
          text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
      };

      // Send email
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Your message has been sent!' });
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send the email. Please try again later.' });
  }
});


const urlToHit = 'https://bloggingapp-grso.onrender.com';


cron.schedule('*/10 * * * *', async () => {
  try {
    console.log('Hitting the URL every 10 minutes...');
    const response = await axios.get(urlToHit);
    console.log('Response from URL:', response.data);
  } catch (error) {
    console.error('Error hitting the URL:', error);
  }
});

app.post('/updatePassword', async (req, res) => {
  const { userName, currentPassword, newPassword } = req.body;

  try {
    // Query by userName (if userName is not an email, make sure you're using the correct field)
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare current password with the hashed password in the DB
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password based on userName (if email isn't the identifier)
    await User.updateOne({ userName }, { $set: { password: hashedPassword } });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.get("/",async(req,res)=>{
 
})




app.listen(process.env.PORT, () => {
  console.log("Port Running on 3000");
});
