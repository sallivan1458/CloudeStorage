import AppError from '../exeptions/api-error.js';

export default function (err, req, res, next) {
    console.log('MIDDLEWARE:',err);
    if (err instanceof AppError) {
        return res.status(err.status)
            .json({message: err.message, errors: err.errors});
    }
    return res.status(500).json({message: 'Server error'});
}