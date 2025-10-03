const petService = require('../../services/petService');
const { logger } = require('../../util/logger');

logger.info = jest.fn();

jest.mock('nanoid', () => ({
    nanoid: jest.fn(() => '12345')
}));

const { nanoid } = require('nanoid');

jest.mock('../../repository/petDAO', () => ({
    createPet: jest.fn(),
    updatePet: jest.fn(),
    deletePet: jest.fn()
}));

const petDAO = require('../../repository/petDAO');

describe('petService createPet', () => {
    let dummyPet, dummyData;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a pet successfully', async () => {
        dummyPet = {
            type: 'dog',
            name: 'Rex',
            services: ['walking'],
            description: 'friendly dog',
            images: ['img1.jpg'],
            location: 'NYC'
        };

        dummyData = {
            ...dummyPet,
            id: '12345',
            entity: 'PET',
            photos: dummyPet.images,
            location: dummyPet.location
        };

        petDAO.createPet.mockResolvedValue(dummyData);

        const result = await petService.createPet('u#abc123', dummyPet);

        expect(nanoid).toHaveBeenCalledWith(5);
        expect(petDAO.createPet).toHaveBeenCalledWith('u#abc123', expect.objectContaining({
            id: '12345',
            type: 'dog',
            name: 'Rex'
        }));
        expect(logger.info).toHaveBeenCalled();
        expect(result).toBe(dummyData);
    });

    it('should return null if userId is missing', async () => {
        const result = await petService.createPet(null, dummyPet);
        expect(result).toBeNull();
        expect(logger.info).toHaveBeenCalled();
    });
});

describe('petService updatePet', () => {
    let updates, dbUpdates;

    beforeEach(() => {
        jest.clearAllMocks();
        updates = { location: 'LA', photos: ['img2.jpg'], services: ['grooming'] };
        dbUpdates = {
            expression: 'SET #location = :location, #photos = :photos, #services = :services',
            names: { '#location': 'location', '#photos': 'photos', '#services': 'services' },
            values: { ':location': 'LA', ':photos': ['img2.jpg'], ':services': ['grooming'] }
        };
    });

    it('should update a pet successfully', async () => {
        petDAO.updatePet.mockResolvedValue(dbUpdates);

        const result = await petService.updatePet('u#abc123', 'pet123', updates);

        expect(petDAO.updatePet).toHaveBeenCalledWith('u#abc123', 'pet123', dbUpdates);
        expect(result).toBe(dbUpdates);
    });

    it('should return null if userId or petId is missing', async () => {
        const result1 = await petService.updatePet(null, 'pet123', updates);
        expect(result1).toBeNull();

        const result2 = await petService.updatePet('u#abc123', null, updates);
        expect(result2).toBeNull();
    });

    it('should return null if DAO returns null (pet not found)', async () => {
        petDAO.updatePet.mockResolvedValue(null);

        const result = await petService.updatePet('u#abc123', 'pet123', updates);
        expect(result).toBeNull();
    });
});

describe('petService deletePet', () => {
    it('should delete a pet successfully', async () => {
        const dummyData = { id: 'pet123', name: 'Rex' };
        petDAO.deletePet.mockResolvedValue(dummyData);

        const result = await petService.deletePet('u#abc123', 'pet123');

        expect(petDAO.deletePet).toHaveBeenCalledWith('u#abc123', 'pet123');
        expect(result).toBe(dummyData);
    });

    it('should return null if DAO returns null (pet not found)', async () => {
        petDAO.deletePet.mockResolvedValue(null);

        const result = await petService.deletePet('u#abc123', 'pet123');
        expect(result).toBeNull();
    });
});
