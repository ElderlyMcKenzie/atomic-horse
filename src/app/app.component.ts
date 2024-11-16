import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoardModule } from './board/board.module'; // Импортируйте модуль


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BoardModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'my-app';
}
