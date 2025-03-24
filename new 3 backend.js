document.addEventListener('DOMContentLoaded', () => {
    let selectedAmount = 0;

    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedAmount = btn.dataset.amount;
            document.getElementById('custom-amount').value = selectedAmount;
        });
    });

    document.getElementById('custom-amount').addEventListener('input', (e) => {
        selectedAmount = Math.max(0, e.target.value);
    });

    document.getElementById('paypal-btn').addEventListener('click', async () => {
        if (selectedAmount > 0) {
            try {
                const response = await fetch('http://localhost:5000/donate/paypal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: selectedAmount })
                });
                const data = await response.json();
                if (data.id) {
                    window.location.href = `https://www.paypal.com/checkoutnow?token=${data.id}`;
                }
            } catch (error) {
                alert('Error processing PayPal payment');
            }
        } else {
            alert('Please select or enter a donation amount');
        }
    });

    document.getElementById('credit-card-btn').addEventListener('click', async () => {
        if (selectedAmount > 0) {
            try {
                const response = await fetch('http://localhost:5000/donate/stripe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: selectedAmount })
                });
                const data = await response.json();
                if (data.clientSecret) {
                    alert('Proceed with Stripe payment!');
                }
            } catch (error) {
                alert('Error processing Stripe payment');
            }
        } else {
            alert('Please select or enter a donation amount');
        }
    });

    document.getElementById('bitcoin-btn').addEventListener('click', () => {
        const bitcoinAddress = '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2';
        navigator.clipboard.writeText(bitcoinAddress)
            .then(() => alert('Bitcoin address copied to clipboard!'))
            .catch(() => prompt('Copy this Bitcoin address:', bitcoinAddress));
    });
});
