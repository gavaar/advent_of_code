import run from "aocrunner";

const errorPointsMap: { [error: string]: number } = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

const completionPoints: { [error: string]: number } = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const parseInput = (rawInput: string): string[] => rawInput.split('\n');

const checkForClosing = (check: string, expectedClose: string[]) => {
  const wasExpected = expectedClose.pop();
  if (wasExpected === check) {
    return null;
  }
  return check;
}

const errorValue = (closingErrors: string[]): number => {
  return closingErrors.reduce((sum, err) => sum += errorPointsMap[err], 0)
}

const part1 = (rawInput: string) => {
  const rows = parseInput(rawInput);

  const errorCloseTags: string[] = [];
  rows.forEach(row => {
    const expectedClose: string[] = [];

    row.split('').find(openOrClose => {
      switch(openOrClose) {
        case '(':
          expectedClose.push(')');
          break;
        case '[':
          expectedClose.push(']');
          break;
        case '{':
          expectedClose.push('}');
          break;
        case '<':
          expectedClose.push('>');
          break;
        default:
          const checked = checkForClosing(openOrClose, expectedClose);
          if (checked) {
            errorCloseTags.push(checked);
            return true;
          }
          break;
      }
      return false;
    });
  });

  return errorValue(errorCloseTags);
};

const part2 = (rawInput: string) => {
  const rows = parseInput(rawInput);
  const noErrorRows: { row: string, expectedClose: string[] | null }[] = rows.map(row => {
    const expectedClose: string[] = [];

    const hasError = row.split('').find(openOrClose => {
      switch(openOrClose) {
        case '(':
          expectedClose.push(')');
          break;
        case '[':
          expectedClose.push(']');
          break;
        case '{':
          expectedClose.push('}');
          break;
        case '<':
          expectedClose.push('>');
          break;
        default:
          const checked = checkForClosing(openOrClose, expectedClose);
          if (checked) {
            return true;
          }
          break;
      }
      return false;
    });
    if (hasError) {
      return { row, expectedClose: null };
    }
    return { row, expectedClose };
  }).filter(r => r.expectedClose);

  const closingValues = noErrorRows.map(({ expectedClose }) => {
    return expectedClose!.reverse().reduce((sum, val) => {
      sum = sum * 5 + completionPoints[val];
      return sum;
    }, 0);
  }).sort((a, b) => a > b ? 1 : -1);

  return closingValues[(closingValues.length - 1) / 2];
};

const testInput = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`;
run({
  part1: {
    tests: [
      { input: testInput, expected: 26397 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 288957 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
