import FieldValue from "../../Model/Aggregate/FieldValue";
import MappedAggregate from "../../Model/Aggregate/MappedAggregate";
import Field from "../../Model/Mapping/Field";
import FieldType from "../../Model/Mapping/FieldType";
import AggregateManager from "../../Model/ODM/AggregateManager";
import IAggregateNormalizer from "../../Model/ODM/IAggregateNormalizer";

class JSONDenormalizer implements IAggregateNormalizer {
    private manager: AggregateManager;

    public normalize(aggregate: MappedAggregate): object {
        const fieldValuesArray = aggregate.$fieldValuesArray;
        const computedFields = fieldValuesArray.reduce((jsonObj: object, fieldValue: FieldValue) => {
            jsonObj[fieldValue.$name] = fieldValue.$value;
            return {...jsonObj};
        }, {});

        const metadata = {aggregateName: aggregate.$name};
        computedFields[this.manager.$symbol] = metadata;

        return computedFields;
    }

    public denormalize(payload: any): MappedAggregate {
        const tmp = {...payload};
        const mappingAggregate = this.manager.$mappings.get(payload[this.manager.$symbol].aggregateName);
        if (!mappingAggregate) {
            throw new Error("Mapping Aggregate not found!");
        }
        const fieldVals = Object.keys(tmp).map((key) => {
            const gotField: Field = mappingAggregate.$fields.get(key);
            return new FieldValue(gotField, tmp[key]);
        });

        return new MappedAggregate(mappingAggregate, fieldVals);
    }

    public setAggregateManager(manager: AggregateManager) {
        this.manager = manager;
    }

}

export default JSONDenormalizer;
