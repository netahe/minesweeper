import {CellModel} from "./cell";

it('test CellModel.getSnapshot()', () => {
    let cell = new CellModel();
   expect(cell.getSnapshot()).not.toBe(cell);
});