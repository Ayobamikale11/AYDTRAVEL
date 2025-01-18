const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Route to save booking data
app.post('/save-booking', async (req, res) => {
    const { name, email, serviceType, reference } = req.body;

    if (!name || !email || !serviceType || !reference) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Verify transaction with Paystack
    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer sk_test_fde0c6a0d7a582c82254ab14a5450d0ad96cae33`, // Replace with your Paystack secret key
            },
        });

        const data = response.data;
        if (data.status && data.data.status === 'success') {
            // Payment was successful
            // Save booking data to a database here (e.g., MongoDB, MySQL, etc.)
            console.log('Booking saved:', { name, email, serviceType, reference });

            return res.status(200).json({ message: 'Booking saved successfully!' });
        } else {
            return res.status(400).json({ error: 'Payment verification failed.' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error.message);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
