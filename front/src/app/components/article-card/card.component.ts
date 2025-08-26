import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Topic } from 'src/app/models/Topic';
import { Article } from 'src/app/models/Article';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() content!: Article | Topic;
  @Input() hasButton: boolean = false;
  @Input() titleButton: string = '';
  @Output() cardClicked = new EventEmitter<Article | Topic>();
  @Output() buttonClicked = new EventEmitter<Article | Topic>();

  constructor() {}

  ngOnInit(): void {}

  onCardClick(): void {
    this.cardClicked.emit(this.content);
  }

  onButtonClick(event: Event): void {
    event.stopPropagation();
    this.buttonClicked.emit(this.content);
  }

  isArticle(content: any): content is Article {
    return (content as Article).createdAt !== undefined;
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }
}
