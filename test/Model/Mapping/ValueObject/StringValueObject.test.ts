import NumberValueObject from "../../../../src/Model/Mapping/ValueObject/NumberValueObject";
import StringValueObject from "../../../../src/Model/Mapping/ValueObject/StringValueObject";
import ValueChange from "../../../../src/Model/Mapping/ValueChange";

describe('StringValueObject', () => {
    it('should have clone/isEqual', () => {
        const numberVO = new StringValueObject("test_test");
        expect(numberVO.$value).toBe("test_test");
        expect(numberVO.clone().isEqual(numberVO)).toBe(true);
    });

    it('should allow number as argument', () => {
        const numberVO = new StringValueObject(12345.12345);
        expect(numberVO.$value).toBe("12345.12345");
    });

    it('should not compute changes if no changes.', () => {
        const numberOne = new StringValueObject("test");
        const numberTwo = new StringValueObject("test");
        const changes: ValueChange = numberOne.getChange(numberTwo);
        expect(changes).toBeInstanceOf(ValueChange);
        expect(changes.isDirty).toBe(false);
    });
    it('should compute changes.', () => {
        const numberOne = new StringValueObject("lorem");
        const numberTwo = new StringValueObject("test");
        const changes: ValueChange = numberOne.getChange(numberTwo);
        expect(changes).toBeInstanceOf(ValueChange);
        expect(changes.$new).toBe("test");
        expect(changes.$old).toBe("lorem");
        expect(changes.isDirty).toBe(true);
    });
});