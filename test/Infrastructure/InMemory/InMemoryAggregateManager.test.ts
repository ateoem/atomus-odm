import JSONDenormalizer from "../../../src/Infrastructure/Common/JSONDenormalizer";
import InMemoryManager from "../../../src/Infrastructure/InMemory/InMemoryManager";
import AggregateMapping from "../../../src/Model/Mapping/DocumentMapping";
import Field from "../../../src/Model/Mapping/Field";
import ChildField from "../../../src/Model/Mapping/Fields/ChildField";
import ChildrenField from "../../../src/Model/Mapping/Fields/ChildrenField";
import IdField from "../../../src/Model/Mapping/Fields/IdField";
import StringField from "../../../src/Model/Mapping/Fields/StringField";
import FieldType from "../../../src/Model/Mapping/FieldType";
import AggregateManager from "../../../src/Model/ODM/DocumentManager";
import AggregateRepository from "../../../src/Model/ODM/DocumentRepository";
import Builder from "../Common/Builder";

describe("InMemoryAggregateManager", () => {
    describe("Flat-Document", () => {
        const denormalizer = new JSONDenormalizer();
        const manager = new InMemoryManager(denormalizer);
        denormalizer.setAggregateManager(manager);

        const fields = [
        new IdField("id"),
        new StringField("name"),
        new StringField("surname"),
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

    describe("Child-document", () => {
        const authorMapping = Builder
        .mapping("author")
        .addField(new StringField("name"))
        .addField(new StringField("surname"))
        .build();

        const commentMapping = Builder
        .mapping("comment")
        .addField(new StringField("content"))
        .addField(new ChildField("author", authorMapping))
        .build();

        const postMapping = Builder
        .mapping("blogpost")
        .addField(new IdField("id"))
        .addField(new StringField("title"))
        .addField(new ChildrenField("comments", commentMapping))
        .addField(new ChildField("author", authorMapping))
        .build();

        const normalizer = new JSONDenormalizer();
        const manager: AggregateManager = new InMemoryManager(normalizer);
        normalizer.setAggregateManager(manager);
        manager.manageMapping(authorMapping);
        manager.manageMapping(commentMapping);
        manager.manageMapping(postMapping);

        const newComment = () =>
            ({content: "random", author: {name: "test", surname: Math.random().toString()}});

        it("should create empty blogpost element.", () => {
            const post: any = manager.createNewAggregate("blogpost");
            expect(post.title).toBe("");
            expect(post.comments).toEqual([]);
            expect(post.author.name).toEqual("");
            expect(post.author.surname).toEqual("");
        });

        it("should be able to retrieve blogpost repository.", () => {
            const repository: AggregateRepository = manager.getRepository("blogpost");
            expect(repository).toBeInstanceOf(AggregateRepository);
        });

        it("should be able to save blogpost.", async () => {
            const repository = manager.getRepository("blogpost");
            const post: any = manager.createNewAggregate("blogpost");
            post.author.name = "Alojzy";
            post.author.surname = "Kwiatkowski";
            post.title = "Lorem Ipsum";
            manager.persist(post);
            manager.flush();
            const retrievedDocument: any = await repository.findById(post.id);
            expect(retrievedDocument).toEqual(post);
            expect(retrievedDocument.author.name).toBe("Alojzy");
        });

        it("should be able to save blogpost with comments <happypath>.", async () => {
            const repository = manager.getRepository("blogpost");
            const post: any = manager.createNewAggregate("blogpost");
            post.author.name = "Alojzy";
            post.author.surname = "Kwiatkowski";
            post.title = "Lorem Ipsum";
            post.comments.push(newComment());
            post.comments.push(newComment());
            post.comments.push(newComment());
            post.comments.push(newComment());
            manager.persist(post);
            manager.flush();
            let retrievedDocument: any = await repository.findById(post.id);
            expect(retrievedDocument).toEqual(post);
            expect(retrievedDocument.author.name).toBe("Alojzy");
            expect(retrievedDocument.comments.length).toBe(4);

            post.comments.push(newComment());
            post.comments.push(newComment());
            post.comments.push(newComment());
            post.comments.push(newComment());
            manager.persist(post);
            manager.flush();
            retrievedDocument = await repository.findById(post.id);
            expect(retrievedDocument.comments.length).toBe(8);

            post.comments.splice(2);
            manager.persist(post);
            manager.flush();
            retrievedDocument = await repository.findById(post.id);
            expect(retrievedDocument.comments.length).toBe(2);

            post.author = {};
            manager.persist(post);
            manager.flush();
            retrievedDocument = await repository.findById(post.id);
            expect(retrievedDocument.author).toEqual({
                name: "",
                surname: "",
            });

        });
    });
});
