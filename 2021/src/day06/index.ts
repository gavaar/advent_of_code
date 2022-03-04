import run from "aocrunner";

const cycleSequence: { [prevKey: number]: number } = {
  2: 4,
  4: 6,
  6: 8,
  8: 1,
  1: 3,
  3: 5,
  5: 7,
  7: 0,
  0: 2,
};
const config = {
  daysTest: 35,
  days: 80,
  daysPart2: 256,
};
const parseInput = (rawInput: string): number[] => rawInput.split(',').map(v => +v);

const pascalTriangle = (power: number): { [key: string]: number } => {
  const triangle: { [key: string]: number } = {};
  for (let row = 0; row <= power; row++) {
    for (let k = 0; k <= row; k++) {
      const prevKeyOne = triangle[`${row - 1}_${k - 1}`] || 0;
      const prevKeyTwo = triangle[`${row - 1}_${k}`] || 0;
      triangle[`${row}_${k}`] = (prevKeyOne + prevKeyTwo) || 1;
    }
  }

  return triangle;
}

const predictFishes = (initDay: number, totalDays: number) => {
  const cycles = Math.floor(totalDays / 7);
  const leftoverDays = totalDays % 7;
  const pascal = pascalTriangle(cycles);

  let nextDay = initDay,
    rowModifier = 0,
    kModifier = 0,
    fishesMidCycle = 0,
    fishes = [];

  for (let k = 0; k <= cycles; k++) {
    if (nextDay > 6) {
      rowModifier -= 1;
      kModifier -= 1;
    }

    const fishesForDayValue = pascal[`${cycles + rowModifier}_${k + kModifier}`];
    fishes.push(fishesForDayValue);

    if (nextDay < leftoverDays) {
      fishesMidCycle += fishesForDayValue;
    }

    nextDay = cycleSequence[nextDay];
  }

  const fishesInTheEnd = fishes.reduce((a, b) => a + b);

  return fishesInTheEnd + fishesMidCycle;
}

const part1 = (rawInput: string) => {
  const fishes = parseInput(rawInput);
  const totalFishes = fishes.map(fish => predictFishes(fish, config.days));

  return totalFishes.reduce((a, b) => a + b);
};
const part2 = (rawInput: string) => {
  const fishes = parseInput(rawInput);
  const totalFishes = fishes.map(fish => predictFishes(fish, config.daysPart2));

  return totalFishes.reduce((a, b) => a + b);
};

const testInput = '3,4,3,1,2';
run({
  part1: {
    tests: [
      { input: testInput, expected: 5934 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 26984457539 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
