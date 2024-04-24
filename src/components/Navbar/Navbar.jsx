/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo"
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";

const Navbar = ( {userInfo, onSearchNote,handleClearSearch} ) => {

  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate();

  const onLogout = ()=>{
    localStorage.clear()
   navigate("/login");
  }

  const handleSearch=()=> {
    if(searchQuery){
      onSearchNote(searchQuery)
    }
  };

  const onClearSearch = ()=>{
setSearchQuery("");
handleClearSearch();
  }

  return (

    <div className="bg-white flex flex-col sm:flex-row justify-between items-center px-6 py-2 drop-shadow">
      <div className="flex items-center">
      <img src="./././favicon.png" alt="" className="h-8 border-2 border-gray-400 " />
        <h2 className="text-xl font-medium text-black py-2 ml-2 ">NoteMaster</h2>
      </div>

        <SearchBar value={searchQuery}
        onChange={({target})=>{
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}/>
        <ProfileInfo  userInfo={userInfo} onLogout={onLogout}/>
    </div>
  )
}

export default Navbar