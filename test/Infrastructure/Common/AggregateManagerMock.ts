import AggregateMapping from "../../../src/Model/Mapping/DocumentMapping";
import AggregateManager from "../../../src/Model/ODM/DocumentManager";
import AggregateRepository from "../../../src/Model/ODM/DocumentRepository";

class AggregateManagerMock extends AggregateManager {
    public flush() {
        return 1;
    }

    public getRepository(mapping: string | AggregateMapping): AggregateRepository {
        throw new Error("Method not implemented.");
    }
}

export default AggregateManagerMock;
