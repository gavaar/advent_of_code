import run from "aocrunner";

interface Connections {
  [path: string]: Set<string>;
}

const parseInput = (rawInput: string): Connections => {
  const connections: Connections = {};

  rawInput.split('\n').forEach(input => {
    const [connA, connB] = input.split('-');
    
    connections[connA] = new Set(connections[connA] || []).add(connB);
    connections[connB] = new Set(connections[connB] || []).add(connA);
  });

  return connections;
};

const calculatePaths = (possibilities: string[], connections: Connections, canTraverseTwice = false): string[] => {
  const newPossibilities: string[] = [];
  const newConnections: Connections = { ...connections };

  for (let poss of possibilities) {
    const lastStep = poss.split('-').pop()!;

    if (lastStep === 'end') {
      continue;
    }

    const annexes = connections[lastStep] || [];
    const onlyPassOnce = /^[a-z]*$/.test(lastStep);

    if (onlyPassOnce) {
      if (canTraverseTwice && lastStep !== 'start') {
        if (newConnections[`wildcard::${lastStep}`] || newConnections.wildCardsOff) {
          newConnections.wildCardsOff = new Set();
          Object.keys(newConnections).forEach(conn => {
            const toDelete = conn.split('::')[1];
            delete newConnections[toDelete];
          });
          delete newConnections[lastStep];
        } else {
          newConnections[`wildcard::${lastStep}`] = new Set();
        }
      } else {
        delete newConnections[lastStep];
      }
    }

    for (let annex of annexes) {
      if (!newConnections[annex]) {
        continue;
      }

      const appendedPath = `${poss}-${annex}`;
      if (annex === 'end') {
        newPossibilities.push(appendedPath);
        continue;
      }

      const newPoss = calculatePaths([appendedPath], newConnections, canTraverseTwice);
      newPossibilities.push(...newPoss);
    }
  }

  return newPossibilities;
};

const part1 = (rawInput: string) => {
  const connections = parseInput(rawInput);
  const paths = calculatePaths(['start'], connections);

  return paths.length;
};

const part2 = (rawInput: string) => {
  const connections = parseInput(rawInput);
  const paths = calculatePaths(['start'], connections, true);

  return paths.length;
};

const testOne = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;
const testTwo = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;
const testThree = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`;

run({
  part1: {
    tests: [
      { input: testOne, expected: 10 },
      { input: testTwo, expected: 19 },
      { input: testThree, expected: 226 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testOne, expected: 36 },
      { input: testTwo, expected: 103 },
      { input: testThree, expected: 3509 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
