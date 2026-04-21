import axios from "axios"
import { API_ENDPOINTS } from "../../../config/api"

export async function register({username, email ,password}) {   
    try{     
  const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER,{
    username,email,password
  },{
    withCredentials:true
  })
  return response.data
    }
    catch(err){
        console.log(err);
        
    }
}

export async function login({ email ,password}) {   
    try{     
  const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN,{
    email,password
  },{
    withCredentials:true
  })
  return response.data
    }
    catch(err){
        console.log(err);
        
    }
}

export async function logout() {
    try{
 const response = await axios.get(API_ENDPOINTS.AUTH.LOGOUT,{
    withCredentials:true
  })
  return response;
    }
    catch(err){
        console.log(err)
    }
}



export async function getme() {
    try{
 const response = await axios.get(API_ENDPOINTS.AUTH.GET_ME,{
    withCredentials:true
  })
  return response.data;
    }
    catch(err){
        console.log(err)
    }
}