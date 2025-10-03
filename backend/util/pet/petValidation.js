//check if pet attributes are not empty
function validatePetData(req, res, next) {
    const {type, name, description, services} = req.body;

    const typeResult = type && type.length > 0;
    const nameResult = name && name.length > 0;
    const descResult = description && description.length > 0;
    const servicesResult = services && services.length > 0;

    if (!(typeResult && nameResult && descResult && servicesResult)) {
        return res.status(400).json({ message: "Missing or empty fields.", data: req.body });
    }

    next();
}

//check if any missing fields
function validatePetUpdates(req, res, next) {
    const { location, photos, services } = req.body;

    const locationResult = location !== undefined;
    const photosResult = photos !== undefined && Array.isArray(photos);
    const servicesResult = services !== undefined && Array.isArray(services);

    if (!(locationResult || photosResult || servicesResult)) {
        return res.status(400).json({ message: "At least one field (location, photos, or services) must be provided.", data: req.body});
    }

    next();
}

module.exports = {
    validatePetData,
    validatePetUpdates
}
