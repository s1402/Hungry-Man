import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RecipeService } from 'src/app/services/recipe.service';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { Recipe } from 'src/common/RecipeDetails';
import { PlatformLocation } from '@angular/common';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockRecipeService: jasmine.SpyObj<RecipeService>;
  let mockSharedService: SharedService;
  let mockRouter: jasmine.SpyObj<Router>;
  let platformLocation: Partial<PlatformLocation>;

  const mockRecipes: Recipe[] = [
    {
      id: 1,
      name: 'Paneer Burger',
      ingredients: ['Bread', 'Tomato Sauce'],
      instructions: ['Make burger'],
      prepTimeMinutes: 15,
      cookTimeMinutes: 30,
      servings: 4,
      difficulty: 'Medium',
      cuisine: 'Italian',
      caloriesPerServing: 500,
      tags: ['pasta', 'dinner'],
      image: 'img1',
      rating: 4.5,
      mealType: ['Lunch', 'Dinner'],
    },
    {
      id: 2,
      name: 'Vegetable Curry',
      ingredients: ['Potatoes', 'Carrots', 'Peas'],
      instructions: ['Chop vegetables', 'Cook with spices'],
      prepTimeMinutes: 20,
      cookTimeMinutes: 25,
      servings: 3,
      difficulty: 'Easy',
      cuisine: 'Indian',
      caloriesPerServing: 300,
      tags: ['vegetarian', 'spicy'],
      image: 'img2',
      rating: 4.2,
      mealType: ['Lunch'],
    },
  ];

  beforeEach(async () => {
    mockRecipeService = jasmine.createSpyObj('RecipeService', [
      'getAllRecipes',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSharedService = new SharedService();
    platformLocation = { onPopState: (fn: any) => fn() };

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: RecipeService, useValue: mockRecipeService },
        { provide: SharedService, useValue: mockSharedService },
        { provide: Router, useValue: mockRouter },
        { provide: PlatformLocation, useValue: platformLocation },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    mockRecipeService.getAllRecipes.and.returnValue(
      of({ recipes: mockRecipes })
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and categorize recipes on init', () => {
    fixture.detectChanges();
    expect(component.recipeDetails.recipes.length).toBe(2);
    expect(component.recipeByCuisineMap.size).toBe(2);
    expect(component.recipeByCuisineArray.length).toBe(2);
  });

  it('should call prev() and update current index correctly', () => {
    component.recipeByCuisineArray = [['Italian', [mockRecipes[0]]]];
    component.currentIndices = [0];
    component.prev(0);
    expect(component.currentIndices[0]).toBe(0);
  });

  it('should call next() and update current index correctly', () => {
    component.recipeByCuisineArray = [['Italian', [mockRecipes[0]]]];
    component.currentIndices = [0];
    component.next(0);
    expect(component.currentIndices[0]).toBe(0);
  });

  it('should sort cuisines alphabetically', () => {
    component.recipeByCuisineArray = [
      ['Japanese', [mockRecipes[1]]],
      ['Italian', [mockRecipes[0]]],
    ];
    component.sort();
    expect(component.recipeByCuisineArray[0][0]).toBe('Italian');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/'], {
      queryParams: { sort: 'asc' },
    });
  });

  it('should navigate to recipe details when sharedService emits recipe', () => {
    const recipeSubject = new Subject<Recipe>();
    mockSharedService.recipeDetails$ = recipeSubject.asObservable();

    fixture.detectChanges(); // triggers subscription
    recipeSubject.next(mockRecipes[0]);

    expect(component.selectedRecipe).toEqual(mockRecipes[0]);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/'], {
      queryParams: { name: 'Paneer Burger' },
    });
  });

  it('should navigate to home and reset state', () => {
    component.selectedRecipe = mockRecipes[0];
    spyOn(mockSharedService, 'clearRecipeDetails');
    component.navigateToHome();
    expect(component.selectedRecipe).toBeNull();
    expect(mockSharedService.clearRecipeDetails).toHaveBeenCalled();
  });

  it('should get recipe details and navigate when getRecipeDetails is called', () => {
    component.recipeByCuisineArray = [['Italian', [mockRecipes[0]]]];
    component.currentIndices = [0];
    const spy = spyOn(component, 'navigateToRecipeDetails');
    component.getRecipeDetails(['Italian', [mockRecipes[0]]], 0);
    expect(spy).toHaveBeenCalledWith(mockRecipes[0]);
  });
});
