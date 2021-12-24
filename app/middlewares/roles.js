const rules = {}

module.exports = (req, res, next) => {
    console.log(req.originalUrl)
    if(req.user){
        //do something with rules
        if(true){
            next()
        }else{
            res.status(403).json({ success: false, message: 'unauthorized' });
        }
    }else{
        res.status(403).json({ success: false, message: 'unauthorized' });
    }
}