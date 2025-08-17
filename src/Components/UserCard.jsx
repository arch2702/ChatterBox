import React from 'react'
import { Link, useParams } from "react-router-dom";



function UserCard(props) {
    const {userObject} = props;
    const params = useParams();
    const isActive = params?.chatId === userObject.id;
  return (
    <div key={userObject.id}>
    <Link className={`flex gap-4 items-center  hover:bg-background dark:hover:bg-gray-700 border-gray-800  p-2 rounded cursor-pointer ${isActive && "bg-background dark:bg-gray-700"
                    }`} to={`/${userObject.id}`}>
            {/* Render user data here */}
            <img src={userObject.userData.profile_pic} alt="" className='w-12 h-12 object-cover rounded-full'></img>
            <h2>{userObject.userData.name}</h2>

</Link>
</div>
  )
}

export default UserCard