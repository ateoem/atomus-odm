import ValueChange from "../../../src/Model/Mapping/ValueChange";
import StringValueObject from "../../../src/Model/Mapping/ValueObject/StringValueObject";
import NumberValueObject from "../../../src/Model/Mapping/ValueObject/NumberValueObject";

describe('AggregateChange', () => {
    it('should have getters/clone', () => {
        const change = new ValueChange(new StringValueObject("1"), new StringValueObject("2"));
        expect(change.$old).toEqual("1");
        expect(change.$new).toEqual("2");
        expect(change.$toBeDeleted).toEqual(false);
    });

    it('should guard against different types.', () => {
        expect(() => {
            // tslint:disable-next-line:no-unused-expression
            new ValueChange(new StringValueObject("1"), new NumberValueObject("1"));
        }).toThrowError("ValuesObjects provided in change have different types.");
    });
});