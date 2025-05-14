import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { RecipeService } from 'src/app/services/recipe.service';
import { SharedService } from 'src/app/services/shared.service';
import { Recipe, RecipeDetails } from 'src/common/RecipeDetails';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit {

  showDropDown = true;
  recipeDetails: RecipeDetails | null = null;
  userInput: string = '';
  @ViewChild('dropDownContainer') dropDownRef: ElementRef|null = null;
  @ViewChild('searchInput') searchInputRef: ElementRef|null = null;

  constructor(
    private service: RecipeService,
    private sharedService: SharedService
  ) {}

  ngAfterViewInit(): void {
    fromEvent(this.searchInputRef?.nativeElement,'input').pipe(
      map((event:any)=> event.target.value),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe( value => {
      this.userInput = value;
      this.onSearch(); 
    })
  }

  onSearch(): void {
    this.showDropDown = true;
    this.userInput = this.userInput.trim();
    this.service.searchRecipe(this.userInput).subscribe({
      next: (recipe: RecipeDetails) => {
        this.recipeDetails = recipe;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  selectRecipe(recipe: Recipe): void {
    this.showDropDown = false;
    this.userInput = "";
    this.sharedService.emitRecipeDetails(recipe);
  }

  // Detect click on document
  @HostListener('document:click',['$event'])
  onClickOutside(event:MouseEvent): void {
    if(this.dropDownRef && !this.dropDownRef.nativeElement.contains(event.target)){
      this.showDropDown = false;
    }
  }
}
