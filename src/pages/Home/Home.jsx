/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { MdAdd } from "react-icons/md"
import NoteCard from "../../components/Cards/NoteCard"
import Navbar from "../../components/Navbar/Navbar"
import AddEditNotes from "./AddEditNotes"
import { useEffect, useState } from "react"
import Modal from "react-modal";
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import Toast from "../../components/ToastMessage/Toast"
import EmptyCard from "../../components/EmptyCard/EmptyCard"

const Home = () => { 
  
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown:false,
    type: "add",
    data:null,
  });

  const [showToastMsg,setShowToastMsg]=useState({
    isShown : false,
    message:"",
    type:"add",
  });
  
  const [allNotes, setAllNotes] = useState([]);
  const [userInfo,setUserInfo] = useState({ fullName: '' });
  const[isSearch,setIsSearch] = useState(false);

  const [dataFetched, setDataFetched] = useState(false);
  const navigate = useNavigate();

   const handleEdit = (noteDetails) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data: noteDetails,
    });
   };

  const showToastMessage = (message,type)=>{
    setShowToastMsg({
      isShown : true,
      message,
      type,
    });
  }

   const handleCloseToast = () => {
    setShowToastMsg({
      isShown : false,
      message:"",
    });
   }

  // Get User Info
    const getUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/get-user");
        if(response.data && response.data.user){
        setUserInfo(response.data.user);
      }
      } catch (error) {
        if(error.response.status === 401){
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    //Get all notes
    const getAllNotes = async () => {
      try {
        const response = await axiosInstance.get("/get-all-notes");
        if(response.data && response.data.notes){
          setAllNotes(response.data.notes);
        }
      } catch (error) {
        console.log("An unexpected error occurred. Please try again.")
      }
    };

    //Delete note
    const deleteNote = async (data) => {
      const noteId = data._id;
      try {
        const response = await axiosInstance.delete("/delete-note/" + noteId);
          if(response.data && !response.data.error){
            showToastMessage("Note Deleted Successfully", 'delete')
           getAllNotes()
          }
  
      } catch (error) {
        if(error.response && error.response.data && error.response.data.message)
        {
          console.log("An unexpected error occurred. Please try again.")
        }
      }
    };

    //Search for notes

    const onSearchNote=async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes",{
        params:{
          query
        }
      });
      if(response.data && response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } 
    catch (error) {
      console.log(error)
    }
    }

    const updateIsPinned=async (noteData) => {
        const noteId = noteData._id

        try {
          const response = await axiosInstance.put("/update-note-pinned/" + noteId ,{
            "isPinned": !noteData.isPinned,
          });
            if(response.data && response.data.note){
              const message = noteData.isPinned ? "Note Unpinned Successfully" : "Note Pinned Successfully";
              showToastMessage(message)
             getAllNotes()
            }
    
        } catch (error) {
            console.log(error);
        }
      }


    const handleClearSearch=() => {
      setIsSearch(false);
      getAllNotes();
    }

    useEffect(() =>{
      const fetchData = async () => {
        await Promise.all([getUserInfo(), getAllNotes()]);
        setDataFetched(true);
      };
  
      fetchData();
      return ()=> {};
    },[]);


  return (
    <>
     {dataFetched && <Navbar userInfo = { userInfo } onSearchNote={onSearchNote} 
     handleClearSearch ={handleClearSearch}
     />}
       <div className="flex items-center">
       <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600  mt-3" onClick={()=>{
          setOpenAddEditModal({isShown:true,type:"add",data:null});
     }}>

      <MdAdd className="text-[32px] text-white"/>
     </button>
     <h6 className="ml-2 mt-3 text-blue-700"> Click here to add a new Note</h6>
     </div>

{allNotes.length > 0 ?  <div className="container mx-auto">
    <div className="grid grid-cols-3 gap-4 mt-3">
      { allNotes.map((item,index)=>(
              <NoteCard 
              key={item._id}
              title={item.title}
              date={item.createdOn}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={()=>handleEdit(item)}
              onDelete={()=>deleteNote(item)}
              onPinNote={()=>updateIsPinned(item)}
              />
        ))}

     </div>
     </div> : <EmptyCard 
     message={isSearch ? `Oops! No notes found matching your search` : `Looks like this space is craving for your thoughts,ideas and reminders! Add a new note by clicking the "+" and let your ideas blossom.`}
     />
     }


     <Modal 
     isOpen={openAddEditModal.isShown}
     onRequestClose={()=>{}}
     style={{
      overlay:{
        backgroundColor: "rgba(0, 0, 0, 0.2)"
      },
     }}
     contentLabel=""
     className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-24 p-5 overflow-x-auto">

     <AddEditNotes 
     type={openAddEditModal.type}
     noteData={openAddEditModal.data}
     onClose={()=> {
       setOpenAddEditModal({isShown:false , type: "add", data:null})
     }}
      getAllNotes={getAllNotes}
      showToastMessage={showToastMessage} 
     />

     </Modal>
     <Toast 
     isShown={showToastMsg.isShown}
     message={showToastMsg.message}
     type={showToastMsg.type}
     onClose={handleCloseToast}
     />
        </>
  ) 
}

export default Home