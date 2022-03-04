import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n');

const part1 = (rawInput: string): number => {
  const directions = parseInput(rawInput);

  const { depth, horizontal } = directions.reduce((location, instruction) => {
    const [inst, magnitude] = instruction.split(' ');

    switch (inst) {
      case 'forward':
        location.horizontal += +magnitude;
        break;
      case 'up':
        location.depth -= +magnitude;
        break;
      case 'down':
        location.depth += +magnitude;
        break;
    }

    return location;
  }, { depth: 0, horizontal: 0 });

  return depth * horizontal;
};

const part2 = (rawInput: string) => {
  const directions = parseInput(rawInput);

  const { depth, horizontal } = directions.reduce((location, instruction) => {
    const [inst, magnitude] = instruction.split(' ');

    switch (inst) {
      case 'forward':
        location.horizontal += +magnitude;
        location.depth += +magnitude * location.aim;
        break;
      case 'up':
        location.aim -= +magnitude;
        break;
      case 'down':
        location.aim += +magnitude;
        break;
    }

    return location;
  }, { depth: 0, horizontal: 0, aim: 0 });

  return depth * horizontal;
};

const testInput = {
  one: `
    forward 4
    down 8
    down 3
    down 1
    forward 8
    up 6
    down 4
    forward 2
    down 4
    down 6
    down 7
    forward 1
    down 4
    down 6
    forward 7
    down 2
    up 8
    up 3
    forward 1
    forward 2
  `,
  two: `
    forward 2
    up 2
    forward 2
    down 2
  `,
};

run({
  part1: {
    tests: [
      {
        input: testInput.one,
        expected: 700,
      },
      {
        input: testInput.two,
        expected: 0,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput.one,
        expected: 12150,
      },
      {
        input: testInput.two,
        expected: -16,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
