import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../../firebase.init';


export const AuthContext=createContext(null)
const Authprovider = ({children}) => {
    const [loading,setLoading]=useState(true)
    const [user,setUser]=useState(null)
   
    const createRegister=(email,password)=>{
        setLoading(true)
        return createUserWithEmailAndPassword(auth,email,password)
    }
    const loginUser=(email,password)=>{
        setLoading(true)
        return signInWithEmailAndPassword(auth,email,password)
    }
    const updateUser=(updatedData)=>{
        return updateProfile(auth.currentUser,updatedData)
    }
    const signOutUser=()=>{
        setLoading(true)
        return signOut(auth)
    }

    useEffect(()=>{
        const unSubscribe=onAuthStateChanged(auth,currentUser=>{
            // console.log(currentUser)
            setUser(currentUser)
            setLoading(false)
        })
        return ()=>{
            unSubscribe()
        }
    },[])
  const AuthInfo={
    
    createRegister,
    loginUser,
    signOutUser,
    user,
    loading,
    updateUser
  }
    return (
        <AuthContext.Provider value={AuthInfo}>
            {children}
        </AuthContext.Provider >
    );
};

export default Authprovider;