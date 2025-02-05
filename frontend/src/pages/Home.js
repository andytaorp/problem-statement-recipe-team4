import { useEffect }from 'react'
import { useRecipeContext } from "../hooks/useRecipeContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import RecipeDetails from '../components/RecipeDetails'
import RecipeForm from '../components/RecipeForm'

const Home = () => {
  const {recipe, dispatch} = useRecipeContext()
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_RECIPES', payload: json})
      }
    }

    if (user) {
        fetchRecipe()
    }
  }, [dispatch, user])

  return (
    <div className="home">
      <div className="recipes">
        {recipe && recipe.map((r) => (
          <RecipeDetails key={r._id} recipe={r} />
        ))}
      </div>
      <RecipeForm />
    </div>
  )
}

export default Home