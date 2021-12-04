import run from "aocrunner";

type Board = { [x_y: string]: string };

// change boards into coords object
const parseBoards = (bingoBoard: string): Board => {
  const rows = bingoBoard.split('\n');
  return rows.reduce((board, row, rowIndex) => {
    const values = row.split(' ').filter(v => v !== '');
    values.forEach((val, columnIndex) => {
      board[`${rowIndex}_${columnIndex}`] = val;
    });

    return board;
  }, {} as Board);
};

const parseInput = (rawInput: string) => {
  const parsed = rawInput.split('\n\n');
  const bingoInput = parsed.shift()!;
  const boards = parsed.map(board => parseBoards(board));

  return { bingoInput, boards };
};

type WinTracker = { [boardPos: number]: { rows: { [pos: number]: boolean[] } , columns: { [pos: number]: boolean[] }, won: boolean } };
const buildEmptyWinTracker = (boards: Board[]): WinTracker => {
  return boards.reduce(
    (condition, b, pos) => {
      const buildLosingArr = () => Array(5).fill(false);
      condition[pos] = {
        rows: { 0: buildLosingArr(), 1: buildLosingArr(), 2: buildLosingArr(), 3: buildLosingArr(), 4: buildLosingArr() },
        columns: { 0: buildLosingArr(), 1: buildLosingArr(), 2: buildLosingArr(), 3: buildLosingArr(), 4: buildLosingArr() },
        won: false
      };

      return condition;
    }, {} as WinTracker
  );
}

const findMatchInBoard = (inputs: string[], boards: Board[], stopAfterWins = 1): { boardState: { won: number[], lost: number[] }, lastNumberCalled: string, gameFinalState: WinTracker } => {
  const boardState: { won: number[], lost: number[] } = { won: [], lost: [] };
  const winTracker: WinTracker = buildEmptyWinTracker(boards);

  const winningInput = inputs.find(call => {
    boards.forEach((board, boardPos) => {
      const markedCall = Object.keys(board).find(axes => board[axes] === call);

      if (markedCall) {
        const [x, y] = markedCall.split('_');

        winTracker[boardPos].rows[+x][+y] = true;
        winTracker[boardPos].columns[+y][+x] = true;

        if (winTracker[boardPos].rows[+x].filter(Boolean).length > 4 ||
          winTracker[boardPos].columns[+y].filter(Boolean).length > 4) {
            winTracker[boardPos].won = true;
            boardState.won.push(boardPos);
            boardState.won = [...new Set(boardState.won)];
          }
      }
    });

    if (boardState.won.length === stopAfterWins) {
      Object.values(winTracker).forEach((b, ind) => {
        if (!b.won) {
          boardState.lost.push(ind);
        }
      });

      return true;
    }
  })!;

  return { boardState, lastNumberCalled: winningInput, gameFinalState: winTracker };
}

type MarkedUnmarked = { marked: string[]; unmarked: string[] };
const getMarkedAndUnmarked = (board: Board, boardState: WinTracker[any]): MarkedUnmarked => {
  const result: MarkedUnmarked = { marked: [], unmarked: [] };

  Object.keys(board).forEach(key => {
    const [x, y] = key.split('_');
    const wasMarked = boardState.rows[+x][+y];

    result[wasMarked ? 'marked' : 'unmarked'].push(board[key]);
  });

  return result;
}

const part1 = (rawInput: string) => {
  const { bingoInput, boards } = parseInput(rawInput);

  const { boardState, lastNumberCalled, gameFinalState } = findMatchInBoard(bingoInput.split(','), boards);
  const boardThatWon = boards[boardState.won[0]];

  const { unmarked } = getMarkedAndUnmarked(boardThatWon, gameFinalState[boardState.won[0]]);
  const unmarkedSum = unmarked.reduce((sum, value) => sum += +value, 0);
  return unmarkedSum * +lastNumberCalled;
};

const part2 = (rawInput: string) => {
  const { bingoInput, boards } = parseInput(rawInput);

  const { boardState, lastNumberCalled, gameFinalState } = findMatchInBoard(bingoInput.split(','), boards, boards.length);
  const lastToWin = boardState.won[boardState.won.length - 1];

  const { unmarked } = getMarkedAndUnmarked(boards[lastToWin], gameFinalState[lastToWin]);
  const unmarkedSum = unmarked.reduce((sum, value) => sum += +value, 0);
  return unmarkedSum * +lastNumberCalled;
};

const testInput = `1,2,3,4,5,6,7,8,9,10,11

10 11 12 13 14
 1  2  3  4  6
15 16 17 18 19
20 21 22 23 24
 5 25 26 27 28

 1  6  7 10 11
 2 12 13 14 15
 3 16 17 18 19
 4 20 21 22 23
 5 24 25 26 27
`;

run({
  part1: {
    tests: [
      { input: testInput, expected: 1730 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: testInput, expected: 2166 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
