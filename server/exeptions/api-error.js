class ApiError extends Error {

    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status
        this.errors = errors
    }

    static BadRequest(message, errors = []){
        return new ApiError(400, message, errors)
    }

    static Unauthorized(message='User not authorized', errors = []){
        return new ApiError(401, message)
    }

    static NotFound(message, errors = []){
        return new ApiError(404, 'User not found')
    }

}

export default ApiError;