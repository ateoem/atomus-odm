import JSONDenormalizer from "../../../src/Infrastructure/Common/JSONDenormalizer";
import InMemoryManager from "../../../src/Infrastructure/InMemory/InMemoryManager";
import AggregateMapping from "../../../src/Model/Mapping/AggregateMapping";
import Field from "../../../src/Model/Mapping/Field";
import FieldType from "../../../src/Model/Mapping/FieldType";
import AggregateRepository from "../../../src/Model/ODM/AggregateRepository";

describe("InMemoryAggregateManager", () => {
    const denormalizer = new JSONDenormalizer();
    const manager = new InMemoryManager(denormalizer);
    denormalizer.setAggregateManager(manager);

    const fields = [
        new Field("id", FieldType.uuid),
        new Field("name", FieldType.string),
        new Field("surname", FieldType.string),
    ];
    const aggregateMapping = new AggregateMapping("test", fields);
    manager.$mappings.set("test", aggregateMapping);
    it("should be able to create new sample document.", () => {
        const newDocument: any = manager.createNewAggregate("test");
        expect(newDocument.id).not.toBeNull();
    });

    it("should be able to retrieve document repository.", () => {
        const repository: AggregateRepository = manager.getRepository("test");
        expect(repository).toBeInstanceOf(AggregateRepository);
    });

    it("should be able to persist and flush document properly.", async () => {
        const repository: AggregateRepository = manager.getRepository("test");
        const newDocument: any = manager.createNewAggregate("test");
        manager.persist(newDocument);
        manager.flush();
        const retrievedDocument: any = await repository.findById(newDocument.id);

        expect(retrievedDocument.surname).toEqual("");
        expect(retrievedDocument.name).toEqual("");
        expect(retrievedDocument.id).toEqual(newDocument.id);
    });

    it("should be able to update and flush document properly.", async () => {
        const repository: AggregateRepository = manager.getRepository("test");
        const newDocument: any = manager.createNewAggregate("test");

        manager.persist(newDocument);
        manager.flush();

        newDocument.name = "lorem ipsum";
        newDocument.surname = "dolor sit";

        manager.persist(newDocument);
        manager.flush();

        const retrievedDocument: any = await repository.findById(newDocument.id);
        expect(retrievedDocument.name).toBe("lorem ipsum");
        expect(retrievedDocument.surname).toBe("dolor sit");
        expect(retrievedDocument.id).toBe(newDocument.id);
    });
});
