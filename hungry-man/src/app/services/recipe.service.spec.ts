import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RecipeService } from './recipe.service';
import { RecipeDetails } from 'src/common/RecipeDetails';

describe('RecipeService', () => {
  let service: RecipeService;
  let httpMock: HttpTestingController;

  const mockRecipeDetails: RecipeDetails = {
    recipes: [
      {
        id: 1,
        name: 'Pizza',
        ingredients: ['Cheese', 'Tomato'],
        instructions: ['Bake'],
        prepTimeMinutes: 10,
        cookTimeMinutes: 20,
        servings: 2,
        difficulty: 'Easy',
        cuisine: 'Italian',
        caloriesPerServing: 300,
        tags: ['cheesy', 'quick'],
        image: 'pizza.jpg',
        rating: 4.5,
        mealType: ['Lunch']
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecipeService]
    });

    service = TestBed.inject(RecipeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensures no pending requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all recipes', () => {
    service.getAllRecipes().subscribe((data) => {
      expect(data).toEqual(mockRecipeDetails);
    });

    const req = httpMock.expectOne('https://dummyjson.com/recipes');
    expect(req.request.method).toBe('GET');
    req.flush(mockRecipeDetails);
  });

  it('should search recipes by name', () => {
    const searchTerm = 'Pizza';
    service.searchRecipe(searchTerm).subscribe((data) => {
      expect(data).toEqual(mockRecipeDetails);
    });

    const req = httpMock.expectOne(`https://dummyjson.com/recipes/search?q=Pizza`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRecipeDetails);
  });
});
