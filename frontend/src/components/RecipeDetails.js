import { useRecipeContext } from '../hooks/useRecipeContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const RecipeDetails = ({ recipe }) => {
  const { dispatch } = useRecipeContext()
  const { user } = useAuthContext()

  const handleClick = async () => {
    if (!user) {
      return
    }

    const response = await fetch('/api/recipes/' + recipe._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_RECIPE', payload: json})
    }
  }

  return (
    <div className="recipe-details">
      <h4>{recipe.name}</h4>
      <p><strong>Ingredients: </strong>{recipe.ingredients}</p>
      <p><strong>Cooking Instructions: </strong>{recipe.instructions}</p>
      <p><strong>Preparation Time: </strong>{recipe.time}</p>
      <p><strong>Difficulty level: </strong>{recipe.level}</p>
      <p>{formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}</p>
      <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
    </div>
  )
}

export default RecipeDetails