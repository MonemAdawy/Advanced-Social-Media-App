const notFoundHandler = (req, res, next) => {
    next(new Error(`Not Found - ${req.originalUrl} `, {cause: 404}));
}

export default notFoundHandler;