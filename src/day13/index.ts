import run from "aocrunner";

// typings
type Point = { x: number; y: number };
type Instruction = { axis: string; amount: number };
type PointsAndInstructions = { points: Point[]; instructions: Instruction[] };

// unagi
const pointsAndInstructions = (rawInput: string): PointsAndInstructions => {
  const [rawPoints, rawInstructions] = rawInput.split('\n\n');
  const points = rawPoints.split('\n').map(point => {
    const [x, y] = point.split(',');
    return { x: +x, y: +y };
  });
  const instructions = rawInstructions.split('\n').map(instruction => {
    const [axis, amount] = instruction.split('fold along ')[1].split('=');
    return { axis, amount: +amount };
  });

  return { instructions, points };
};

const buildPointSet = (points: Point[]): Set<string> => {
  return new Set<string>(points.map(({ x, y }) => `${x}_${y}`));
};

const sheetAfterInstruction = (sheet: Set<string>, instruction: Instruction): Set<string> => {
  const sheetCopy = new Set(sheet);

  sheetCopy.forEach(point => {
    const [x, y] = point.split('_');

    switch(instruction.axis) {
      case 'x':
        if (+x > instruction.amount) {
          const newX = 2 * instruction.amount - +x;
          sheetCopy.delete(`${x}_${y}`);
          sheetCopy.add(`${newX}_${y}`);
        }
        break;
      case 'y':
        if (+y > instruction.amount) {
          const newY = 2 * instruction.amount - +y;
          sheetCopy.delete(`${x}_${y}`);
          sheetCopy.add(`${x}_${newY}`);
        }
        break;
    }
  });

  return sheetCopy;
};

const drawThing = (sheet: Set<string>): string => {
  const points = [...sheet.values()].reduce((axisPoints, point) => {
    const [x, y] = point.split('_');

    axisPoints.x.push(+x);
    axisPoints.y.push(+y);

    return axisPoints;
  }, { x: [], y: [] } as { x: number[]; y: number[] });

  const columnMax = Math.max(...points.x);
  const rowMax = Math.max(...points.y);

  const picture: string[][] = Array.from(new Array(rowMax + 1), () => {
    return Array.from(new Array(columnMax + 1), () => '.');
  });

  for (let point of sheet.values()) {
    const [x, y] = point.split('_');
    picture[+y][+x] = '#';
  };

  return picture.map(row => row.join('') + '\n').join('');
};

const part1 = (rawInput: string) => {
  const { points, instructions } = pointsAndInstructions(rawInput);
  let finalPoints = buildPointSet(points);
  
  const firstInstruction = instructions[0];
  finalPoints = sheetAfterInstruction(finalPoints, firstInstruction);
  
  return finalPoints.size;
};

const part2 = (rawInput: string) => {
  const { points, instructions } = pointsAndInstructions(rawInput);
  let finalPoints = buildPointSet(points);

  for (let instruction of instructions) {
    finalPoints = sheetAfterInstruction(finalPoints, instruction);
  }
  return 'EFJKZLBL';
};

const testInput = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;
run({
  part1: {
    tests: [
      { input: testInput, expected: 17 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 'EFJKZLBL' },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
