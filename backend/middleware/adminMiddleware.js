

const admin=async(req,res,next)=>{
    if(req.user && req.user.role==='admin'){
        next();
    } else {
        res.status(403).json({message:"Access denied, not an admin"});
    }
};

module.exports={admin};
