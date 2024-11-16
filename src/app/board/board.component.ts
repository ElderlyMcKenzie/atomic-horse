import { Component} from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  board: string[][] = []; // Доска, представлена 2D массивом
  knightPosition = { row: 0, col: 0 }; // Текущая позиция коня на доске
  visitedCells: boolean[][] = []; // Массив для отслеживания посещенных клеток
  currentMove = 1; // Номер текущего хода
  possibleMoves: { row: number, col: number }[] = []; // Список возможных ходов коня
  startPositionSelected = false;  // Флаг, указывающий, была ли выбрана начальная позиция коня

  constructor() {
    this.initializeBoard(); // Инициализация доски при создании компонента
  }

  // Метод для инициализации доски 10x10 и начальной позиции коня
  initializeBoard(): void {
    /*this.board = Array.from({ length: 8 }, () => Array(8).fill(''));
    this.visitedCells = Array.from({ length: 8 }, () => Array(8).fill(false));*/
    
    this.board = Array.from({ length: 10 }, () => Array(10).fill('')); // Инициализация доски размером 10x10 с пустыми строками
    this.visitedCells = Array.from({ length: 10 }, () => Array(10).fill(false)); // Инициализация массива посещенных клеток

    this.startPositionSelected = false; // Сбрасываем флаг выбора начальной позиции
    this.possibleMoves = [];  // Сбрасываем список возможных ходов
    //this.calculatePossibleMoves();
  }

  // Метод для выбора начальной позиции коня
  selectStartPosition(row: number, col: number): void {
    if (this.visitedCells[row][col]) return;  // Если клетка уже посещена, игнорируем выбор
  
    this.knightPosition = { row, col }; // Устанавливаем коня на выбранную клетку
    this.board[row][col] = '♞';  // Обозначаем коня на доске
    this.visitedCells[row][col] = true;  // Отмечаем клетку как посещенную
    this.startPositionSelected = true;  // Фиксируем, что позиция выбрана
    this.calculatePossibleMoves();  // Пересчитываем возможные ходы
  }

  // Метод для расчета возможных ходов коня
  calculatePossibleMoves(): void {
    const moves = [
      { row: 2, col: 1 }, { row: 2, col: -1 },
      { row: -2, col: 1 }, { row: -2, col: -1 },
      { row: 1, col: 2 }, { row: 1, col: -2 },
      { row: -1, col: 2 }, { row: -1, col: -2 }
    ];

  /*this.possibleMoves = moves
    .map(move => ({
      row: this.knightPosition.row + move.row,
      col: this.knightPosition.col + move.col
    }))
    .filter(pos =>
      pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8 && !this.visitedCells[pos.row][pos.col]
    );*/
    
    // Вычисляем возможные ходы на основе текущей позиции коня
    this.possibleMoves = moves
    .map(move => ({
      row: this.knightPosition.row + move.row,
      col: this.knightPosition.col + move.col
    }))
    // Фильтруем ходы, чтобы оставались только те, которые находятся в пределах доски
    // и еще не были посещены
    .filter(pos =>
      pos.row >= 0 && pos.row < 10 && pos.col >= 0 && pos.col < 10 && !this.visitedCells[pos.row][pos.col]
    );
  }

  // Метод для проверки, является ли ход коня легальным
  isMoveLegal(targetRow: number, targetCol: number): boolean {
    const rowDiff = Math.abs(this.knightPosition.row - targetRow); // Разница в строках
    const colDiff = Math.abs(this.knightPosition.col - targetCol); // Разница в столбцах
    const isLegalMove = (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2); // Проверка легальности хода коня
    const isNotVisited = !this.visitedCells[targetRow][targetCol]; // Проверка, что клетка еще не посещена

    return isLegalMove && isNotVisited;
  }

  // Метод для выполнения последнего хода, если нет доступных ходов
  makeLastMove(): void {
    const lastMove = this.possibleMoves[0]; // Берем первый доступный ход (если таковой есть)

    if (lastMove) {
      this.moveKnight(lastMove.row, lastMove.col); // Перемещаем коня в найденную клетку
    }
  }

  // Метод для перемещения коня
  moveKnight(targetRow: number, targetCol: number): void {
    // Сначала проверяем, легален ли ход
    if (this.isMoveLegal(targetRow, targetCol)) {
      // Очистить текущую позицию (пишем номер хода)
      this.board[this.knightPosition.row][this.knightPosition.col] = `${this.currentMove}`;
      this.currentMove++;
  
      // Обновить позицию коня
      this.knightPosition = { row: targetRow, col: targetCol };
      this.board[targetRow][targetCol] = '♞';
  
      // Отметить клетку как посещенную
      this.visitedCells[targetRow][targetCol] = true;
  
      // Пересчитываем возможные ходы после перемещения
      this.calculatePossibleMoves();
  
      // После перемещения проверяем завершение игры
      this.checkGameOver();
    } else {
      alert('Недопустимый ход или клетка уже посещена.');
    }
  }

  // Проверка завершения игры
  checkGameOver(): void {
    // Проверяем, все ли клетки посещены
    if (this.isGameComplete()) {
      setTimeout(() => {
        alert('Поздравляем! Вы заполнили всю доску.');
        this.resetGame(); // Перезапуск игры после выигрыша
      }, 30); // Задержка, чтобы дать времени обновить состояние
    } else if (this.possibleMoves.length === 0) {
      setTimeout(() => {
        // Нет доступных ходов, игра завершена, делаем последний ход
        this.makeLastMove(); // Выполняем последний ход
        alert('Вы проиграли. Ходов больше нет');
      }, 30); // Задержка, чтобы дать времени обновить состояние
    }
  }


  // Метод для проверки, заполнены ли все клетки
  isGameComplete(): boolean {
    return this.visitedCells.every(row => row.every(cell => cell));
  }

  // Метод для перезапуска игры
  resetGame(): void {
    this.initializeBoard(); // Инициализация новой доски
    this.currentMove = 1; // Сбросить номер хода
    this.startPositionSelected = false;  // Убедимся, что флаг выбора не установлен
  }
  

  // Метод для проверки, является ли клетка возможным ходом
  isPossibleMove(row: number, col: number): boolean {
    return this.possibleMoves.some(move => move.row === row && move.col === col);
  }
}
