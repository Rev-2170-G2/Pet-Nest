//check if pet attributes are not empty
function validatePetData(req, res, next) {
    const {type, name, description, services} = req.body;

    const typeResult = type && type.length > 0;
    const nameResult = name && name.length > 0;
    const descResult = description && description.length > 0;
    const servicesResult = services && services.length > 0;

    if (!(typeResult && nameResult && descResult && servicesResult)) {
        return res.status(400).json({ message: "Missing or empty fields", data: req.body });
    }

    next();
}

module.exports = {
    validatePetData,
}
