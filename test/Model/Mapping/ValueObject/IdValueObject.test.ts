import IdValueObject from "../../../../src/Model/Mapping/ValueObject/IdValueObject";
import ValueChange from "../../../../src/Model/Mapping/ValueChange";

describe('IdValueObject', () => {
    it('should have clone/isEqual', () => {
        const numberVO = new IdValueObject("8219cdffbc0fa9b38eca13062cd03d13");
        expect(numberVO.$value).toBe("8219cdffbc0fa9b38eca13062cd03d13");
        expect(numberVO.clone().isEqual(numberVO)).toBe(true);
    });

    it('should not compute changes if no changes.', () => {
        const numberOne = new IdValueObject("C4CA4238A0B923820DCC509A6F75849B");
        const numberTwo = new IdValueObject("C4CA4238A0B923820DCC509A6F75849B");
        const changes: ValueChange = numberOne.getChange(numberTwo);
        expect(changes).toBeInstanceOf(ValueChange);
        expect(changes.isDirty).toBe(false);
    });
    it('should compute changes.', () => {
        const numberOne = new IdValueObject("C4CA4238A0B923820DCC509A6F75849B");
        const numberTwo = new IdValueObject("43B1B881E52C55204442A369DA9278BF");
        const changes: ValueChange = numberOne.getChange(numberTwo);
        expect(changes).toBeInstanceOf(ValueChange);
        expect(changes.$new).toBe("43B1B881E52C55204442A369DA9278BF");
        expect(changes.$old).toBe("C4CA4238A0B923820DCC509A6F75849B");
        expect(changes.isDirty).toBe(true);
    });
});