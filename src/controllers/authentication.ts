import {Request,Response} from "express";
import { createUser, getUserbyEmail } from "../db/users";
import { authentication, random } from "../helpers";

export const login = async (req:Request, res:Response)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }
        const user = await getUserbyEmail(email).select('+authentication.salt +authentication.password');
        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        const expectedHash = authentication(user.authentication.salt, password);

        if(user.authentication.password !== expectedHash){
            return res.status(400).json({message: "Invalid password"});
        }

        const salt=random();
        user.authentication.sessionToken= authentication(salt, user._id.toString());

        await user.save();
        res.cookie('HRITESH-AUTH', user.authentication.sessionToken, {domain:'localhost', path: "/api"});
        return res.status(200).json(user).end();
    }catch(error){
        console.log(error);
        return res.status(400);
    }
}

export const register = async (req: Request,res: Response) :Promise<Response> => {
    try{
        const {email, password, username}= req.body;

        if(!email || !password || !username){
            return res.status(400).json({message: "Please fill in all fields."});
        }
        const existingUser= await getUserbyEmail(email);
        if(existingUser){
            return res.status(400).json({message: "Email already in use."});
        }
        const salt=random();
        const user=await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(password, salt),
            },
        });
        return res.status(200).json(user);
    }
    catch(error){
        return res.status(400).send(console.log(error));
    }
}