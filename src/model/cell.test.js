import {CellModel} from "./cell";

it('test copying a cell object', () => {
    let cell = new CellModel();
   expect(cell.getSnapshot()).not.toBe(cell);
});