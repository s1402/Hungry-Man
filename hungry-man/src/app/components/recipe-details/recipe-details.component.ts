import { PlatformLocation } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from 'src/common/RecipeDetails';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
})
export class RecipeDetailsComponent implements OnInit {
  @Input()
  selectedRecipe: Recipe | null = null;
  @Output()
  goBackEvent = new EventEmitter<void>();

  constructor(
    private platformLocation: PlatformLocation,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.platformLocation.onPopState(() => {
      this.router.navigate(['/']);
    });
  }

  goBack(): void {
    this.goBackEvent.emit();
  }
}
