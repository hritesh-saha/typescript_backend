import {Request,Response} from "express";
import { createUser, getUserbyEmail } from "db/users";
import { authentication, random } from "helpers";

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