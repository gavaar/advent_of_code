import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split(',').map(v => +v);

const fuelCostForPos = (pos: number, crabPositions: number[], accumulator: boolean): number => {
  return crabPositions.reduce((fuelCost, crab) => {
    const steps = Math.abs(crab - pos);
    if (!accumulator) {
      fuelCost += steps;
    } else {
      fuelCost += (steps * (steps + 1)) / 2;
    }
    return fuelCost;
  }, 0);
}

const fuelCostMap = (crabPositions: number[], costAccumulator = false) => {
  const possiblePositions = Array.from(new Array(Math.max(...crabPositions) + 1), (_, i) => i);

  return possiblePositions.reduce((fuelCostMap, crabPos) => {
    fuelCostMap[crabPos] = fuelCostForPos(crabPos, crabPositions, costAccumulator);
    return fuelCostMap;
  }, {} as { [pos: number]: number });
}

const part1 = (rawInput: string) => {
  const crabPositions = parseInput(rawInput);
  const fuelCosts = fuelCostMap(crabPositions);
  const lowestCost = Math.min(...Object.values(fuelCosts));

  return lowestCost;
};

const part2 = (rawInput: string) => {
  const crabPositions = parseInput(rawInput);
  const fuelCosts = fuelCostMap(crabPositions, true);
  const lowestCost = Math.min(...Object.values(fuelCosts));

  return lowestCost;
};

const testInput = '16,1,2,0,4,2,7,1,2,14';
run({
  part1: {
    tests: [
      { input: testInput, expected: 37 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 168 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
