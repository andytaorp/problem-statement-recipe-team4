import { createContext, useReducer } from 'react';

export const RecipeContext = createContext();

export const recipeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RECIPES': 
      return {
        recipes: action.payload // ✅ Use "recipes" instead of "recipe"
      };
    case 'CREATE_RECIPE': // ✅ Fix action type
      return {
        recipes: [action.payload, ...state.recipes] // ✅ Use "recipes"
      };
    case 'UPDATE_RECIPE':
      return {
        recipes: state.recipes.map((r) => 
          r._id === action.payload._id ? action.payload : r
        )
      };  
    case 'DELETE_RECIPE':
      return {
        recipes: state.recipes.filter((r) => r._id !== action.payload._id)
      };
    default:
      return state;
  }
};

export const RecipeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, {
    recipes: [] // ✅ Use array instead of null
  });

  return (
    <RecipeContext.Provider value={{ ...state, dispatch }}>
      { children }
    </RecipeContext.Provider>
  );
};
