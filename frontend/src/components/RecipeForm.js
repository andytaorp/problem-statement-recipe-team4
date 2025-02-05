import { useState } from "react"
import { useRecipeContext } from "../hooks/useRecipeContext"
import { useAuthContext } from '../hooks/useAuthContext'

const RecipeForm = () => {
    const { dispatch } = useRecipeContext()
    const { user } = useAuthContext()

    const [name, setName] = useState('')
    const [ingredients, setIngredients] = useState('')
    const [instructions, setInstructions] = useState('')
    const [time, setTime] = useState('')
    const [level, setLevel] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const recipe = { name, ingredients, instructions,time,level }

        const response = await fetch('/api/workouts', {
            method: 'POST',
            body: JSON.stringify(workout),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if (response.ok) {
            setName('')
            setIngredients('')
            setInstructions('')
            setTime('')
            setLevel('')
            setError(null)
            setEmptyFields([])
            dispatch({ type: 'CREATE_RECIPE', payload: json })
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Recipe</h3>

            <label>Recipe Name:</label>
            <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className={emptyFields.includes('name') ? 'error' : ''}
            />

            <label>Ingredients:</label>
            <input
                type="text"
                onChange={(e) => setIngredients(e.target.value)}
                value={ingredients}
                className={emptyFields.includes('ingredients') ? 'error' : ''}
            />

            <label>Cooking Instructions:</label>
            <input
                type="text"
                onChange={(e) => setInstructions(e.target.value)}
                value={instructions}
                className={emptyFields.includes('instructions') ? 'error' : ''}
            />

            <label>Preparation Time:</label>
            <input
                type="text"
                onChange={(e) => setTime(e.target.value)}
                value={time}
                className={emptyFields.includes('time') ? 'error' : ''}
            />

            <label>Difficulty level:</label>
            <select
                onChange={(e) => setLevel(e.target.value)}
                value={level}
                className={emptyFields.includes('level') ? 'error' : ''}
            >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
            </select>




            <button>Add Recipe</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default RecipeForm