import Aggregate from "./Aggregate";
import FieldCollection from "./FieldCollection";
import FieldValueCollection from "./FieldValueCollection";
import IAggregate from "./IAggregate";

class AggregateCollection implements IAggregate {
    private aggregates: Aggregate[];
    private fields: FieldCollection;

    constructor(fieldCollection: FieldCollection, fieldValueCollection: FieldValueCollection[]) {
        this.fields = fieldCollection;
        this.aggregates = fieldValueCollection.map(
            (values: FieldValueCollection) => 
            new Aggregate(fieldCollection, values)
        );
    }

	public get $aggregates(): Aggregate[] {
		return this.aggregates;
    }
    
    public get $fields(): FieldCollection {
        return this.fields;
    }

    public get $size(): number {
        return this.$aggregates.length;
    }
    
    public clone() {
        const values = this.aggregates.map((aggregate: Aggregate) => aggregate.$values);
        return new AggregateCollection(this.$fields, values);
    }

    public isEqual(collection: AggregateCollection): boolean {
        if (collection.$size !== this.$size || !this.$fields.isEqual(collection.$fields)) {
            return false;
        }

        return this.$aggregates.findIndex((aggregate: Aggregate, index) =>
            !aggregate.isEqual(collection.$aggregates[index]
        )) === -1;
    }
} 
 
export default AggregateCollection;
