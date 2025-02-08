
import { useState } from 'react'
import { useRecipeContext } from '../hooks/useRecipeContext'
import { useAuthContext } from '../hooks/useAuthContext'
// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
const RecipeDetails = ({ recipe }) => {
  const { dispatch } = useRecipeContext()
  const { user } = useAuthContext()
  //state for editing
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(recipe.name)
  const [editIngredients, setEditIngredients] = useState(recipe.ingredients)
  const [editInstructions, setEditInstructions] = useState(recipe.instructions)
  const [editPrepTime, setEditPrepTime] = useState(recipe.prepTime)
  const [editDifficulty, setEditDifficulty] = useState(recipe.difficulty)
  const handleClick = async () => {
    if (!user) {
      return
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()
    if (response.ok) {
      dispatch({ type: 'DELETE_RECIPE', payload: json })
    }
  }
  //=================================
  //=================================
  const handleUpdate = async () => {
    console.log('Payload:', {
      name: editName,
      ingredients: editIngredients,
      instructions: editInstructions,
      prepTime: editPrepTime,
      difficulty: editDifficulty
    });
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({
        name: editName,
        ingredients: editIngredients,
        instructions: editInstructions,
        prepTime: editPrepTime,
        difficulty: editDifficulty
      }),
    })
    const json = await response.json()
    console.log('Updated Recipe:', json); // Log the response to verify

    if (response.ok) {
      dispatch({ type: 'UPDATE_RECIPE', payload: json }); // ✅ Fix the action type
      console.log('Dispatched UPDATE_RECIPE:', json);
      setIsEditing(false); // Exit edit mode
    } else {
      console.error('Failed to update recipe:', json.error);
    } 
  }
  return (
    <div className="recipe-details">
      {isEditing ? (
        <div>
          <p>Recipe Name:</p>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Recipe Name"
          />
          <p>Ingredients:</p>
          <input
            type="text"
            value={editIngredients}
            onChange={(e) => setEditIngredients(e.target.value)}
            placeholder="Ingredients"
          />
          <p>Cooking Instructions:</p>
          <input
            type="text"
            value={editInstructions}
            onChange={(e) => setEditInstructions(e.target.value)}
            placeholder="Instructions"
          />
          <p>Preparation Time:</p>
          <input
            type="text"
            value={editPrepTime}
            onChange={(e) => setEditPrepTime(e.target.value)}
            placeholder="Prep Time"
          />
          <p>Difficulty Level:</p>
          <select
            onChange={(e) => setEditDifficulty(e.target.value)}
            value={editDifficulty}
          >
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>  {/* Change value to lowercase */}
            <option value="medium">Medium</option>  {/* Change value to lowercase */}
            <option value="hard">Hard</option>  {/* Change value to lowercase */}
          </select>
          <button onClick={handleUpdate} className="savebutton">Save</button>
          <button onClick={() => setIsEditing(false)} className="cancelbutton">Cancel</button>
        </div>
      ): (
        <div>
          <h4>{recipe.name}</h4>
          <p><strong>Ingredients: </strong>{recipe.ingredients}</p>
          <p><strong>Cooking Instructions: </strong>{recipe.instructions}</p>
          <p><strong>Preparation Time: </strong>{recipe.prepTime}</p>
          <p><strong>Difficulty level: </strong>{recipe.difficulty}</p>
          <p>{formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}</p>
          <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
          <button onClick={() => setIsEditing(true)} className="editbutton">Edit</button>
        </div>
      )}
    </div>
  )
}
export default RecipeDetails
