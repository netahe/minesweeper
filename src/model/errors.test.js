import {SteppedOnMine} from "./errors";

it('test if instanceof operator works correctly on errors', () => {
   expect(new SteppedOnMine() instanceof SteppedOnMine).toBe(true);
});