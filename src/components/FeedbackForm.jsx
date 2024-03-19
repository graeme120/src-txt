import React, { useState } from "react";

function FeedbackForm() {
  const [input, setInput] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    // 'entry.xxxxxxxx' should match the name attribute of your Google Form input
    formData.append("entry.1165461370", input);

    // Replace 'your-google-form-action-url' with your Google Form action URL
    await fetch(
      "https://docs.google.com/forms/u/1/d/e/1FAIpQLSeZ5Z-N-k24AeI_G6pO4AwLbjkqK3KuWGrrHvgy4aCx5RyUVw/formResponse?embedded=true",
      {
        method: "POST",
        body: formData,
        mode: "no-cors", // This prevents CORS errors
      }
    );

    setInput(""); // Clear the input after submission
    alert("Feedback submitted successfully"); // Feedback to the user
  };

  return (
    <div className="feedbackContainer">
      <h2>What do you think? Would you use this?</h2>
      <p>please let me know your thoughts</p>
      <form onSubmit={handleSubmit}>
        <textarea
          id="feedbackForm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your feedback here"
        />
        <button id="feedbackButton" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;
