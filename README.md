TECHSTACK USED IN BLOGGING SITE


Default font :
        "Robotto" from google fonts..


I.for frontend -- (REACT):
    1.axios -  for API requests
    2.react-router-dom - for routing dom elements (protected and bypass routes upon tokens)
    3.Components:
        MUI installation:
                    npm install @mui/material @emotion/react @emotion/styled
                    npm install @mui/material @mui/styled-engine-sc styled-components
            For MUI ICONS:
                    npm install @mui/icons-material
    4.reactContextApi for storing logged in user details
    5.Hooks  used :
       1.useEffect
       2.useState
       3.useContext
       4.useNavigate
       5.useSearchParams
       
       
    6.Styling:
        1.Mui styled components
    7.responsive :
        1.Mui theme breakpoints and 'sx' prop.. 
    8.ContextApi - for storing the user credentials while browsing

        

II. for Backend:
    1.Node.js
    2.Express.js for api routing
    3.Mongoose - makes database opeations easier with mongodb
    4.JWT -Authentication and verification.
    5.ZOd -for  Data validation..
    6.Bcrypt - for hashing passwords.
    7.Multer -for handling file uploads
    8.Firebase- for storing  and Retreiving large files from buckets of firebase storage..
    9.Dotenv - For managing environment variables.
    10.Cors- For handling cross origin resource sharing
    11.nodemailer - free service provider
    12.node-cron - resolve cold start problem hits dummy api for evrey 10 minutes..

III. for DB:
    1.Mongodb instance.

Iv.Browser Storage :
    1.sessionStorage

V.file uplaod storage - (firebase)
    get a service api .json file and paste it in the root folder ..

Local set Up Notes :
   
    Clone the repository and run "npm install" in both server and client then we're good to go..
    
Global setup:
    Will be set up soon..

PreRequisites (if you are building it from scratch):
    for frontend:
        react app:
            npm create vite@latest
            npm install
            npm run dev(to run locally)
        npm install axios
        npm install react-router-dom
    for backend:
        To initialise:
            npm init -y
            npm install
            node index.js(to run locally)
        npm install express
        npm install cors
        npm install node-cron
        npm install axios
        npm install jsonwebtoken
        npm install bcryptjs
            for windows: npm i bcryptjs
        npm install zod
        npm install dotenv
        npm install multer
        npm install firebase-admin
        npm install nodemailer
        npm install nodemon(optional it helps to restart the backend application on it's own whenever modified)
    for database:
        Get a mongodb instance (URL) and paste it in the connection string ..

It's Good to have postman and compass dB for detailed info of the Database and it's models , postman for checking end points  
