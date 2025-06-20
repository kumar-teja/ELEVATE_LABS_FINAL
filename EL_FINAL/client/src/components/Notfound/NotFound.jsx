import { Box , styled } from "@mui/material"


const StyledBox=styled(Box)`
display: flex;
justify-content :center;
font-family: Roboto;`
    



export const NotFound=()=>{
    return(
        <StyledBox>
             <div 
             >
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you're looking for doesn't exist.</p>
            </div>
        </StyledBox>
       
    )
}