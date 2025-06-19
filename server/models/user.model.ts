
import mongoose,{Document,Model,Schema} from "mongoose";
import bcrypt from "bcryptjs";
import { NextFunction } from "express";

const emailRegexPattern: RegExp= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// best practise to make an interface in typescript to make an interface
// we can define some types in this interface like type of email,password etc

export interface IUser extends Document
{
    name:string;
    email:string;
    password:string;
    // avatar is an object
    avatar:{
        public_id:string; 
        // as we are using cloudinary so we need public_id
        url:string;
    };

    role:string;
    isVerified:boolean;
    courses:Array<{courseId:string}>;
    // comparePassword is a method
    comparePassword: (password:string)=>Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Please enter your name"],
        },
        email:{
            type:String,
            required:[true,"Please enter your email"],
            validate:{
                validator:function(value:string)
                {
                    return emailRegexPattern.test(value);
                },
                message:"Please enter a valid email"
            },
            unique:true,

        },
        password:{
            type:String,
            required:[true,"Please enter a password"],
            minlength:[6,"Password must be atleast 6 characters"],
            select:false,
        },
        avatar:{
            public_id:String,
            url:String,
        },
        role:
        {
            type:String,
            default:"user",

        },
        isVerified:
        {
            type:Boolean,
            default:false,
        },
        courses:[
            {
                courseId: String,
            }
        ],
    },{timestamps:true})


// hash password before saving password
 
    userSchema.pre<IUser>('save',async function(next)
{
    if(!this.isModified('password'))
    {
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
    next();
});

//compare password

userSchema.methods.comparePassword=async function(enteredPassword:string):Promise<boolean>
{
    return await bcrypt.compare(enteredPassword,this.password);
};

const userModel:Model<IUser> = mongoose.model("User",userSchema);

export default userModel;