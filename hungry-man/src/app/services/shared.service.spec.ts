import { TestBed } from '@angular/core/testing';
import { SharedService } from './shared.service';
import { Recipe } from 'src/common/RecipeDetails';

describe('SharedService', () => {
  let service: SharedService;

  const mockRecipe: Recipe = {
    id: 1,
    name: 'Test Recipe',
    ingredients: ['ingredient1', 'ingredient2'],
    instructions: ['step1', 'step2'],
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 2,
    difficulty: 'easy',
    cuisine: 'Italian',
    caloriesPerServing: 300,
    tags: ['vegan', 'healthy'],
    image: 'test-image-url',
    rating: 4.5,
    mealType: ['lunch']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit a recipe through recipeDetails$', (done) => {
    service.emitRecipeDetails(mockRecipe);

    service.recipeDetails$.subscribe((recipe) => {
      expect(recipe).toEqual(mockRecipe);
      done();
    });
  });

  it('should clear recipe by emitting null', (done) => {
    service.emitRecipeDetails(mockRecipe);
    service.clearRecipeDetails();

    service.recipeDetails$.subscribe((recipe) => {
      expect(recipe).toBeNull();
      done();
    });
  });
});
