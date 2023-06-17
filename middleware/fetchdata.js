const jwt = require("jsonwebtoken");
const JWT_SECRET = 'gfg_jwt_secret_key';

const fetchdata = (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Please authenticate using valid tooken"})
    }
    try{
        const data = jwt.verify(token,JWT_SECRET)
        req.user = data.user;
        next();
    }
    catch(error){
        res.status(500).send({error})
        console.log(error)
    }
    
}


module.exports = fetchdata;
