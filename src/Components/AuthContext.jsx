import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { useContext } from "react";
import React from "react";
import { auth, db, storage } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// 1. 
const AuthContext = React.createContext();
// hook
export function useAuth() {
    // 3
    return useContext(AuthContext);
}

function AuthWrapper({ children }) {
    const [userData,setUserData] = useState(null)
    // console.log("userdata",userData);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error,setError] = useState("");
    
    
    useEffect(()=>{
        // checking if user logged in 
       const unsubscribe = onAuthStateChanged(auth,async(currentUser)=>{
           setLoading(true);
            if(currentUser){
                const docRef = doc(db, "users", currentUser?.uid);
                const docSnap = await getDoc(docRef);
                await setLastSeen(currentUser);
                // await updateStatus(currentUser.uid);
                if(docSnap.exists()){
                    const {profile_pic,name,email , lastSeen, status} = docSnap.data();

                    console.log("user",docSnap.data());
                    console.log("user keys", Object.keys(docSnap.data()));
    //  context me ja kar save kar diya hai user ka data
                 
                 setUserData({
                        id:currentUser.uid, 
                        profile_pic,
                        email,
                        name,
                        lastSeen,
                        status: status?status: ""
                  });
                
                }
            }
            setLoading(false);
        })
        return () =>{
            unsubscribe();
        }
    },[])
    
const  setLastSeen = async(user) =>{
    const date = new Date();
    const timeStamp = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "2-digit",
      month:"short"
  });
  await updateDoc(doc(db, "users" , user.uid),{
    lastSeen : timeStamp
  });
}
    const updateName = async(newName) =>{
        await updateDoc(doc(db,"users", userData.id),{
            name : newName
        })
    }

    const updateStatus = async(newStatus) =>{
        await updateDoc(doc(db,"users", userData.id),{
            status : newStatus
        })
    }
    
    const updatePhoto = async (img) => {
        // kha aapki image upload 
        const storageRef = ref(storage, `profile/${userData.id}`);
        const uploadTask = uploadBytesResumable(storageRef, img);
        uploadTask.on(
            "state_changed",
            () => {
                // on State Changed
                setIsUploading(true);
                setError(null);
               
            },
            () => {
                // on Error
                setError("Unable to Upload!");
                setIsUploading(false);
                alert("Unable to Upload!");
            },
            () => {
                // on Success
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(async (downloadURL) => {
                        await updateDoc(doc(db, "users", userData.id), {
                            profile_pic: downloadURL,
                        });

                        setUserData({
                            ...userData,
                            profile_pic: downloadURL,
                        });
                        setIsUploading(false);
                        setError(null);
                    });
            }
        );
    };



    return <AuthContext.Provider value={{setUserData,userData, loading, updateName, updateStatus, updatePhoto, isUploading, error}}>
        {children}
    </AuthContext.Provider>

}

export default AuthWrapper;