import { useState } from "react"
import "../auth.form.scss"
import { Link, useNavigate} from "react-router";
import {useAuth} from "../hooks/useAuth"

const Register =  ()=>{
    const {loading , handleRegister}= useAuth();
    const navigate = useNavigate();

    const [username , setUsername] = useState("");
    const [email , setEmail] = useState("");
    const[password , setPassword]= useState("")
    const [error, setError] = useState("");

     const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        try {
            await handleRegister({username, email, password});
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    }

    if(loading){
        return(
            <main><h1>Loading....</h1></main>
        )
    }

    return (
        <>
      <main>
        <div className="form-container">
            <div className="brand-header">
                <h1>Gapify AI</h1>
                <p className="tagline">AI Resume & Gap Analyzer</p>
            </div>
            <h2 className="form-title">Create Account</h2>
        <form onSubmit={handleSubmit}>
               <div className="input-group">
                <label htmlFor="username">Username</label>
                <input 
                onChange={(e)=>{
                    setUsername(e.target.value)
                }}
                type="text" id="username" name="username" placeholder="Choose a username" />
            </div>

            <div className="input-group">
                <label htmlFor="email">Email</label>
                <input 
                onChange={(e)=>{
                    setEmail(e.target.value)
                }}
                type="email" id="email" name="email" placeholder="Enter your email" />
            </div>
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input 
                onChange={(e)=>{
                    setPassword(e.target.value)
                }}
                type="password" id="password" name="password" placeholder="Create a password" />
            </div>
            <button className="button primary-button">Register</button>
        </form>
        {error && <p style={{ color: "#ef4444", marginTop: "0.75rem" }}>{error}</p>}
        <p>Already have an account?  <Link to={"/login"}> Login</Link></p>
        </div>
      </main>
        </>
    )
}

export default Register