import React, { useState } from "react";

export default function UploadProductPage() {
    const [formData, setFormData] = useState({
        id: "4",
        name: "",
        price: "",
        description: "",
        category: "",
        popular: false,
        image: null,
    });

    const [fileName, setFileName] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imagePath = `/img/${file.name}`;
            setFileName(file.name);
            setFormData((prev) => ({ ...prev, image: imagePath }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/menu", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Menu item added to db.json!");
                console.log(await response.json());
            } else {
                alert("Failed to add item.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server error!");
        }
    };

    return (
        <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
            <h2>Upload Product</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input name="name" value={formData.name} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Price:
                    <input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Description:
                    <input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Category:
                    <input
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Popular:
                    <input
                        name="popular"
                        type="checkbox"
                        checked={formData.popular}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Image:
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                </label>
                <br />
                {fileName && (
                    <>
                        <p>Image Path: <code>/img/{fileName}</code></p>
                        <img
                            src={`/img/${fileName}`}
                            alt="preview"
                            style={{ width: "100px" }}
                            onError={(e) => (e.target.style.display = "none")}
                        />
                    </>
                )}
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>


    );
}
