import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Recipe } from 'src/common/RecipeDetails';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private recipeDetailsSubject: BehaviorSubject<Recipe| null> = new BehaviorSubject<Recipe| null>(null);
  public recipeDetails$: Observable<Recipe| null> = this.recipeDetailsSubject.asObservable();

  constructor() { }

  emitRecipeDetails(recipe:Recipe){
    this.recipeDetailsSubject.next(recipe)
  }

  clearRecipeDetails(){
    this.recipeDetailsSubject.next(null);
  }
}
