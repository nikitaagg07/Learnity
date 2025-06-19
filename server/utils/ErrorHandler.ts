
// will create class for Error Handler
// we will have lot of errors in project like user entering wrong number,email,name,password
// so for that we will give status 500 send a json error response

import { error } from "console";


// everywhere we are writing the same object multiple times

// WE ARE MAKING THIS OBJECT ORIENTED CLASS so that we can call this error class to send the error type, message and status code

class ErrorHandler extends Error
{
    statusCode:Number;

 constructor(message:any,statusCode:Number)
 {
    super(message);
    // it is used to call the constructor of parent class(i.e. Error).It passes the message argument to the Error class constructor which sets the error message for the instance.
    this.statusCode=statusCode;

    Error.captureStackTrace(this,this.constructor);
 }
}
export default ErrorHandler;