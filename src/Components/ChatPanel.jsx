import { collection, getDocs } from 'firebase/firestore';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { db } from '../../firebase';
import { SunMoon,CircleFadingPlus,MessageSquareText,UserRound, Loader2Icon, SearchIcon, CheckIcon} from 'lucide-react';
import Profile from './Profile';
import UserCard from './UserCard';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

function ChatPanel() {
    // list of users le kar aane hai from firebase 
    const [users,setUsers] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [showProfile, setShowProfile] = useState(false);
    const {userData , updateStatus} = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const { theme, toggleTheme } = useTheme();
    const [isEditingStatus, setIsEditingStatus] = useState(false);
const [newStatus, setNewStatus] = useState(userData?.status || "");
 

const handleUpdateStatus = () => {
    updateStatus(newStatus);
    setIsEditingStatus(false);
};
    useEffect(() => {
        const getUsers = async()=>{
            // isme collenction pass karo to data milta hai
            const snapshot = await getDocs(collection(db,'users'));

            // console.log(snapshot.docs.length);
            const arrayOfUser = snapshot.docs.map((docs)=>{ return {userData: docs.data(),id:docs.id}});
            // console.log(arrayOfUser)
            setUsers(arrayOfUser);
            setLoading(false);
        };
        getUsers();
    },[]);

// if(isLoading) return <div>...loading</div>
const onBack =() =>{setShowProfile(false)}

if(showProfile==true){
    return (
    <Profile onBack={onBack}></Profile>
    )
}

let filterdUsers = users;
    
if (searchQuery) {
    // filter chats based on search query
    filterdUsers = users.filter((user) =>
        user.userData.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );
}
return (
    <div className=' bg-white w-[30vw] min-w-[350px] dark:bg-gray-900 text-black dark:text-white'>
    {/* top-bar */}
    <div className='bg-background py-2 px-4 border-r flex justify-between items-center gap-2 dark:bg-gray-800 border-gray-300 dark:border-gray-700' >
        <button onClick={()=>{setShowProfile(true)}}>
        <img 
             src={userData?.profile_pic ||"/pngegg.png"} 
             alt="profile picture"
             className='w-10 h-10 rounded-full object-cover'>

        </img>
        </button>
        <div className='flex items-end justify-end gap-6 mx-4'>
        
        <SunMoon className="w-6 h-6 cursor-pointer"
         onClick={toggleTheme}
        />
       
        {isEditingStatus ? (
    <div className="flex gap-2 items-center">
        <input
            className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 focus:outline-none text-black dark:text-white"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            placeholder="Enter new status"
        />
        <button
            onClick={handleUpdateStatus}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
            <CheckIcon className="w-4 h-4" />
        </button>
    </div>
) : (
    <CircleFadingPlus
        className="cursor-pointer"
        onClick={() => setIsEditingStatus(true)}
    />
)}

        <MessageSquareText />
        {/* <UserRound /> */}
        </div>

    </div>
    
    {/* chat list */}
    {
        isLoading ? <div className='h-full w-full flex justify-center items-center'><Loader2Icon className='w-10 h-10 animate-spin'/></div> :
        <div className="bg-white py-2 px-3 dark:bg-gray-900">
                        <div className="bg-background flex items-center gap-4 px-3 py-2 rounded-lg dark:bg-gray-800">
                            <SearchIcon className="w-4 h-4" />
                            <input
                                className="bg-background  dark:bg-gray-800 focus-within:outline-none"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
    <div className='divide-y py-4 max-h-[calc(100vh-152px)] overflow-y-scroll h-full divide-gray-300 dark:divide-gray-700'>
    {filterdUsers.map(userObject => <UserCard userObject={userObject} key={userObject.id}></UserCard>)}
    </div>
 
    </div>
    }
    </div>
  );
}


    
export default ChatPanel