import { Header } from "../home/header"
import { PasswordUpdate } from "./updatepass"
import { styled , Box } from "@mui/material";
export const Wrapping = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 58px;
`;
export const EditPass =()=>{
    return(
            <Wrapping>
                 <Header></Header>
                <PasswordUpdate></PasswordUpdate>
            </Wrapping>
           
            
    )
}