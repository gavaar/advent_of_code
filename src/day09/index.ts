import run from "aocrunner";

// -1 means there's a wall to that side
type HeightPoint = { value: number; right: number; top: number; left: number; bottom: number, row: number, column: number };
const parseInput = (rawInput: string): HeightPoint[] => {
  const heightMap: HeightPoint[] = [];
  const rows: number[][] = rawInput.split('\n').map(row => row.split('').map(v => +v));
  
  const getHeightFor = (rowIndex: number, heightIndex: number): number => {
    const row = rows[rowIndex];
    if (row) {
      const height = row[heightIndex];
      if (height != null) {
        return height;
      }
    }
    return -1;
  };

  rows.forEach((r, rowIndex) => {
    r.forEach((height, heightIndex) => {
      const heightPoint: HeightPoint = {
        value: height,
        right: getHeightFor(rowIndex, heightIndex + 1),
        left: getHeightFor(rowIndex, heightIndex - 1),
        top: getHeightFor(rowIndex - 1, heightIndex),
        bottom: getHeightFor(rowIndex + 1, heightIndex),
        row: rowIndex,
        column: heightIndex,
      };

      heightMap.push(heightPoint);
    });
  });

  return heightMap;
};

// for part 1
const findLowPoints = (heightMap: HeightPoint[]): HeightPoint[] => {
  return heightMap.filter(h => {
    return (h.value < h.top || h.top === -1) &&
      (h.value < h.left || h.left === -1) &&
      (h.value < h.right || h.right === -1) &&
      (h.value < h.bottom || h.bottom === -1);
  });
}

// for part 2
type HeightPointIndex = { [row_column: string]: HeightPoint };
const heightPointIndex = (heightPoints: HeightPoint[]): HeightPointIndex => {
  return heightPoints.reduce((indexed, point) => {
    indexed[`${point.row}_${point.column}`] = point;
    return indexed;
  }, {} as HeightPointIndex);
};

const basinPoints = (lowPoint: HeightPoint, pointIndex: HeightPointIndex): HeightPoint[] => {
  const { column, row, value } = lowPoint;
  const points = [lowPoint];

  const pointsForSide = (side: 'left' | 'right' | 'top' | 'bottom') => {
    const checkedIndex = (() => {
      switch(side) {
        case 'left':
          return `${row}_${column - 1}`;
        case 'right':
          return `${row}_${column + 1}`;
        case 'bottom':
          return `${row + 1}_${column}`;
        case 'top':
          return `${row - 1}_${column}`;
      }
    })();

    const checkedSide = lowPoint[side];
    if (checkedSide !== -1 && checkedSide !== 9 && checkedSide > value) {
      const checkedPoint = pointIndex[checkedIndex];
      const concatPoints = basinPoints(checkedPoint, pointIndex);
      points.push(...concatPoints);
    }
  }

  pointsForSide('left');
  pointsForSide('right');
  pointsForSide('bottom');
  pointsForSide('top');

  return points;
}

const checkPointGrowth = (lowPoint: HeightPoint, allPoints: HeightPoint[]): number => {
  const allPointsIndexed = heightPointIndex(allPoints);
  const includedInBasin = basinPoints(lowPoint, allPointsIndexed);
  const checkedIndexes: { [row_column: string]: boolean } = {};

  includedInBasin.forEach(({ row, column }) => {
    checkedIndexes[`${row}_${column}`] = true;
  });

  return Object.keys(checkedIndexes).length;
}

const part1 = (rawInput: string) => {
  const heightMap = parseInput(rawInput);
  const lowPoints = findLowPoints(heightMap);
  const riskLevel = lowPoints.reduce((sum, h) => sum += h.value + 1, 0);

  return riskLevel;
};

const part2 = (rawInput: string) => {
  const heightMap = parseInput(rawInput);
  const lowPoints = findLowPoints(heightMap);
  
  const basinSizes = lowPoints.map(point => checkPointGrowth(point, heightMap)).sort((a,b) => a > b ? 1 : -1).reverse();
  basinSizes.length = 3;


  const basinArea = basinSizes.reduce((a,b) => a *= b);

  return basinArea;
};

const testInput = `2199943210
3987894921
9856789892
8767896789
9899965678`;
run({
  part1: {
    tests: [
      { input: testInput, expected: 15 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 1134 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
