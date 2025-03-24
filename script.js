document.addEventListener("DOMContentLoaded", function () {
    const donateForm = document.getElementById("donate-form");
    const amountInput = document.getElementById("amount");
    const paymentMethod = document.getElementById("payment-method");
    const submitButton = document.getElementById("submit-button");
    const loadingIndicator = document.getElementById("loading");

    donateForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const amount = parseFloat(amountInput.value);
        const method = paymentMethod.value;

        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid donation amount.");
            return;
        }

        submitButton.disabled = true;
        loadingIndicator.style.display = "block";

        switch (method) {
            case "paypal":
                processPayPalDonation(amount);
                break;
            case "stripe":
                processStripeDonation(amount);
                break;
            case "bitcoin":
                processBitcoinDonation(amount);
                break;
            default:
                alert("Invalid payment method.");
                resetForm();
        }
    });

    function processPayPalDonation(amount) {
        window.location.href = `https://www.paypal.com/donate?business=your-paypal-email&amount=${amount}`;
        resetForm();
    }

    function processStripeDonation(amount) {
        fetch("http://localhost:5000/stripe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: amount * 100 })
        })
        .then(response => response.json())
        .then(data => {
            window.location.href = data.checkout_url;
        })
        .catch(error => {
            alert("Payment failed. Please try again.");
            console.error(error);
        })
        .finally(() => resetForm());
    }

    function processBitcoinDonation(amount) {
        fetch("http://localhost:5000/bitcoin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: amount })
        })
        .then(response => response.json())
        .then(data => {
            window.location.href = data.payment_url;
        })
        .catch(error => {
            alert("Bitcoin payment failed. Please try again.");
            console.error(error);
        })
        .finally(() => resetForm());
    }

    function resetForm() {
        submitButton.disabled = false;
        loadingIndicator.style.display = "none";
    }
});
