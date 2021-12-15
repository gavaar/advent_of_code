import run from "aocrunner";

class GridManager {
  lastY: number;
  lastX: number;

  private grid: { [x_y: string]: number } = {};

  constructor({ lastX, lastY }: { lastX: number; lastY: number }) {
    this.lastX = lastX - 1;
    this.lastY = lastY - 1;
  }

  get(x: number, y: number): number {
    return this.grid[`${x}_${y}`];
  }

  set(x: number, y: number, value: number): void {
    this.grid[`${x}_${y}`] = value;
  }

  addOne(x: number, y: number): number {
    const newValue = this.get(x, y) + 1;
    this.set(x, y, newValue);
    return newValue;
  }

  getDiagonalsFor(x: number, y: number): [number, number][] {
    const adjacent: [number, number][] = [];
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (this.get(i, j) != null && !(i === x && j === y)) {
          adjacent.push([i, j]);
        }
      }
    }
    return adjacent;
  }
}

const parseInput = (rawInput: string): GridManager => {
  const rows = rawInput.split('\n');
  const newGridManager = new GridManager({ lastX: rows[0].split('').length, lastY: rows.length });
  return rows.reduce((grid, row, y) => {
    row.split('').forEach((num, x) => {
      grid.set(x, y, +num);
    });
    return grid;
  }, newGridManager);
};

const iterateGrid = (gridManager: { lastX: number; lastY: number }, forEach: (x: number, y: number) => any) => {
  for (let x = 0; x <= gridManager.lastX; x++) {
    for (let y = 0; y <= gridManager.lastY; y++) {
      forEach(x, y);
    }
  }
};

const iterateSteps = (steps: number, forEach: (step?: number) => any): void => {
  for (let i = 0; i < steps; i++) {
    forEach(i);
  }
};

/**
 * Adds one to all numbers, return those that became 10
 */
const addOneToAll = (gridManager: GridManager): [number, number][] => {
  const becameTen: [number, number][] = [];

  const onIteration = (x: number, y: number) => {
    const newValue = gridManager.addOne(x, y);
    if (newValue === 10) {
      becameTen.push([x, y]);
    }
  };

  iterateGrid(gridManager, onIteration);

  return becameTen;
};

/**
 * Adds one to adjacent from list, and recursively adds one to all until they are all added past 10
 *
 * Warning: this mutates the gridManager data;
 */
const addOneToAdjacent = (gridManager: GridManager, forList: [number, number][]): void => {
  forList.forEach(([x, y]) => {
    const diagonals = gridManager.getDiagonalsFor(x, y);

    diagonals.forEach(([_x, _y]) => {
      const newValue = gridManager.addOne(_x, _y);

      if (newValue === 10) {
        addOneToAdjacent(gridManager, [[_x, _y]]);
      }
    });
  });
};

/**
 * returns the list of bright ones that were transformed into 0
 */
const countAndTransformThoseOverNine = (gridManager: GridManager): [number, number][] => {
  const changedToZero: [number, number][] = [];

  const forEachGrid = (x: number, y: number) => {
    const posValue = gridManager.get(x, y);
    if (posValue >= 10) {
      changedToZero.push([x, y]);
      gridManager.set(x, y, 0);
    }
  };

  iterateGrid(gridManager, forEachGrid);

  return changedToZero;
};

const getDrawing = (gridManager: GridManager) => {
  let drawing: string[][] = [];
  const onIteration = (x: number, y: number) => {
    if (!drawing[y]) {
      drawing[y] = [];
    }
    drawing[y][x] = `${gridManager.get(x, y)}`;
  }

  iterateGrid(gridManager, onIteration);

  return drawing.map(row => row.join('') + '\n').join('');
}

const part1 = (rawInput: string): number => {
  let shone = 0;
  const gridManager = parseInput(rawInput);

  const onIteration = () => {
    const brigthened = addOneToAll(gridManager);
    addOneToAdjacent(gridManager, brigthened);
    const allThatShone = countAndTransformThoseOverNine(gridManager);
    // console.log(getDrawing(gridManager));
    shone += allThatShone.length;
  }

  iterateSteps(100, onIteration);

  return shone;
};

const part2 = (rawInput: string) => {
  let allShone = 0;
  const gridManager = parseInput(rawInput);
  const expectedSync = (gridManager.lastX + 1) * (gridManager.lastY + 1);

  const onIteration = (step?: number) => {
    const brigthened = addOneToAll(gridManager);
    addOneToAdjacent(gridManager, brigthened);
    const allThatShone = countAndTransformThoseOverNine(gridManager);

    if (allThatShone.length === expectedSync && !allShone) {
      allShone += step! + 1;
    }
  }

  iterateSteps(300, onIteration);

  return allShone;
};

const testInput = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;
run({
  part1: {
    tests: [
      { input: testInput, expected: 1656 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 195 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
