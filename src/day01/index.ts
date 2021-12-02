import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n').map(v => +v);
const upsAndDowns = (numbers: number[]): { ups: number, downs: number, __lastNumber: number } => {
  return numbers.reduce((upsAndDowns, nextValue) => {
    if (upsAndDowns.__lastNumber != null) {
      if (nextValue > upsAndDowns.__lastNumber) {
        upsAndDowns.ups += 1;
      }
      if (nextValue < upsAndDowns.__lastNumber) {
        upsAndDowns.downs += 1;
      }
      
    }

    upsAndDowns.__lastNumber = nextValue;
    return upsAndDowns;
  }, { ups: 0, downs: 0, __lastNumber: null });
}

const part1 = (rawInput: string) => {
  const numbers = parseInput(rawInput);

  const { ups, downs } = upsAndDowns(numbers)
  return `${ups}`;
};

const part2 = (rawInput: string) => {
  const numbers = parseInput(rawInput);
  const sumOfMeasurements = [];

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] && numbers[i + 1] && numbers[i + 2]) {
      const sum = numbers[i] + numbers[i + 1] + numbers[i + 2];
      sumOfMeasurements.push(sum);
    }
  }

  const { ups, downs } = upsAndDowns(sumOfMeasurements)
  return `${ups}`;
};

const testInputs = {
  one: `
    200
    201
    204
    202
    206
  `,
  two: `
    200
    180
    170
    171
    150
  `,
  three: `
    200
    205
    200
  `
};

run({
  part1: {
    tests: [
      { 
        input: testInputs.one,
        expected: '3',
      },
      {
        input: testInputs.two,
        expected: '1',
      },
      {
        input: testInputs.three,
        expected: '1',
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { 
        input: testInputs.one,
        expected: '2',
      },
      {
        input: testInputs.two,
        expected: '0',
      },
      {
        input: testInputs.three,
        expected: '0',
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
