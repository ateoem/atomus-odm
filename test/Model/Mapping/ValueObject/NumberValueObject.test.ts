import NumberValueObject from "../../../../src/Model/Mapping/ValueObject/NumberValueObject";
import ValueChange from "../../../../src/Model/Mapping/ValueChange";

describe('NumberValueObject', () => {
    it('should have clone/isEqual.', () => {
        const numberVO = new NumberValueObject(123);
        expect(numberVO.$value).toBe(123);
        expect(numberVO.clone().isEqual(numberVO)).toBe(true);
    });

    it('should allow string as argument.', () => {
        const numberVO = new NumberValueObject("12345.12345");
        expect(numberVO.$value).toBe(12345.12345);
    });

    it('should not compute changes if no changes.', () => {
        const numberOne = new NumberValueObject(123);
        const numberTwo = new NumberValueObject(123);
        const changes: ValueChange = numberOne.getChange(numberTwo);
        expect(changes).toBeInstanceOf(ValueChange);
        expect(changes.isDirty).toBe(false);
    });
    it('should compute changes.', () => {
        const numberOne = new NumberValueObject(12);
        const numberTwo = new NumberValueObject(123);
        const changes: ValueChange = numberOne.getChange(numberTwo);
        expect(changes).toBeInstanceOf(ValueChange);
        expect(changes.$new).toBe(123);
        expect(changes.$old).toBe(12);
        expect(changes.isDirty).toBe(true);
    });
});