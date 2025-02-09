import { useState } from "react";

const LogMealUploader = () => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleImageUpload = (event) => {
        setImage(event.target.files[0]);
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
            const response = await fetch("http://localhost:4000/api/logmeal/detect", {
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
                <button type="submit">Analyze Food</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {result && (
                <div>
                    <h3>Detected Food</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default LogMealUploader;
