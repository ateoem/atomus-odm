import JSONDenormalizer from "../../../src/Infrastructure/Common/JSONDenormalizer";
import FieldValue from "../../../src/Model/Document/FieldValue";
import MappedAggregate from "../../../src/Model/Document/MappedDocument";
import AggregateMapping from "../../../src/Model/Mapping/DocumentMapping";
import Field from "../../../src/Model/Mapping/Field";
import AggregateManager from "../../../src/Model/ODM/DocumentManager";
import AggregateManagerMock from "./AggregateManagerMock";

class MappingBuilder {
    private fields: Field[];
    private name: string;

    constructor(name: string) {
        this.fields = [];
        this.name = name;
    }

    public addField(field: Field): MappingBuilder {
        this.fields.push(field);
        return this;
    }

    public build() {
        return new AggregateMapping(this.name, this.fields);
    }
}

// tslint:disable-next-line:max-classes-per-file
class MappedAggregateBuilder {
    private aggregateMapping: AggregateMapping;
    private fieldValues: FieldValue[];

    constructor(aggregateMapping: AggregateMapping) {
        this.aggregateMapping = aggregateMapping;
        this.fieldValues = [];
    }

    public addFieldValue(name: string, value: any) {
        const field = this.aggregateMapping.get(name);
        if (!field) {
            throw new Error("Field not found!");
        }
        this.fieldValues.push(new FieldValue(field, value));

        return this;
    }

    public build() {
        return new MappedAggregate(this.aggregateMapping, this.fieldValues);
    }
}

// tslint:disable-next-line:max-classes-per-file
class Builder {
    public static mapping(name: string): MappingBuilder {
        return new MappingBuilder(name);
    }

    public static mappedAggregate(aggregateMapping: AggregateMapping): MappedAggregateBuilder {
        return new MappedAggregateBuilder(aggregateMapping);
    }

    public static aggregateManager(): AggregateManager {
        const denormalizer = new JSONDenormalizer();
        const aggregateMock = new AggregateManagerMock(denormalizer);
        denormalizer.setAggregateManager(aggregateMock);
        return aggregateMock;
    }
}

export default Builder;
