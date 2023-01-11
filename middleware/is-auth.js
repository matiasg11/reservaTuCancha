module.exports = (req, res, next) => {
    //look into the incoming requests
    const authHeader = req.get('Authorization');
    if (!authHeader){
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(" ")[1] //(template)Authorization: Bearer authenthicationtokenfjasdjfasdjfasdj
    if (!token || token === ""){
        req.isAuth = false;
        return next()
    }
    try{
        let decodedToken = jwt.verify(token, 'BocaJuniors')
    }
    catch (err){
        req.isAuth = false;
        return next();
    }

    if (!decodedToken){
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next()
}   