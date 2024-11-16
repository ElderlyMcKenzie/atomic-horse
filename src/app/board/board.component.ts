import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  constructor(private gameService: GameService) {}

  // Геттеры для доски и состояния
  get board(): string[][] {
    return this.gameService.board;
  }

  get possibleMoves(): { row: number, col: number }[] {
    return this.gameService.possibleMoves;
  }

  get startPositionSelected(): boolean {
    return this.gameService.startPositionSelected;
  }

  // Выбор начальной позиции
  selectStartPosition(row: number, col: number): void {
    this.gameService.selectStartPosition(row, col);
  }

  // Перемещение коня
  moveKnight(targetRow: number, targetCol: number): void {
    this.gameService.moveKnight(targetRow, targetCol);
  }

  // Проверка, является ли клетка возможным ходом
  isPossibleMove(row: number, col: number): boolean {
    return this.gameService.possibleMoves.some(move => move.row === row && move.col === col);
  }

  // Сброс игры
  resetGame(): void {
    this.gameService.resetGame();  // Вызов метода resetGame() из GameService
  }
}
