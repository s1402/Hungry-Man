import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeDetailsComponent } from './recipe-details.component';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { Recipe } from 'src/common/RecipeDetails';

describe('RecipeDetailsComponent', () => {
  let component: RecipeDetailsComponent;
  let fixture: ComponentFixture<RecipeDetailsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockPlatformLocation: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockPlatformLocation = {
      onPopState: jasmine.createSpy('onPopState').and.callFake((cb: () => void) => cb())
    };

    await TestBed.configureTestingModule({
      declarations: [RecipeDetailsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: PlatformLocation, useValue: mockPlatformLocation }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedRecipe input correctly', () => {
    const testRecipe: Recipe = {
      id: 1,
      name: 'Pizza',
      ingredients: ['Flour', 'Cheese', 'Tomato'],
      instructions: ['Make dough', 'Add toppings', 'Bake'],
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      servings: 2,
      difficulty: 'Easy',
      cuisine: 'Italian',
      caloriesPerServing: 400,
      tags: ['fast', 'cheesy'],
      image: 'image-url',
      rating: 4.5,
      mealType: ['Dinner'],
    };

    component.selectedRecipe = testRecipe;
    fixture.detectChanges();

    expect(component.selectedRecipe?.name).toBe('Pizza');
  });

  it('should emit goBackEvent when goBack() is called', () => {
    spyOn(component.goBackEvent, 'emit');

    component.goBack();

    expect(component.goBackEvent.emit).toHaveBeenCalled();
  });

  it('should navigate to home on browser back using onPopState', () => {
    // onPopState is called in ngOnInit
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
