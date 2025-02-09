import { useState } from "react";

const LogMealUploader = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // ✅ Add loading state

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!image) {
            setError("Please select an image");
            return;
        }

        setLoading(true); // ✅ Show loading state
        setError("");
        setResult(null);

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/logmeal/detect`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("LogMeal API Response:", data);

            if (response.ok && data.recognition && data.recognition.recognition_results.length > 0) {
                setResult(data);
            } else {
                setError("No food detected. Try uploading a different image.");
            }
        } catch (err) {
            setError("Error uploading image");
        } finally {
            setLoading(false); // ✅ Hide loading state
        }
    };

    return (
        <div>
            <h2>Upload Food Image</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {preview && <img src={preview} alt="Uploaded Preview" style={{ width: "200px", marginTop: "10px" }} />}
                <br />
                <br />
                <button type="submit">Analyze Food</button>
            </form>

            {loading && <p>Loading... ⏳</p>} {/* ✅ Show loading state */}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {result && result.recognition && result.recognition.recognition_results.length > 0 && (
                <div>
                    <h3>Detected Food:</h3>
                    <p><strong>Best Match:</strong> {result.recognition.recognition_results[0].name}</p>
                    <p><strong>Confidence:</strong> {(result.recognition.recognition_results[0].prob * 100).toFixed(2)}%</p>

                    <h4>Possible Alternatives:</h4>
                    <ul>
                        {result.recognition.recognition_results.slice(1, 5).map((food, index) => (
                            <li key={index}>
                                {food.name} - {(food.prob * 100).toFixed(2)}%
                            </li>
                        ))}
                    </ul>

                    {result.nutrition && result.nutrition.hasNutritionalInfo && (
                        <div>
                            <h3>Nutritional Information:</h3>
                            <p><strong>Calories:</strong> {result.nutrition.nutritional_info.calories.toFixed(2)} kcal</p>
                            <p><strong>Serving Size:</strong> {result.nutrition.serving_size}g</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LogMealUploader;
