//allow user to update any or all, used in petService layer -> petDAO
function buildPetUpdates({ location, photos, services }) {
    const expressionParts = [];
    const names = {};
    const values = {};

    if (location !== undefined) {
        expressionParts.push("#location = :location");
        names["#location"] = "location";
        values[":location"] = location;
    }
    if (photos !== undefined) {
        expressionParts.push("#photos = :photos");
        names["#photos"] = "photos";
        values[":photos"] = photos;
    }
    if (services !== undefined) {
        const mappedServices = services.map(s => ({
            service: s.service,
            price: s.price
        }));
        expressionParts.push("#services = :services");
        names["#services"] = "services";
        values[":services"] = mappedServices;
    }

    if (!expressionParts.length) return null;

    return {
        expression: "SET " + expressionParts.join(", "), //ex. "SET #location = :location, #photos = :photos, #services = :services"
        names, //key in db
        values //updated values
    };
}

module.exports = {
    buildPetUpdates
}