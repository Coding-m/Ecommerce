import React, { useState } from "react";

function VisualSearch() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:5000/visual-search/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResults(data.results);
  };

  return (
    <div>
      <h2>Visual Search</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Search</button>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {results.map((r) => (
          <div key={r.image_name} style={{ margin: "10px" }}>
            <img
              src={`http://localhost:8080/images/${r.image_name}`} // Serve this from Spring Boot
              alt={r.image_name}
              width="100"
            />
            <p>Match: {r.score.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VisualSearch;
