import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecipeDetails } from 'src/common/RecipeDetails';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private url = 'https://dummyjson.com/recipes';

  constructor(private httpClient: HttpClient) {}

  getAllRecipes(): Observable<RecipeDetails> {
    return this.httpClient.get<RecipeDetails>(this.url);
  }

  searchRecipe(name: string): Observable<RecipeDetails> {
    const url = `${this.url}/search?q=${name}`;
    return this.httpClient.get<RecipeDetails>(url);
  }
}
