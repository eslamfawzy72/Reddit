import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/createCommunityModal.css";

export default function CreateCommunityModal({ isOpen, onClose }) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        commName: "",
        description: "",
        category: "General",
        privacystate: "public",
        image: "",
        rules: [],
    });

    const [ruleInput, setRuleInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const addRule = () => {
        if (!ruleInput.trim()) return;
        setForm((prev) => ({
            ...prev,
            rules: [...prev.rules, ruleInput.trim()],
        }));
        setRuleInput("");
    };

    const removeRule = (index) => {
        setForm((prev) => ({
            ...prev,
            rules: prev.rules.filter((_, i) => i !== index),
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.commName.trim()) {
            setError("Community name is required");
            return;
        }

        if (form.commName.length < 3 || form.commName.length > 21) {
            setError("Community name must be 3–21 characters");
            return;
        }

        try {
            setLoading(true);

            const formData = { ...form };
            if (imageFile) {
                formData.image = imagePreview;
            }

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/communities`,
                formData,
                { withCredentials: true }
            );

            onClose();
            navigate(`/community/${res.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create community");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    ✕
                </button>

                <h1>Create a community</h1>
                <p className="subtitle">
                    A community is a place for people to share and discuss.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* NAME */}
                    <div className="form-group">
                        <label>Community name</label>
                        <span className="prefix">b/</span>
                        <input
                            name="commName"
                            value={form.commName}
                            onChange={handleChange}
                            placeholder="communityname"
                            maxLength={21}
                        />
                        <small>Cannot be changed later</small>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="What is this community about?"
                        />
                    </div>

                    {/* IMAGE */}
                    <div className="form-group">
                        <label>Community image (optional)</label>
                        {imagePreview ? (
                            <div className="image-preview-container">
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                                <button
                                    type="button"
                                    className="remove-image-btn"
                                    onClick={removeImage}
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="file-input"
                            />
                        )}
                    </div>

                    {/* CATEGORY */}
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                        >
                            <option>General</option>
                            <option>Programming</option>
                            <option>Web Development</option>
                            <option>AI & Machine Learning</option>
                            <option>Cybersecurity</option>
                            <option>Gaming</option>
                            <option>Fitness</option>
                            <option>Sport</option>
                            <option>Social</option>
                            <option>Music</option>
                            <option>Movies</option>
                            <option>Science</option>
                            <option>Art</option>
                        </select>
                    </div>

                    {/* PRIVACY */}
                    <div className="form-group">
                        <label>Privacy</label>

                        <div className="radio-group">
                            {["public", "private"].map((type) => (
                                <label key={type}>
                                    <input
                                        type="radio"
                                        name="privacystate"
                                        value={type}
                                        checked={form.privacystate === type}
                                        onChange={handleChange}
                                    />
                                    <div>
                                        <strong>{type}</strong>
                                        <span>
                                            {type === "public" && "Anyone can view & post"}
                                            {type === "private" && "Only approved members can view"}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* RULES */}
                    <div className="form-group">
                        <label>Community rules</label>

                        <div className="rule-input">
                            <input
                                value={ruleInput}
                                onChange={(e) => setRuleInput(e.target.value)}
                                placeholder="Add a rule"
                            />
                            <button type="button" onClick={addRule}>
                                Add
                            </button>
                        </div>

                        <ul className="rules-list">
                            {form.rules.map((rule, i) => (
                                <li key={i}>
                                    {rule}
                                    <span onClick={() => removeRule(i)}>✕</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    {/* ACTIONS */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="create-btn" disabled={loading}>
                            {loading ? "Creating…" : "Create Community"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
