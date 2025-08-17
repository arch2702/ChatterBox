import React, { useEffect, useState } from 'react'
import { MessageSquareText, PlusIcon, SendIcon } from 'lucide-react';
import { useParams } from 'react-router-dom'
import { arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';



function ChatWindow() {
  const params = useParams();
  const [msg, setMsg] = useState("");
  const [secondUser, setSecondUser] = useState();
  const [msgList, setMsgList] = useState([]);
  const {userData} = useAuth();

  const receiverId = params?.chatId;


  // generating chat id
 const chatId = 
  userData?.id > receiverId
    ? `${userData.id}-${receiverId}`
    : `${receiverId}-${userData.id}`


  // console.log("params",params);
 const handleSendMsg=async()=>{
  // console.log(msg);
  if(msg){
    
    const date = new Date();
    const timeStamp = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
  });

  const fullTimestamp = date;
// start chat with user
if (msgList?.length === 0) {

  await setDoc(doc(db, "user-chats", chatId), {
    chatId: chatId,
    messages: [
      {
        text: msg,
        time: timeStamp,
        timeStamp: fullTimestamp,
        sender: userData.id,
        receiver: receiverId,
      },
    ],
  });
}
  else{
    // update in the messgae list
    await updateDoc(doc(db, "user-chats", chatId), {
      chatId: chatId,
      // arrayUnion is used here to append to last message to the array list.
      messages: arrayUnion({
        text: msg,
        time: timeStamp,
        timeStamp: fullTimestamp,
        sender: userData.id,
        receiver: receiverId,
      }),
    });
  
  }



  setMsg("");
 }
}

useEffect(() =>{
  const getUser = async() =>{
   const docRef = doc(db,"users" , receiverId);
   const docSnap = await getDoc(docRef);

   if (docSnap.exists()){
     // console.log("second user",docSnap.data());
     setSecondUser(docSnap.data());
   }
  };
  getUser();

  const msgUnsubscribe = onSnapshot(doc(db, "user-chats",chatId),(doc) =>{
   setMsgList(doc.data()?.messages || []);
  })
  return () =>{
   msgUnsubscribe();
  }
},[receiverId]);


if(!receiverId)
//  empty screen
return (
  <section className='w-[70%] h-full flex flex-col gap-4 items-center justify-center dark:bg-gray-900 border-l-2 dark:border-gray-700'>
    <MessageSquareText 
    className='w-28 h-28 text-gray-400'
    strokeWidth={1.2}/>
    <p className='text-sm text-center text-gray-400'>
    select any contact to
    <br/>
    start a chat with
    </p>
  </section>
);


// user jiske sath aap chat kar rahe ho




// chat screen code
  return <section className='w-[70%] h-full flex flex-col gap-4 items-center justify-center border-l-2 dark:border-gray-700 '>
   <div className='h-full w-full bg-chat-bg flex flex-col  dark:bg-gray-900'>
    {/* top bar */}
    <div className='bg-background py-2 px-4 flex items-center gap-2 shadow-sm dark:bg-gray-800 border-gray-300 dark:border-gray-700'>
      <img
         src={secondUser?.profile_pic || "/default-user.png"}
         alt='profile picture'
         className='w-9 h-9 rounded-full object-cover'
      ></img>
        
        <div>
        <h3>{secondUser?.name}</h3>
        {secondUser?.lastSeen &&(
          <p className='text-xs text-neutral-400'>
            last seen at {secondUser?.lastSeen}
          </p>
        )}
        </div>
    </div>
    {/* message list */}
    <div className='flex-grow flex flex-col gap-12 p-6 overflow-y-scroll'>
    {msgList?.map((m, index) => (
          <div
            key={index}
            data-sender={m.sender === userData.id}
            // break-words is the edge case where a single word is quite long, so we need to break that word before it breaks our ui.
            className={`bg-white dark:bg-gray-700 w-fit rounded-md p-2 shadow-sm max-w-[400px] break-words data-[sender=true]:ml-auto data-[sender=true]:bg-primary-light dark:data-[sender=true]:bg-primaryDense`}
          >
            <p>{m?.text}</p>
            <p className="text-xs text-neutral-500 dark:text-gray-200  text-end ">
              {m?.time}
            </p>
          </div>
        ))}


    </div>
     
    {/* chat input */}
    <div className='bg-backgroundpy-3 px-6 shadow flex items-center gap-6'>
      <PlusIcon></PlusIcon>
      <input type='text' className='w-full py-2 px-4 rounded focus:outline-none  dark:bg-gray-800' placeholder='Type a message...' 
      value={msg}
      onChange={(e) => {
        setMsg(e.target.value)
      }}
      onKeyDown={(e) => {
        if(e.key === "Enter"){
          handleSendMsg();
        }
      }}
      
      />
      <button onClick={handleSendMsg}>
        <SendIcon/>
      </button>
    </div>
   </div>
</section>

}

export default ChatWindow