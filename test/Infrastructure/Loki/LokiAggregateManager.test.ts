import JSONDenormalizer from "../../../src/Infrastructure/Common/JSONDenormalizer";
import AggregateRepository from "../../../src/Model/ODM/AggregateRepository";
import AggregateManagerMock from "../Common/AggregateManagerMock";

describe.skip("LokiAggregateManager", () => {
    const manager = new AggregateManagerMock(new JSONDenormalizer());
    it("should be able to create new sample document.", () => {
        const newDocument: any = manager.createNewAggregate("test");
        expect(newDocument.id).not.toBeNull();
    });

    it("should be able to retrieve document repository.", () => {
        const repository: AggregateRepository = manager.getRepository("test");
        expect(repository).toBeInstanceOf(AggregateRepository);
    });

    it("should be able to persist and flush document properly.", () => {
        const repository: AggregateRepository = manager.getRepository("test");
        const newDocument: any = manager.createNewAggregate("test");
        manager.persist(newDocument);
        manager.flush();
        const retrievedDocument = repository.findById(newDocument.id);

        expect(newDocument).toEqual(retrievedDocument);
    });

    it("should be able to update and flush document properly.", () => {
        const repository: AggregateRepository = manager.getRepository("test");
        const newDocument: any = manager.createNewAggregate("test");

        manager.persist(newDocument);
        manager.flush();

        newDocument.name = "lorem ipsum";
        newDocument.surname = "dolor sit";

        manager.persist(newDocument);
        manager.flush();

        const retrievedDocument: any = repository.findById(newDocument.id);
        expect(newDocument).toEqual(retrievedDocument);
    });
});
