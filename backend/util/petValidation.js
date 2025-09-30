//check if pet attributes are not empty
function validatePetData(req, res, next){
    const {type, name, description, services} = req.body;

    if(!type || !name || !description || !services){
        return res.status(400).json({message: "Missing fields: ", data: req.body});
    }
    next();
}

module.exports = {
    validatePetData,
}
