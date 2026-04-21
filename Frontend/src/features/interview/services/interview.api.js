import axios from "axios"
import { API_ENDPOINTS } from "../../../config/api"

export async function generateInterviewReport({resume, selfDescription, jobDescription}) {   
    try{     
        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('selfDescription', selfDescription);
        formData.append('jobDescription', jobDescription);

        const response = await axios.post(API_ENDPOINTS.INTERVIEW.CREATE,
            formData,
            {
                withCredentials:true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response.data
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
