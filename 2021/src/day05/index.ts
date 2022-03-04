import run from "aocrunner";

type Vent = { x1: number, x2: number, y1: number, y2: number, slope: number };
const parseInput = (rawInput: string): Vent[] => {
  const eachLine = rawInput.split('\n');
  return eachLine.map(line => {
    const [before, after] = line.split(' -> ');
    const [x1, y1] = before.split(',').map(v => +v);
    const [x2, y2] = after.split(',').map(v => +v);

    const obj: Partial<Vent> = { x1, x2, y1, y2 };

    if (x2 < x1) {
      obj.x2 = x1;
      obj.x1 = x2;
      obj.y2 = y1;
      obj.y1 = y2;
    }

    if (y2 === y1) {
      obj.slope = 0;
    } else if (x2 === x1) {
      obj.slope = Infinity;
    } else {
      obj.slope = (y2 - y1) / (x2 - x1);
    }

    return obj as Vent;
  });
};

const straightAndSlopedvents = (vents: Vent[]): { sloped: Vent[], straight: Vent[] } => {
  return vents.reduce((acc, vent) => {
    const inclination = vent.slope === Infinity || vent.slope === 0 ? 'straight' : 'sloped';
    acc[inclination].push(vent);
    return acc;
  }, { straight: [], sloped: [] } as { sloped: Vent[], straight: Vent[] });
}

const ventedCoords = (vents: Vent[]): { [coord: string]: number } => {
  return vents.reduce((overlappingCoords, vent)=> {
    const { x1, x2, y1, y2, slope } = vent;
    const smallerY = Math.min(y2, y1);
    const biggerY = Math.max(y2, y1);
    const smallerX = Math.min(x1, x2);
    const biggerX = Math.max(x1, x2);

    if (slope === Infinity) {
      for (let step = smallerY; step <= biggerY; step++) {
        overlappingCoords[`${x1}_${step}`] = (overlappingCoords[`${x1}_${step}`] || 0) + 1;
      }
    } else {
      for (let step = 0; (step + smallerX) <= biggerX; step++) {
        const newY = y1 + (step * slope);
        overlappingCoords[`${smallerX + step}_${newY}`] = (overlappingCoords[`${smallerX + step}_${newY}`] || 0) + 1;
      }
    }

    return overlappingCoords;
  }, {} as { [coord: string]: number });
}

const part1 = (rawInput: string) => {
  const vents = parseInput(rawInput);
  const { straight } = straightAndSlopedvents(vents);
  const coords = ventedCoords(straight);
  const filteredCoords = Object.keys(coords).filter(c => coords[c] > 1);

  return filteredCoords.length;
};

const part2 = (rawInput: string) => {
  const vents = parseInput(rawInput);
  const { straight, sloped } = straightAndSlopedvents(vents);
  const coords = ventedCoords([...straight, ...sloped]);
  const filteredCoords = Object.keys(coords).filter(c => coords[c] > 1);
  // if (Object.keys(coords).length < 50) {
  //   let map = '';
  //   for (let y = 0; y < 10; y++) {
  //     for (let x = 0; x < 9; x++) {
  //       map += coords[`${x}_${y}`] || '.';
  //     }
  //     map += '\n';
  //   }

  //   console.log(map);
  // }
  return filteredCoords.length;
};

const testInput = `
  0,9 -> 5,9
  8,0 -> 0,8
  9,4 -> 3,4
  2,2 -> 2,1
  7,0 -> 7,4
  6,4 -> 2,0
  0,9 -> 2,9
  3,4 -> 1,4
  0,0 -> 8,8
  5,5 -> 8,2
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 5 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 12 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
