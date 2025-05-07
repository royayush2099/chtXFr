import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
const BASE_URL="http://localhost:5001"

//need to study zustand in deep
export const useAuthStore = create((set,get)=>({
    authUser:null,//authUser set to null initially
    isSigningUp:false,
    isLogging:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    //function for checking authentication
    checkAuth:async()=>{
        try{
        const res = await axiosInstance.get("/auth/check")//sending the request to check whther user is authenticated or not
        set({authUser:res.data});//setting the authuse data coming from backend
        get().connectSocket();
    }catch(err){
        console.log("Error in checkAuth ",err)
       set({authUser:null})

        }
        finally{
            set({isCheckingAuth:false})
        }
    },
//function for checking signup
signup:async(data)=>{
    set({isSigningUp:true});
  try{
    //res from server
  const res = await axiosInstance.post("/auth/signup",data);
  set({authUser:res.data});
  toast.success("Account created successfully");
   get().connectSocket()
  }catch(err){
   toast.error(err.response.data.message);
  }finally{
    set({isSigningUp:false});
  }
},

//function for logout
logout:async(data)=>{
    try{
     await axiosInstance.post("/auth/logout");
     set({authUser:null});
     toast.success("Logged Out Successfully");
     //handling websocket
     get().disconnectSocket()
    }catch(err){
    toast.error(err.response.data.message);    }
},
//functionaliyt for login
login:async(data)=>{
    set({isLogging:true});
    try{
        //res from server
 const res =   await axiosInstance.post("/auth/login",data);
 set({authUser:res.data});
 toast.success("Login Successfully");
 get().connectSocket()
   }
    catch(err){
        toast.error(err.response.data.message);
    }finally{
        set({isLogging:false});
    }
},

//function to update profile
updateProfile:async(data)=>{
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
},
connectSocket:()=>{
  const {authUser} = get();
  if(!authUser || get().socket?.connected) return;
const socket = io(BASE_URL,{
  query:{
    userId:authUser._id,
  }
})
socket.connect();
set({socket:socket});//setting th socket stated
socket.on("getOnlineUsers",(userIds)=>{
  set({onlineUsers:userIds})
})
},
disconnectSocket:()=>{
if(get().socket?.connected) get().socket.disconnect();
},

}));