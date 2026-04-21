import { useState } from "react"
import "../auth.form.scss"
import {Link, useNavigate} from 'react-router'
import {useAuth} from "../hooks/useAuth"
import DeveloperButton from "../../../components/DeveloperButton"

const Login =  ()=>{
    const {loading , handleLogin}= useAuth();
    const navigate = useNavigate();

    const [email , setEmail] = useState("");

    const[password , setPassword]= useState("")
    const [error, setError] = useState("");
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        try {
            await handleLogin({email, password});
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        }
    }
    if(loading){
        return(
            <main><h1>Loading....</h1></main>
        )
    }
    return (
        <>
            <DeveloperButton />
      <main>
        <div className="form-container">
            <div className="brand-header">
                <h1>Gapify AI</h1>
                <p className="tagline">AI Resume & Gap Analyzer</p>
            </div>
            <h2 className="form-title">Welcome Back</h2>
        <form onSubmit={handleSubmit}> 
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
                type="password" id="password" name="password" placeholder="Enter your password" />
            </div>
            <button className="button primary-button">Login</button>
        </form>
        {error && <p style={{ color: "#ef4444", marginTop: "0.75rem" }}>{error}</p>}

          <p>Don't have an account?  <Link to={"/register"}> Register</Link></p>
        </div>
      </main>
        </>
    )
}

export default Login