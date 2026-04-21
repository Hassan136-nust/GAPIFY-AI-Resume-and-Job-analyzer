import { useAuth } from "../hooks/useAuth";
import {Navigate} from "react-router"
import Loader from "../../../components/Loader";

const Protected=({children})=>{
    const {loading , user}=useAuth();
    if(loading){
        return(
            <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#D9CFBE'}}>
                <Loader message="Authenticating..." />
            </div>
        )
    }
    if(!user){
        return <Navigate to={'/login'}/>
    }
    return(
       children
    )
}

export default Protected