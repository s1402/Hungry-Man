import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RecipeService } from 'src/app/services/recipe.service';
import { SharedService } from 'src/app/services/shared.service';
import { of, throwError } from 'rxjs';
import { RecipeDetails } from 'src/common/RecipeDetails';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockRecipeService: jasmine.SpyObj<RecipeService>;
  let mockSharedService: jasmine.SpyObj<SharedService>;

  const mockRecipeDetails: RecipeDetails = {
    recipes: [
      {
        id: 1,
        name: 'Pizza',
        ingredients: ['Cheese'],
        instructions: ['Bake'],
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        servings: 2,
        difficulty: 'Easy',
        cuisine: 'Italian',
        caloriesPerServing: 300,
        tags: ['quick'],
        image: 'img.jpg',
        rating: 4.2,
        mealType: ['Lunch']
      }
    ]
  };

  beforeEach(async () => {
    mockRecipeService = jasmine.createSpyObj('RecipeService', ['searchRecipe']);
    mockSharedService = jasmine.createSpyObj('SharedService', ['emitRecipeDetails']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: RecipeService, useValue: mockRecipeService },
        { provide: SharedService, useValue: mockSharedService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call search and set recipeDetails on success', () => {
    mockRecipeService.searchRecipe.and.returnValue(of(mockRecipeDetails));
    component.userInput = 'Pizza';
    component.onSearch();
    expect(mockRecipeService.searchRecipe).toHaveBeenCalledWith('Pizza');
    expect(component.recipeDetails).toEqual(mockRecipeDetails);
  });

  it('should handle error during search', () => {
    spyOn(console, 'error');
    mockRecipeService.searchRecipe.and.returnValue(throwError(() => new Error('API Error')));
    component.userInput = 'Pizza';
    component.onSearch();
    expect(console.error).toHaveBeenCalled();
  });

  it('should set selected recipe and emit through shared service', () => {
    const recipe = mockRecipeDetails.recipes[0];
    component.selectRecipe(recipe);
    expect(component.userInput).toBe('');
    expect(component.showDropDown).toBeFalse();
    expect(mockSharedService.emitRecipeDetails).toHaveBeenCalledWith(recipe);
  });

  it('should close dropdown on click outside', () => {
    const fakeElement = document.createElement('div');
    component.dropDownRef = new ElementRef(fakeElement);
    const event = new MouseEvent('click', { bubbles: true });

    spyOn(component.dropDownRef.nativeElement, 'contains').and.returnValue(false);
    component.showDropDown = true;
    component.onClickOutside(event);
    expect(component.showDropDown).toBeFalse();
  });

  it('should not close dropdown if clicked inside', () => {
    const fakeElement = document.createElement('div');
    component.dropDownRef = new ElementRef(fakeElement);
    const event = new MouseEvent('click', { bubbles: true });

    spyOn(component.dropDownRef.nativeElement, 'contains').and.returnValue(true);
    component.showDropDown = true;
    component.onClickOutside(event);
    expect(component.showDropDown).toBeTrue();
  });
});
