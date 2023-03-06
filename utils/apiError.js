// @desc this class can make reuse any where about operation errors (that can i predict)
class ApiError extends Error {
    constructor(statusCode,message){
        super(message);
        this.statusCode=statusCode
        // if status code start 4 like 400 result is fail Else error
        this.status = `${statusCode}`.startsWith(4||5) ? 'fail' : 'error';
        // Error i'am is send it
        this.isOperational = true
    }
}

module.exports = ApiError;