import { useState } from "react";

const LogMealUploader = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null); // Store preview URL
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Generate a preview URL
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
                <br></br>
                <br></br>
                <button type="submit">Analyze Food</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {result && (
                <div>
                    <h3>Detected Food:</h3>
                    <p><strong>Best Match:</strong> {result.recognition_results[0].name}</p>
                    <p><strong>Confidence:</strong> {(result.recognition_results[0].prob * 100).toFixed(2)}%</p>

                    <h4>Possible Alternatives:</h4>
                    <ul>
                        {result.recognition_results.slice(1, 5).map((food, index) => (
                            <li key={index}>
                                {food.name} - {(food.prob * 100).toFixed(2)}%
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LogMealUploader;
