import express, {Request,Response} from "express";

import { deleteUserById, getUserById, getUsers } from "../db/users";

export const getAllUsers = async(req:Request, res:Response)=>{
    try{
        const users = await getUsers();
        return res.status(200).json(users);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Error fetching users"})
    }
}

export const deleteUser = async(req:Request, res:Response)=>{
    try{
        const {id} = req.params;
        const deletedUser= await deleteUserById(id);
        return res.status(200).json(deletedUser);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Error deleting user"})
    }
}

export const updateUser = async(req:Request, res:Response)=>{
    try{
        const {id} = req.params;
        const {username} = req.body;
        
        if(!username){
            return res.status(400).json({message:"Username is required"})
        }
        const user= await getUserById(id);
        user.username = username;
        await user.save();
        return res.status(200).json(user).end();
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Error updating user"})
    }
}