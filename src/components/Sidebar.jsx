import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'

const Sidebar = () => {
    const {getUsers,users, selectedUser,setSelectedUser,isUsersLoading}= useChatStore();
    const onlineUsers =[];

    useEffect(()=>{
        getUsers()
    },[getUsers]);
                                        
  return (
    <div>
      sidebar
    </div>
  )
}

export default Sidebar
