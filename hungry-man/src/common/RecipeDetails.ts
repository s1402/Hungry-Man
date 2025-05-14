export interface RecipeDetails {
  recipes : Recipe[]
}

export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags:  string[];
  image: string,
  rating: number;
  mealType: string[];
}