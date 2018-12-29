import JSONDenormalizer from "../../../src/Infrastructure/Common/JSONDenormalizer";
import InMemoryManager from "../../../src/Infrastructure/InMemory/InMemoryManager";
import AggregateManager from "../../../src/Model/ODM/DocumentManager";
import AggregateRepository from "../../../src/Model/ODM/DocumentRepository";
import { AuthorMapping, CommentMapping, PostMapping, UserDocument } from "../../Common/Models";

describe("InMemoryAggregateManager", () => {
    describe("Flat-Document", () => {
        const denormalizer = new JSONDenormalizer();
        const manager = new InMemoryManager(denormalizer);
        denormalizer.setAggregateManager(manager);
        manager.manageMapping(UserDocument);

        it("should be able to create new sample document.", () => {
            const newDocument: any = manager.createNewAggregate("user");
            expect(newDocument.id).not.toBeNull();
        });

        it("should be able to retrieve document repository.", () => {
            const repository: AggregateRepository = manager.getRepository("user");
            expect(repository).toBeInstanceOf(AggregateRepository);
        });

        it("should be able to persist and flush document properly.", async () => {
            const repository: AggregateRepository = manager.getRepository("user");
            const newDocument: any = manager.createNewAggregate("user");
            manager.persist(newDocument);
            manager.flush();
            const retrievedDocument: any = await repository.findById(newDocument.id);

            expect(retrievedDocument.surname).toEqual("");
            expect(retrievedDocument.name).toEqual("");
            expect(retrievedDocument.id).toEqual(newDocument.id);
        });

        it("should be able to update and flush document properly.", async () => {
            const repository: AggregateRepository = manager.getRepository("user");
            const newDocument: any = manager.createNewAggregate("user");

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

        const normalizer = new JSONDenormalizer();
        let manager: AggregateManager;

        const newComment = () =>
            ({content: "random", author: {name: "test", surname: Math.random().toString()}});

        beforeEach(() => {
            manager = new InMemoryManager(normalizer);
            normalizer.setAggregateManager(manager);
            normalizer.setAggregateManager(manager);
            manager.manageMapping(AuthorMapping);
            manager.manageMapping(CommentMapping);
            manager.manageMapping(PostMapping);
        });

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
        it("should be able to retrieve blogpost by title.", async () => {
            const repository = manager.getRepository("blogpost");

            const blogpost1: any = manager.createNewAggregate("blogpost");
            const blogpost2: any = manager.createNewAggregate("blogpost");
            const blogpost3: any = manager.createNewAggregate("blogpost");
            blogpost1.title = "lorem";
            blogpost2.title = "ipsum";
            blogpost3.title = "dolor";
            manager.persist(blogpost1);
            manager.persist(blogpost2);
            manager.persist(blogpost3);
            manager.flush();

            const blogposts: any = await repository.findBy({title: "lorem"});
            const allBlogposts: any = await repository.findAll();
            expect(blogposts[0]).toEqual(blogpost1);
            expect(blogposts.length).toEqual(1);
            expect(allBlogposts.length).toEqual(3);
        });
    });

});
