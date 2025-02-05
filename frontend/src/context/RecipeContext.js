import { createContext, useReducer } from 'react'

export const RecipeContext = createContext()

export const recipeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RECIPES': 
      return {
        recipe: action.payload
      }
    case 'CREATE_RECIPES':
      return {
        recipe: [action.payload, ...state.recipe]
      }
    case 'UPDATE_RECIPES':
        return {
          recipe: state.recipe.map((w) => w._id === action.payload._id ? action.payload : w)
        }  
    case 'DELETE_RECIPES':
      return {
        recipe: state.recipe.filter((w) => w._id !== action.payload._id)
      }
    default:
      return state
  }
}

export const RecipeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, {
    recipe: null
  })

  return (
    <RecipeContext.Provider value={{...state, dispatch}}>
      { children }
    </RecipeContext.Provider>
  )
}