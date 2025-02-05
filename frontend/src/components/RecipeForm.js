import { useState } from "react"
import { useRecipeContext } from "../hooks/useRecipeContext"
import { useAuthContext } from '../hooks/useAuthContext'

const RecipeForm = () => {
    const { dispatch } = useRecipeContext()
    const { user } = useAuthContext()

    const [name, setName] = useState('')
    const [ingredients, setIngredients] = useState('')
    const [instructions, setInstructions] = useState('')
    const [prepTime, setPrepTime] = useState('')
    const [difficulty, setDifficulty] = useState('')
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("You must be logged in");
            return;
        }

        const recipe = { name, ingredients, instructions, prepTime, difficulty };

<<<<<<< HEAD
        const response = await fetch('${process.env.REACT_APP_API_URL}/api/recipes', {
            method: 'POST',
=======
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {
            method: "POST",
>>>>>>> 5d52e356a7c7ebffe7574d47c2903a2978a999c8
            body: JSON.stringify(recipe),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        });

        const json = await response.json();
        console.log(json); // 🔥 Log the response from backend

        if (!response.ok) {
            console.log("Error from backend:", json); // Log the error for debugging
            console.log("Empty fields:", json.emptyFields); // 🔍 Log empty fields
            setError(json.error);
            setEmptyFields(json.emptyFields || []); // Ensure it's an array
        }

        if (response.ok) {
            setName("");
            setIngredients("");
            setInstructions("");
            setPrepTime("");
            setDifficulty("");
            setError(null);
            setEmptyFields([]);
            dispatch({ type: "CREATE_RECIPE", payload: json });
        }
        console.log("Dispatching new recipe:", json);
        dispatch({ type: "CREATE_RECIPE", payload: json });
    };

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
                onChange={(e) => setPrepTime(e.target.value)}
                value={prepTime}
                className={emptyFields.includes('time') ? 'error' : ''}
            />

            <label>Difficulty level:</label>
            <select
                onChange={(e) => setDifficulty(e.target.value)}
                value={difficulty}
                className={emptyFields.includes('difficulty') ? 'error' : ''}
            >
                <option value="">Select difficulty</option>
                <option value="easy">Easy</option>  {/* Change value to lowercase */}
                <option value="medium">Medium</option>  {/* Change value to lowercase */}
                <option value="hard">Hard</option>  {/* Change value to lowercase */}
            </select>




            <button>Add Recipe</button>
            {error && <div className="error">{error}</div>}

        </form>
    )
}

export default RecipeForm