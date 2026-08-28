import { useState } from "react";
import { BASEURL } from "../env";

interface UserData {
  fullname: string;
}

function App() {
  const [fullName, setFullname] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const credential: UserData = {
      fullname: fullName,
    };

    try {
      const response = await fetch(`${BASEURL}/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credential),
      });

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      const data = await response.json();

      localStorage.setItem("id", data.user_id);

      setFullname("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Fullname</label>

        <input
          id="name"
          type="text"
          value={fullName}
          onChange={(e) => setFullname(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
    
    </>
  );
}

export default App;
