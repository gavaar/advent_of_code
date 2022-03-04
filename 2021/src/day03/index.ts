import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n');

const part1 = (rawInput: string) => {
  const binaries = parseInput(rawInput);
  // per index, we have a tuple with [zeroSum, oneSum];
  const indexBinaryMap: { [index: number]: [number, number] } = {};

  for (let i = 0; i < binaries.length; i++) {
    binaries[i].split('').forEach((binaryPoint, binaryPos) => {
      if (!indexBinaryMap[binaryPos]) {
        indexBinaryMap[binaryPos] = [0, 0];
      }
      indexBinaryMap[binaryPos][+binaryPoint] += 1;
    });
  }

  const { gamma, epsilon } = Object.values(indexBinaryMap).reduce((gamEps, binary) => {
    const [zero, one] = binary;

    gamEps.gamma += zero > one ? '0' : '1';
    gamEps.epsilon += zero > one ? '1' : '0';

    return gamEps;
  }, { gamma: '', epsilon: '' });

  return parseInt(gamma, 2) * parseInt(epsilon, 2);
};

const part2 = (rawInput: string) => {
  const binaries = parseInput(rawInput);

  function filterListByPointValue(list: string[], index: number, mostCommon = true): string[] {
    const zeroesAndOnes = [0, 0];

    list.forEach(binary => zeroesAndOnes[+binary[index]] += 1);

    return list.filter(binary => {
      const mostCommonBinary = zeroesAndOnes[0] > zeroesAndOnes[1] ? '0' : '1';

      if (mostCommon) {
        return binary[index] === mostCommonBinary;
      } else {
        return binary[index] !== mostCommonBinary;
      }
    });
  }

  function getOxygenCO2Value(mostCommon = true, list = binaries, index = 0): string[] {
    if (index > 20) return ['we fucked up'];

    const filteredList = filterListByPointValue(list, index, mostCommon);
    if (filteredList.length > 1) {
      return getOxygenCO2Value(mostCommon, filteredList, index + 1);
    }
    return filteredList;
  }

  const oxygen = getOxygenCO2Value()[0];
  const co2 = getOxygenCO2Value(false)[0];

  return parseInt(oxygen, 2) * parseInt(co2, 2);
};

const testInput = `
  00100
  11110
  10110
  10111
  10101
  01111
  00111
  11100
  10000
  11001
  00010
  01010
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 198 },
      {
        input: `
          11100
          11111
          00011
        `,
        expected: 0
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 230 },
      {
        input: `
          11100
          11111
          00011
        `,
        expected: 93
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
