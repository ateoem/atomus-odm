import AggregateMapping from "../../../src/Model/Mapping/AggregateMapping";
import AggregateManager from "../../../src/Model/ODM/AggregateManager";
import AggregateRepository from "../../../src/Model/ODM/AggregateRepository";

class AggregateManagerMock extends AggregateManager {
    public flush() {
        return 1;
    }

    public getRepository(mapping: string | AggregateMapping): AggregateRepository {
        throw new Error("Method not implemented.");
    }
}

export default AggregateManagerMock;
