import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Article } from 'src/app/models/Article';
import { Subscription } from 'src/app/models/Subscription';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() content!: Article | Subscription;
  @Input() hasButton: boolean = false;
  @Output() cardClicked = new EventEmitter<Article | Subscription>();
  @Output() buttonClicked = new EventEmitter<Article | Subscription>(); // evento para o botão

  constructor() {}

  ngOnInit(): void {}

  onCardClick(): void {
    this.cardClicked.emit(this.content);
  }

  onButtonClick(event: Event): void {
    event.stopPropagation(); // evita que o clique do botão dispare onCardClick
    this.buttonClicked.emit(this.content);
  }

  // Tipo guarda para template
  isArticle(content: any): content is Article {
    return (content as Article).createdAt !== undefined;
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }
}
