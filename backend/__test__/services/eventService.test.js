const eventService = require('../../services/eventService');
const logger = require('../../util/logger');

logger.logger.info = jest.fn();

jest.mock('nanoid', () => ({
    nanoid: jest.fn(x => '12345')
}));

let { nanoid } = require('nanoid');

jest.mock('../../repository/eventDAO', () => ({
    createEvent: jest.fn()
}));

const eventDAO = require('../../repository/eventDAO');

describe('Positive testing on postEvent', () => {

    beforeEach(() => {
        let dummyEvent = {};
        let dummyData = {};
        jest.clearAllMocks();
    });

    it('should return the created event when required fields are present', async () => {
        dummyEvent = {
            'id': '12345',
            'name': 'event1',
            'description': 'description',
            'date': 'right now!',
            'location': 'right here!',
            'pk': 'u#fa0s9d8f',
        };
        dummyData = {
            'id': '12345',
            'name': 'event1',
            'description': 'description',
            'date': 'right now!',
            'location': 'right here!',
            'PK': 'u#fa0s9d8f',
            'SK': 'EVENT#12345',
            'photos': [],
            'status': 'pending',
            'entity': 'EVENT',
        };
        eventDAO.createEvent.mockResolvedValue(dummyData);

        const result = await eventService.postEvent(dummyEvent);

        expect(eventDAO.createEvent).toHaveBeenCalledWith(dummyData);
        expect(nanoid()).toBe('12345');
        expect(logger.logger.info).toHaveBeenCalled();
        expect(result).toBe(dummyData);
    });

        it('should return the created event when required fields are present and a photos field is included', async () => {
        dummyEvent = {
            'id': '12345',
            'name': 'event1',
            'description': 'description',
            'date': 'right now!',
            'location': 'right here!',
            'photos': ['link1', 'link2', 'link3'],
            'pk': 'u#fa0s9d8f',
        };
        dummyData = {
            'id': '12345',
            'name': 'event1',
            'description': 'description',
            'date': 'right now!',
            'location': 'right here!',
            'PK': 'u#fa0s9d8f',
            'SK': 'EVENT#12345',
            'photos': ['link1', 'link2', 'link3'],
            'status': 'pending',
            'entity': 'EVENT',
        };
        eventDAO.createEvent.mockResolvedValue(dummyData);

        const result = await eventService.postEvent(dummyEvent);

        expect(eventDAO.createEvent).toHaveBeenCalledWith(dummyData);
        expect(nanoid()).toBe('12345');
        expect(logger.logger.info).toHaveBeenCalled();
        expect(result).toBe(dummyData);
    });

        it('should return the created event with a status of pending when provided with a status', async () => {
        dummyEvent = {
            'id': '12345',
            'name': 'event1',
            'description': 'description',
            'date': 'right now!',
            'location': 'right here!',
            'status': 'accepted',
            'pk': 'u#fa0s9d8f',
        };
        dummyData = {
            'id': '12345',
            'name': 'event1',
            'description': 'description',
            'date': 'right now!',
            'location': 'right here!',
            'PK': 'u#fa0s9d8f',
            'SK': 'EVENT#12345',
            'photos': [],
            'status': 'pending',
            'entity': 'EVENT',
        };
        eventDAO.createEvent.mockResolvedValue(dummyData);

        const result = await eventService.postEvent(dummyEvent);

        expect(eventDAO.createEvent).toHaveBeenCalledWith(dummyData);
        expect(nanoid()).toBe('12345');
        expect(logger.logger.info).toHaveBeenCalled();
        expect(result).toBe(dummyData);
    });
});

describe('Negative testing on postEvent', () => {

        beforeEach(() => {
        let dummyEvent = {};
        let dummyData = {};
        jest.clearAllMocks();
    });

    it('should return null when missing the name field', async () => {
        dummyEvent = {
            'id': '12345',
            'description': 'description',
            'date': 'right now!',
            'location': 'right here!',
            'pk': 'u#fa0s9d8f',
            'photos': [],
        };

        const result = await eventService.postEvent(dummyEvent);

        expect(result).toBeFalsy();
        expect(result).toBe(null);
    });

    it('should return null when missing the description field', async () => {
        dummyEvent = {
            'id': '12345',
            'name': 'event1',
            'date': 'right now!',
            'location': 'right here!',
        };

        const result = await eventService.postEvent(dummyEvent);

        expect(result).toBeFalsy();
        expect(result).toBe(null);
    });

    it('should return null when date field is an empty string', async () => {
        dummyEvent = {
            'id': '12345',
            'description': 'description',
            'date': '',
            'location': 'right here!',
            'pk': 'u#fa0s9d8f',
            'photos': [],
        };

        const result = await eventService.postEvent(dummyEvent);

        expect(result).toBeFalsy();
        expect(result).toBe(null);
    });

    it('should return null when the location field is null', async () => {
        dummyEvent = {
            'id': '12345',
            'description': 'description',
            'date': 'right now!',
            'location': null,
            'pk': 'u#fa0s9d8f',
            'photos': [],
        };

        const result = await eventService.postEvent(dummyEvent);

        expect(result).toBeFalsy();
        expect(result).toBe(null);
    });
});