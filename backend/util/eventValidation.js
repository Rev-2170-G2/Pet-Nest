

function validateEvent(event) {
    console.log('validateEvent called');
    const nameResult = event.name && event.name.length > 0;
    const descResult = event.description && event.description.length > 0;
    const dateResult = event.date && event.date.length > 0;
    const locationResult = event.location && event.location.length > 0;
    return (nameResult && descResult && dateResult && locationResult);
}

module.exports = { validateEvent };