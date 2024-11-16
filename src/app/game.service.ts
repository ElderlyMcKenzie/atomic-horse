import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  board: string[][] = [];
  knightPosition = { row: 0, col: 0 };
  visitedCells: boolean[][] = [];
  currentMove = 1;
  possibleMoves: { row: number, col: number }[] = [];
  startPositionSelected = false;

  constructor() {
    this.initializeBoard();
  }

  // Инициализация доски 10x10
  initializeBoard(): void {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(''));
    this.visitedCells = Array.from({ length: 10 }, () => Array(10).fill(false));
    this.startPositionSelected = false;
    this.possibleMoves = [];
  }

  // Выбор начальной позиции коня
  selectStartPosition(row: number, col: number): void {
    if (this.visitedCells[row][col]) return;
    this.knightPosition = { row, col };
    this.board[row][col] = '♞';
    this.visitedCells[row][col] = true;
    this.startPositionSelected = true;
    this.calculatePossibleMoves();
  }

  // Расчет возможных ходов
  calculatePossibleMoves(): void {
    const moves = [
      { row: 2, col: 1 }, { row: 2, col: -1 },
      { row: -2, col: 1 }, { row: -2, col: -1 },
      { row: 1, col: 2 }, { row: 1, col: -2 },
      { row: -1, col: 2 }, { row: -1, col: -2 }
    ];

    this.possibleMoves = moves
      .map(move => ({
        row: this.knightPosition.row + move.row,
        col: this.knightPosition.col + move.col
      }))
      .filter(pos =>
        pos.row >= 0 && pos.row < 10 && pos.col >= 0 && pos.col < 10 && !this.visitedCells[pos.row][pos.col]
      );
  }

  // Проверка легальности хода
  isMoveLegal(targetRow: number, targetCol: number): boolean {
    const rowDiff = Math.abs(this.knightPosition.row - targetRow);
    const colDiff = Math.abs(this.knightPosition.col - targetCol);
    const isLegalMove = (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    const isNotVisited = !this.visitedCells[targetRow][targetCol];
    return isLegalMove && isNotVisited;
  }

  // Перемещение коня
  moveKnight(targetRow: number, targetCol: number): void {
    if (this.isMoveLegal(targetRow, targetCol)) {
      this.board[this.knightPosition.row][this.knightPosition.col] = `${this.currentMove}`;
      this.currentMove++;
      this.knightPosition = { row: targetRow, col: targetCol };
      this.board[targetRow][targetCol] = '♞';
      this.visitedCells[targetRow][targetCol] = true;
      this.calculatePossibleMoves();
      this.checkGameOver();
    } else {
      alert('Недопустимый ход или клетка уже посещена.');
    }
  }

  // Проверка завершения игры
  checkGameOver(): void {
    if (this.isGameComplete()) {
      setTimeout(() => {
        alert('Поздравляем! Вы заполнили всю доску.');
        this.resetGame();
      }, 30);
    } else if (this.possibleMoves.length === 0) {
      setTimeout(() => {
        this.makeLastMove();
        alert('Вы проиграли. Ходов больше нет');
      }, 30);
    }
  }

  // Проверка завершенности игры (все ли клетки посещены)
  isGameComplete(): boolean {
    return this.visitedCells.every(row => row.every(cell => cell));
  }

  // Перезапуск игры
  resetGame(): void {
    this.initializeBoard();
    this.currentMove = 1;
    this.startPositionSelected = false;
  }

  // Сделать последний ход
  makeLastMove(): void {
    const lastMove = this.possibleMoves[0];
    if (lastMove) {
      this.moveKnight(lastMove.row, lastMove.col);
    }
  }
}
