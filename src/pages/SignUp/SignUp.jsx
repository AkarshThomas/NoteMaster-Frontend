import { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);
  
  const navigate = useNavigate();

 const handleSignUp = async (e) => {
  e.preventDefault();
  if(!name){
    setError("Please enter your name");
    return;
  }
  if(!validateEmail(email)){
    setError("Please enter a valid email address");
    return;
 }

 if(!password){
  setError("Please enter the password");
  return;
 }
 setError('')

 // Sign Up API call

 try {
  const response = await axiosInstance.post("/create-account",
  {
    fullName: name,
    email: email,
    password: password,
  });
  //Handle successful registration response
  if(response.data && response.data.accessToken){
    setError(response.data.message)
    return
  }
   if(response.data && response.data.accessToken){
    localStorage.setItem("token",response.data.accessToken)
    navigate("/dashboard");
   }

 } catch (error) {
  if(error.response && error.response.data && error.response.data.message){
    setError(error.response.data.message)
  }else{
    setError("An unexpected error occurred. Please try again")
 }
 }


};

  return (
    <>
      <div className="m-6 flex items-center">
      <img src="./././favicon.png" alt="" className="h-12  border-2 border-gray-400  " />
        <h2 className="text-3xl font-medium text-blue-600 py-2 ml-2 ">NoteMaster</h2>
      </div>
      
      <div className="flex items-center justify-center mt-20 ">
        <div className="w-96 border rounded bg-white bg-opacity-90 px-7 py-10 shadow-lg backdrop-filter backdrop-blur-lg backdrop-saturate-150">
          <form onSubmit={handleSignUp}>
            <h4 className="flex justify-center text-2xl mb-7">Sign Up</h4>
            <input type="text" placeholder="Name" className="input-box" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
            <input type="text" placeholder="Email" className="input-box" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
              Sign Up
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
