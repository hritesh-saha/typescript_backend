import express, {Response,Request, NextFunction} from "express";
import { get, identity, merge } from 'lodash';

import { getUserBySessionToken } from "../db/users";

export const isOwner = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const {id} =req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if(!currentUserId){
            return res.status(403).json({error: 'Unauthorized'});
        }

        if(currentUserId.toString() !== id){
            return res.status(403).json({error: 'Unauthorized'});
        }
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401);
    }
}

export const isAuthenticated = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const sessionToken= req.cookies['HRITESH-AUTH'];

        if(!sessionToken){
            return res.status(403).json({error: 'No session token found'});
        }
        const user = await getUserBySessionToken(sessionToken);

        if(!user){
            return res.status(403).json({error: 'No user found for the session token'});
        }

        merge(req, {identity: user });
        return next();
    }
    catch(error){
        console.error(error);
        return res.status(401).send({ message: "Unauthorized" });
    }
}