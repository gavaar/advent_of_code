import run from "aocrunner";

const originalSetting = {
  '0_1_2_4_5_6': 0,
  '2_5': 1,
  '0_2_3_4_6': 2,
  '0_2_3_5_6': 3,
  '1_2_3_5': 4,
  '0_1_3_5_6': 5,
  '0_1_3_4_5_6': 6,
  '0_2_5': 7,
  '0_1_2_3_4_5_6': 8,
  '0_1_2_3_5_6': 9,
};

const parseInput = (rawInput: string): Map<string, string> => {
  const lines = rawInput.split('\n');
  const inputMap = new Map();
  lines.forEach(line => {
    const [wires, output] = line.split(' | ');
    inputMap.set(wires, output);
  });
  return inputMap;
};

const letterToNumberRelation = (inputs: string) => {
  const letterMap: { [letter: string]: number } = {};
  const splittedKeys = inputs.split(' ');
  const one = splittedKeys.find(k => k.length === 2);
  const twoThreeFive = splittedKeys.filter(k => k.length === 5);
  const four = splittedKeys.find(k => k.length === 4);
  const zeroSixNine = splittedKeys.filter(k => k.length === 6);
  const seven = splittedKeys.find(k => k.length === 3);

  const f = one.split('').find(letter => zeroSixNine.every(zsn => zsn.includes(letter)));
  const c = one.split('').find(letter => letter !== f);
  const a = seven.split('').find(letter => letter !== f && letter !== c);
  const d = four.split('').find(letter => twoThreeFive.every(ttf => ttf.includes(letter)));
  const b = four.split('').find(letter => letter !== c && letter !== d && letter !== f);
  const g = twoThreeFive[0].split('').find(letter => letter !== a && letter !== b && letter !== c && letter !== d && letter !== f && twoThreeFive.every(ttf => ttf.includes(letter)));
  const e = 'abcdefg'.split('').find(letter =>  letter !== a && letter !== b && letter !== c && letter !== d && letter !== f && letter !== g);

  letterMap[a] = 0;
  letterMap[b] = 1;
  letterMap[c] = 2;
  letterMap[d] = 3;
  letterMap[e] = 4;
  letterMap[f] = 5;
  letterMap[g] = 6;

  return letterMap;
}

const part1 = (rawInput: string) => {
  const inputMap = parseInput(rawInput);
  const outputs = [...inputMap.values()];

  const flatOutputs = outputs.map(out => out.split(' ')).flat();
  const oneFourSevenEigth = flatOutputs.filter(out => out.length == 2 || out.length === 3 || out.length === 4 || out.length === 7);

  return oneFourSevenEigth.length;
};

const part2 = (rawInput: string) => {
  const inputMap = parseInput(rawInput);

  const sum = [...inputMap.keys()].reduce((outputSum, key) => {
    const output = inputMap.get(key);
    const keyAndOutput = `${key} ${output}`;
    const letterMap = letterToNumberRelation(keyAndOutput);

    outputSum += +output.split(' ').map(out => {
      const outKey = out.split('').map(letter => letterMap[letter]).sort().join('_');
      const outNumber = originalSetting[outKey];
      return outNumber;
    }).join('');

    return outputSum;
  }, 0);
  return sum;
};

const testInput = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 26 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 61229 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
