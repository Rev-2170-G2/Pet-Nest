const offerService = require("../../services/offerService");
const offerDAO = require("../../repository/offerDAO");
const { nanoid } = require("nanoid");

jest.mock("../../repository/offerDAO");
jest.mock("nanoid");

describe("offerService tests", () => {
    const loggedInUserPK = "u#owner1";

    const dummyOffer = {
        requesterSK: "PET#pet001",
        requestedSK: "PET#pet002",
        requestedOwnerId: "owner2",
        services: ["walking"],
        description: "Test offer"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createOffer", () => {
        test("should successfully create a valid offer (pet → pet)", async () => {
            nanoid.mockReturnValue("offer123");
            offerDAO.getEntity
                .mockResolvedValueOnce({})
                .mockResolvedValueOnce({});
            offerDAO.addOffer.mockResolvedValue(true);

            const result = await offerService.createOffer(dummyOffer, loggedInUserPK);

            expect(nanoid).toHaveBeenCalledWith(5);
            expect(offerDAO.addOffer).toHaveBeenCalledWith(
                "u#owner2",
                "PET#pet002",
                expect.objectContaining({
                    id: "offer123",
                    requesterPK: loggedInUserPK,
                    requesterSK: "PET#pet001",
                    requestedPK: "u#owner2",
                    requestedSK: "PET#pet002",
                    services: ["walking"],
                    description: "Test offer",
                    status: "pending"
                })
            );

            expect(result.id).toBe("offer123");
        });

        test("should allow user → pet offer", async () => {
            const offer = {
                requesterSK: "user1",
                requestedSK: "PET#pet001",
                requestedOwnerId: "owner2",
                services: ["sitting"],
                description: "User to pet"
            };

            offerDAO.getEntity
                .mockResolvedValueOnce({})
                .mockResolvedValueOnce({});
            offerDAO.addOffer.mockResolvedValue(true);
            nanoid.mockReturnValue("offer999");

            const result = await offerService.createOffer(offer, "u#owner1");

            expect(result).not.toBeNull();
            expect(result.id).toBe("offer999");
        });

        test("should allow pet → event offer", async () => {
            const offer = {
                requesterSK: "PET#pet001",
                requestedSK: "EVENT#event001",
                requestedOwnerId: "owner2",
                services: ["attendance"],
                description: "Pet to event"
            };

            offerDAO.getEntity
                .mockResolvedValueOnce({})
                .mockResolvedValueOnce({});
            offerDAO.addOffer.mockResolvedValue(true);
            nanoid.mockReturnValue("offerPetEvent");

            const result = await offerService.createOffer(offer, "u#owner1");
            expect(result).not.toBeNull();
            expect(result.id).toBe("offerPetEvent");
        });

        test("should allow event → pet offer", async () => {
            const offer = {
                requesterSK: "EVENT#event001",
                requestedSK: "PET#pet001",
                requestedOwnerId: "owner2",
                services: ["showcase"],
                description: "Event to pet"
            };

            offerDAO.getEntity
                .mockResolvedValueOnce({})
                .mockResolvedValueOnce({});
            offerDAO.addOffer.mockResolvedValue(true);
            nanoid.mockReturnValue("offerEventPet");

            const result = await offerService.createOffer(offer, "u#owner1");
            expect(result).not.toBeNull();
            expect(result.id).toBe("offerEventPet");
        });

        test("should block user → event offers", async () => {
            const offer = {
                requesterSK: "user1",
                requestedSK: "EVENT#event001",
                requestedOwnerId: "owner2",
                services: ["hosting"],
                description: "User to event"
            };

            offerDAO.getEntity
                .mockResolvedValueOnce({})
                .mockResolvedValueOnce({});

            const result = await offerService.createOffer(offer, "u#owner1");
            expect(result).toBeNull();
        });

        test("should return null if required fields are missing", async () => {
            const incompleteOffer = {...dummyOffer};
            delete incompleteOffer.requesterSK;

            const result = await offerService.createOffer(incompleteOffer, loggedInUserPK);
            expect(result).toBeNull();
        });

        test("should return null if requester entity does not exist", async () => {
            offerDAO.getEntity.mockResolvedValueOnce(null);
            const result = await offerService.createOffer(dummyOffer, loggedInUserPK);
            expect(result).toBeNull();
        });

        test("should return null if requested entity does not exist", async () => {
            offerDAO.getEntity
                .mockResolvedValueOnce({})
                .mockResolvedValueOnce(null);
            const result = await offerService.createOffer(dummyOffer, loggedInUserPK);
            expect(result).toBeNull();
        });
    });

    describe("deleteOffer", () => {
        test("should delete the offer if it exists", async () => {
            offerDAO.removeOfferBySender.mockResolvedValue(true);
            const result = await offerService.deleteOffer("sender1", "owner1", "pet001", "offer1");
            expect(result).toBe(true);
            expect(offerDAO.removeOfferBySender).toHaveBeenCalled();
        });

        test("should return null if the offer does not exist", async () => {
            offerDAO.removeOfferBySender.mockResolvedValue(null);
            const result = await offerService.deleteOffer("sender1", "owner1", "pet001", "offer1");
            expect(result).toBeNull();
        });
    });

    describe("getOffersSentByUser", () => {
        test("should return offers sent by user", async () => {
            const dummySent = [{id: "sent1"}];
            offerDAO.getOffersSentByUser.mockResolvedValue(dummySent);
            const result = await offerService.getOffersSentByUser("user1");
            expect(result).toEqual(dummySent);
        });

        test("should return empty array if error occurs", async () => {
            offerDAO.getOffersSentByUser.mockRejectedValue(new Error("DB error"));
            const result = await offerService.getOffersSentByUser("user1");
            expect(result).toEqual([]);
        });
    });

    describe("updateOfferStatus", () => {
        const ownerId = "u#owner1";
        const entityId = "pet001";
        const offerId = "offer123";

        const dummyEntity = {
            PK: ownerId,
            SK: `PET#${entityId}`,
            offers: [
                {
                    id: offerId,
                    requestedPK: ownerId,
                    requestedSK: `PET#${entityId}`,
                    status: "pending",
                    services: ["walking"],
                    description: "Test offer",
                    requesterPK: "u#sender1",
                    requesterSK: "PET#pet002",
                    createdAt: new Date().toISOString()
                }
            ]
        };

        test("should update the offer status to approved", async () => {
            offerDAO.getEntity.mockResolvedValueOnce(dummyEntity);
            offerDAO.updateEntityOffers.mockResolvedValueOnce({
                ...dummyEntity,
                offers: [{...dummyEntity.offers[0], status: "approved"}]
            });

            const result = await offerService.updateOfferStatus(ownerId, entityId, offerId, "approved");

            expect(result.status).toBe("approved");
            expect(offerDAO.getEntity).toHaveBeenCalledWith(ownerId, `PET#${entityId}`);
            expect(offerDAO.updateEntityOffers).toHaveBeenCalled();
        });

        test("should return null if invalid status", async () => {
            const result = await offerService.updateOfferStatus(ownerId, entityId, offerId, "badstatus");
            expect(result).toBeNull();
        });

        test("should return null if offer not found", async () => {
            offerDAO.getEntity.mockResolvedValueOnce({...dummyEntity, offers: []});
            const result = await offerService.updateOfferStatus(ownerId, entityId, "nope", "approved");
            expect(result).toBeNull();
        });

        test("should return null if offer doesn't belong to user", async () => {
            const other = {
                ...dummyEntity,
                offers: [{...dummyEntity.offers[0], requestedPK: "u#someoneElse"}]
            };
            offerDAO.getEntity.mockResolvedValueOnce(other);
            const result = await offerService.updateOfferStatus(ownerId, entityId, offerId, "approved");
            expect(result).toBeNull();
        });
    });
});
