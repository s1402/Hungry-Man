import { SharedService } from './../../services/shared.service';
import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe, RecipeDetails } from 'src/common/RecipeDetails';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  recipeDetails: RecipeDetails = { recipes: [] };
  recipeByCuisineArray: Array<[string, Recipe[]]> = [];
  currentIndices: number[] = [];
  recipeByCuisineMap: Map<string, Recipe[]> = new Map();
  selectedRecipe: Recipe | null = null;

  constructor(
    private readonly recipeService: RecipeService,
    private readonly router: Router,
    private readonly sharedService: SharedService,
    private readonly platformLocation: PlatformLocation
  ) {}

  ngOnInit(): void {
    /* API call to get recipe details */
    this.recipeService.getAllRecipes().subscribe({
      next: (recipeDetails: RecipeDetails) => {
        this.recipeDetails = recipeDetails;
        this.recipeDetails.recipes.forEach((currRecipe: Recipe) => {
          if (
            this.recipeByCuisineMap &&
            this.recipeByCuisineMap.has(currRecipe.cuisine)
          ) {
            const exisitingRecipes = this.recipeByCuisineMap.get(
              currRecipe.cuisine
            );
            exisitingRecipes?.push(currRecipe);
          } else {
            this.recipeByCuisineMap.set(currRecipe.cuisine, [currRecipe]);
          }
        });
        this.recipeByCuisineArray = Array.from(
          this.recipeByCuisineMap.entries()
        );
        this.currentIndices = this.recipeByCuisineArray.map(() => 0);
      },
      error: (error) => {
        console.error('>> Error fetching recipes:', error);
      },
    });

    /* Subscription called when user selects a recipe from search dropdown */
    this.sharedService.recipeDetails$.subscribe((recipe: Recipe | null) => {
      if (recipe) {
        this.navigateToRecipeDetails(recipe);
      }
    });

    /* called when user clicks back/forward btn in browser */
    this.platformLocation.onPopState(() => {
      this.navigateToHome();
    });
  }

  prev(index: number) {
    const cuisineRecipeLength = this.recipeByCuisineArray[index][1].length;
    this.currentIndices[index] =
      this.currentIndices[index] == 0
        ? cuisineRecipeLength - 1
        : this.currentIndices[index] - 1;
  }

  next(index: number) {
    const cuisineRecipeLength = this.recipeByCuisineArray[index][1].length;
    this.currentIndices[index] =
      (this.currentIndices[index] + 1) % cuisineRecipeLength;
  }

  getRecipeDetails(recipes: [string, Recipe[]], index: number) {
    let currentRecipe: Recipe = recipes[1][this.currentIndices[index]];
    this.navigateToRecipeDetails(currentRecipe);
  }

  sort(): void {
    this.recipeByCuisineArray.sort((a, b) => a[0].localeCompare(b[0]));
    this.router.navigate(['/'], {
      queryParams: {
        sort: 'asc',
      },
    });
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
    this.selectedRecipe = null;
    this.sharedService.clearRecipeDetails();
  }

  navigateToRecipeDetails(currentRecipe: Recipe): void {
    this.selectedRecipe = currentRecipe;
    this.router.navigate(['/'], {
      queryParams: {
        name: this.selectedRecipe.name,
      },
    });
  }
}
