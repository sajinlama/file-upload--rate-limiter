import { useState } from "react";
import { BASEURL } from "../env";
import "./App.css";

interface UserData {
  fullname: string;
}

interface AddUserResponse {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    full_name: string;
  };
}

function App() {
  const [fullName, setFullName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingUser(true);

    const credential: UserData = { fullname: fullName };

    try {
      const response = await fetch(`${BASEURL}/addUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential),
      });

      if (!response.ok) throw new Error("Failed to add user");

      const resJson: AddUserResponse = await response.json();
      const newUserId = resJson.data?.user_id;

      if (!newUserId) throw new Error("User ID not found in response.");

      localStorage.setItem("id", String(newUserId));
      setFullName("");
      alert("User created successfully! You can now upload the image.");
    } catch (error) {
      console.error(error);
      alert("Error adding user.");
    } finally {
      setIsSubmittingUser(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    const storedId = localStorage.getItem("id");
    if (!storedId || storedId === "undefined") {
      alert("Please submit a user first to generate a valid ID.");
      return;
    }
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", storedId);

    try {
      const response = await fetch(`${BASEURL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      alert("Image uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Error uploading image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2 className="card-title">User Onboarding</h2>
        <p className="card-subtitle">Create an account and upload your avatar</p>

        {/* User Form */}
        <form className="step-card" onSubmit={handleSubmit}>
          <span className="step-badge">Step 1: Account</span>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="input-text"
              placeholder="e.g. Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmittingUser}
          >
            {isSubmittingUser ? "Submitting..." : "Submit User"}
          </button>
        </form>

        <hr className="divider" />

        {/* Image Upload Form */}
        <form className="step-card" onSubmit={handleUpload}>
          <span className="step-badge">Step 2: Profile Picture</span>
          <div className="form-group">
            <label className="form-label">Select Image</label>
            <label className="file-dropzone" htmlFor="image-input">
              {file ? (
                <span className="file-selected-name">📄 {file.name}</span>
              ) : (
                <>
                  <div style={{ fontSize: "20px" }}>📁</div>
                  <div className="file-dropzone-text">
                    Click to browse or drop an image here
                  </div>
                </>
              )}
            </label>
            <input
              id="image-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={isUploadingImage || !file}
          >
            {isUploadingImage ? "Uploading..." : "Upload Image"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;