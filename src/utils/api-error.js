class ApiError extends Error{
    constructor(
        statusCode,
        message= "Something Went Wrong",
        data = null,
        error=[],
        stack =""
        ){

        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.error = error;
        this.stack = stack;
        this.success = false;

        if(stack)
        {
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}

export{ApiError}