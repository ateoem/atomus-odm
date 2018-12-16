import AggregateManager from "../../src/Model/ODM/AggregateManager";

class AggregateManagerMock extends AggregateManager {
    public flush() {
        return 1;
    }
}

export default AggregateManagerMock;
