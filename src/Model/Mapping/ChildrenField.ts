import Aggregate from "./AggregateMapping";
import Field from "./Field";

class ChildrenField  extends Field {
    private aggregate: Aggregate;

    constructor(aggregate: Aggregate, name: string) {
        super();
        this.aggregate = aggregate;
        this.name = name;
    }

    get getAggregate(): Aggregate {
        return this.aggregate;
    }
}

export default ChildrenField;