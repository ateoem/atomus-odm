import {v1 as uuid} from "uuid";
import AggregateMapping from "../Mapping/AggregateMapping";
import Field from "../Mapping/Field";
import FieldType from "../Mapping/FieldType";
import ScalarField from "../Mapping/ScalarField";
import AggregateChange from "./AggregateChange";
import AggregateChanges from "./AggregateChanges";
import FieldValue from "./FieldValue";

class Aggregate {
    public static createFromFieldValues(name: string, fieldValues: FieldValue[]): Aggregate {
        const aggregate = new Aggregate();
        aggregate.fieldValues = fieldValues;
        aggregate.name = name;
        return aggregate;
    }

    public static createEmpty(name: string, aggregateMapping: AggregateMapping): Aggregate {
        const aggregate = new Aggregate();
        aggregate.name = name;
        aggregate.aggregateMapping = aggregateMapping;
        aggregate.initFieldValues();
        const uuidField = new FieldValue(new ScalarField("id", FieldType.uuid), {value: uuid()});
        aggregate.fieldValues.push(uuidField);

        return aggregate;
    }

    private name: string = "";
    private aggregateMapping: AggregateMapping;
    private fieldValues: FieldValue[] = [];

    public id() {
        return this.fieldValues.find((fieldValue) => fieldValue.$field.$name === "id").$value;
    }

    get $fieldValues() {
        return this.fieldValues;
    }

    public computeChanges(dirtyAggregate: Aggregate): AggregateChanges {
        const changes = new AggregateChanges();
        this.$fieldValues.forEach( (fieldValue) => {
            const dirtyFieldValue = dirtyAggregate.$fieldValues
            .find((dirtyElem) => dirtyElem.$field.$name === fieldValue.$field.$name);

            if (dirtyFieldValue === undefined) { throw new Error("Field not found!"); }
            if (JSON.stringify(dirtyFieldValue.$value) !== JSON.stringify(fieldValue.$value)) {
                changes.addChange(new AggregateChange(fieldValue.$field, fieldValue.$value, dirtyFieldValue.$value));
            }
        });

        return changes;
    }

    protected initFieldValues() {
        this.fieldValues = this.aggregateMapping.$fields.map( (field) => new FieldValue(field, {}) );
    }
}

export default Aggregate;
