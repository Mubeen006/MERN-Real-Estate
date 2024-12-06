// create a custom errro handerler for showing error according to action
export const  errorHandler=(statusCode, message) =>{
    const error= new Error();
    error.statusCode= statusCode;
    error.message= message;
    return error;
}