import { useState } from "react";

const LogMealUploader = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

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

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/logmeal/detect`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("LogMeal API Response:", data); // Debugging log

            if (response.ok) {
                setResult(data);
                setError("");
            } else {
                setError(data.error || "Failed to recognize food");
            }
        } catch (err) {
            setError("Error uploading image");
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
                <button className="analyzebutton" type="submit">Analyze Food</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {result && result.recognition_results && result.recognition_results.length > 0 ? (
                <div>
                    <h3>Detected Food:</h3>
                    <p><strong>Best Match:</strong> {result.recognition_results[0]?.name || "Unknown"}</p>
                    <p><strong>Confidence:</strong> {(result.recognition_results[0]?.prob * 100).toFixed(2)}%</p>

                    <h4>Possible Alternatives:</h4>
                    <ul>
                        {result.recognition_results.slice(1, 5).map((food, index) => (
                            <li key={index}>
                                {food.name} - {(food.prob * 100).toFixed(2)}%
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                result && <p>No food detected. Try uploading a different image.</p>
            )}
        </div>
    );
};

export default LogMealUploader;
