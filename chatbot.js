const API_KEY = "AIzaSyAVmYGV1IH19m8-RBTbb-S6iZFV7cV7wXY"; // Replace with your Gemini API Key
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const userInput2 = document.getElementById("user-input2"); // image
const botAvatar = document.getElementById("bot-avatar"); // bot avatar element
const closeButton = document.querySelector(".close-btn"); // close button in the chat window
const chatContainer = document.querySelector(".chat-container"); // chatbot container

// Open the chat when the bot avatar is clicked
botAvatar.addEventListener("click", function () {
    chatContainer.style.display = "flex"; // Show chat container
    botAvatar.style.display = "none"; // Hide the bot avatar when the chat is open
});

// Close the chat when the close button is clicked
closeButton.addEventListener("click", function () {
    chatContainer.style.display = "none"; // Hide the chat container
    botAvatar.style.display = "block"; // Show the bot avatar again
});

// Function to send a message
async function sendMessage() {
    let message = userInput.value.trim();
    if (message === "") return;

    appendMessage("user", message);
    userInput.value = "";
    sendButton.disabled = true; // Disable button while fetching response

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        console.log("Gemini API Response:", data);

        if (data.candidates && data.candidates.length > 0) {
            let botResponse = data.candidates[0].content.parts[0].text;
            appendMessage("bot", botResponse);
        } else {
            appendMessage("bot", "I'm not sure how to respond to that.");
        }
    } catch (error) {
        console.error("Error:", error);
        appendMessage("bot", "Error connecting to API.");
    } finally {
        sendButton.disabled = false;
    }
}

// Function to append messages in the chat box
function appendMessage(role, text, image) {
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", role);
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the chat
}

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") sendMessage();
});
