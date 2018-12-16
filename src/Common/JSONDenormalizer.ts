import Aggregate from "../Model/Aggregate/Aggregate";
import FieldValue from "../Model/Aggregate/FieldValue";
import AggregateMapping from "../Model/Mapping/AggregateMapping";
import Field from "../Model/Mapping/Field";
import AggregateManager from "../Model/ODM/AggregateManager";
import IAggregateNormalizer from "../Model/ODM/IAggregateNormalizer";
import ManagedAggregate from "../Model/ODM/ManagedAggregate";
import ScalarField from "../Model/Mapping/ScalarField";

class JSONDenormalizer implements IAggregateNormalizer {
    private manager: AggregateManager;

    public normalize(aggregate: Aggregate): object {
        const computedFields = aggregate.$fieldValues.reduce((jsonObj: object, fieldValue: FieldValue) => {
            jsonObj[fieldValue.$field.$name] = fieldValue.$value.value;
            return {...jsonObj};
        }, {});

        const metadata = {aggregateName: aggregate.$name};
        computedFields[this.manager.$symbol] = metadata;

        return computedFields;
    }

    public denormalize(payload: any): Aggregate {
        const tmp = {...payload};
        const mappingAggregate = this.manager.$mappings.find(
             (mapping: AggregateMapping) => mapping.$name === payload[this.manager.$symbol].aggregateName );
        if (!mappingAggregate) {
            throw new Error("Mapping Aggregate not found!");
        }
        const fieldVals = Object.keys(tmp).map((key) => {
            const gotField = mappingAggregate.$fields.find((field: ScalarField) => field.$name === key);
            return new FieldValue(gotField, {value: tmp[key]});
        });

        return Aggregate.createEmpty(mappingAggregate, fieldVals);
    }

    public setAggregateManager(manager: AggregateManager) {
        this.manager = manager;
    }

}

export default JSONDenormalizer;
