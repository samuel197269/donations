document.getElementById("chat-button").addEventListener("click", function() {
    let chatContainer = document.getElementById("chat-container");
    chatContainer.style.display = (chatContainer.style.display === "none" || chatContainer.style.display === "") ? "block" : "none";
});

function sendMessage() {
    alert("Message sent! We'll respond shortly.");
}
