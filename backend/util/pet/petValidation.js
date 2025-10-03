//check if any attributes are missing or empty before creation
function validatePetData(req, res, next) {
    const { type, name, description, services } = req.body;
    
    if (!type || !type.trim() || 
        !name || !name.trim() || 
        !description || !description.trim() ||
        !services || services.length === 0 || services.some(s => !s.service || !s.service.trim() || s.price === undefined)) {
        return res.status(400).json({ message: "Missing or invalid fields.", data: req.body });
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
