import Aggregate from "../Model/Aggregate/Aggregate";
import FieldValue from "../Model/Aggregate/FieldValue";
import AggregateMapping from "../Model/Mapping/AggregateMapping";
import Field from "../Model/Mapping/Field";
import AggregateManager from "../Model/ODM/AggregateManager";
import IAggregateNormalizer from "../Model/ODM/IAggregateNormalizer";
import ManagedAggregate from "../Model/ODM/ManagedAggregate";

class JSONDenormalizer implements IAggregateNormalizer {
    private manager: AggregateManager;

    public normalize(aggregate: Aggregate): object {
        const computedFields = aggregate.$fieldValues.reduce((jsonObj: object, fieldValue: FieldValue) => {
            jsonObj[fieldValue.$field.$name] = fieldValue.$value.value;
            return {...jsonObj};
        }, {});

        const metadata = {aggregateName: aggregate.$name};

        return {...computedFields, ...{metadata}};
    }

    public denormalize(payload: any): Aggregate {
        // const tmp = {...payload};
        // const mappingAggregate = this.manager.$mappings.find(
        //      (mapping: AggregateMapping) => mapping.$name === payload.metadata.aggregateName );
        // if (!mappingAggregate) {
        //     throw new Error("Mapping Aggregate not found!");
        // }
        // delete tmp.metadata;
        // const aggregate = Aggregate.createEmpty(mappingAggregate);
        // tmp.forEach((key, value) => {

        // });

        return new Aggregate();
    }

    public setAggregateManager(manager: AggregateManager) {
        this.manager = manager;
    }

}

export default JSONDenormalizer;
