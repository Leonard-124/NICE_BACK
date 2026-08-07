
const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: "Not authenticated"})
}

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = process.env.NODE_ENV === "production" && status === 500 ? "Internal server error" : err.message;
    res.status(status).json({ error: message});
}


module.exports = { isAuthenticated, errorHandler }