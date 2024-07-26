const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

// Connection string
const connectionString = 'postgresql://techsahay_owner:8tNq6eoKlRgU@ep-holy-forest-a1yik5ox.ap-southeast-1.aws.neon.tech/techsahay?sslmode=require';

// Create a new PostgreSQL client with the connection string
const client = new Pool({
    connectionString: connectionString
});

// Connect to the PostgreSQL server
client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
    })
    .catch((err) => {
        console.error('Error connecting to PostgreSQL:', err);
    });

app.get('/', (req, res) => {
    res.send('Backend Started!');
});


// Endpoint for user signup
app.post('/signup', (req, res) => {
    const username = req.body.UserName;
    const mobile_number = req.body.Mobile;
    const email = req.body.Email;
    const password = req.body.Password;
    // Perform signup query
    client.query('INSERT INTO donors (username, mobile_number, email, password) VALUES ($1, $2, $3, $4) RETURNING id', [username, mobile_number, email, password])
        .then((result) => {
            const userId = result.rows[0].id;
            // User signed up successfully
            res.status(201).json({ message: 'Signup successful', userId: userId });
        })
        .catch((err) => {
            // Handling unique constraint violation
            if (err.code === '23505') {
                // You can also check err.constraint to determine which unique constraint was violated
                // if you have more than one unique constraints and want to provide different messages
                res.status(409).json({ message: 'An account with this email already exists.' });
            } else {
                console.error('Error executing signup query:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
});

app.post('/rsignup', (req, res) => {
    const username = req.body.UserName;
    const mobile_number = req.body.Mobile;
    const email = req.body.Email;
    const password = req.body.Password;

    client.query('INSERT INTO recipient (username, mobile_number, email, password) VALUES ($1, $2, $3, $4) RETURNING id', [username, mobile_number, email, password])
        .then((result) => {
            const userId = result.rows[0].id;
            res.status(201).json({ message: 'Signup successful', userId: userId });
        })
        .catch((err) => {
            // Handling unique constraint violation
            if (err.code === '23505') {
                // You can also check err.constraint to determine which unique constraint was violated
                // if you have more than one unique constraints and want to provide different messages
                res.status(409).json({ message: 'An account with this email already exists.' });
            } else {
                console.error('Error executing signup query:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
});

//Sign process
// Endpoint for user login
app.post('/login', (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;

    // Perform login query
    client.query('SELECT id FROM donors WHERE email = $1 AND password = $2', [email, password])
        .then((result) => {
            if (result.rows.length > 0) {
                // User authenticated successfully
                const userId = result.rows[0].id;
                res.json({ status: "Success", userId: userId });
            } else {
                // Invalid credentials
                return res.json('Invalid email or password');
            }
        })
        .catch((err) => {
            console.error('Error executing login query:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
});
app.post('/rlogin', (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;

    // Perform login query
    client.query('SELECT id FROM recipient WHERE email = $1 AND password = $2', [email, password])
        .then((result) => {
            if (result.rows.length > 0) {
                // User authenticated successfully
                const userId = result.rows[0].id;
                res.json({ status: "Success", userId: userId });
            } else {
                // Invalid credentials
                return res.json('Invalid email or password');
            }
        })
        .catch((err) => {
            console.error('Error executing login query:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

app.post('/dp', (req, res) => {
    const id = req.body.userId
    client.query('SELECT * FROM donors WHERE id = $1', [id])
        .then((result) => {
            if (result.rows.length > 0) {
                const user = result.rows[0];
                // Ensure that data sent is a string, not an object
                res.json({
                    name: user.username, // Ensure 'username' is a string
                    email: user.email, // Ensure 'email' is a string
                    phone: user.mobile_number, // Ensure 'mobile_number' is a string
                    address: user.address || '' // Ensure 'address' is a string
                });
            } else {
                res.status(404).send({ message: "User not found" });
            }
        })
        .catch((err) => {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

app.post('/rp', (req, res) => {
    const id = req.body.userId
    client.query('SELECT * FROM recipient WHERE id = $1', [id])
        .then((result) => {
            if (result.rows.length > 0) {
                const user = result.rows[0];
                // Ensure that data sent is a string, not an object
                res.json({
                    name: user.username, // Ensure 'username' is a string
                    email: user.email, // Ensure 'email' is a string
                    phone: user.mobile_number, // Ensure 'mobile_number' is a string
                    address: user.address || '' // Ensure 'address' is a string
                });
            } else {
                res.status(404).send({ message: "User not found" });
            }
        })
        .catch((err) => {
            console.error('Error executing query:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

app.put('/update-profile', (req, res) => {
    const id = req.body.id;
    const username = req.body.UserName;
    const mobile_number = req.body.Mobile;
    const email = req.body.Email;
    const address = req.body.Address;
    console.log("Received update request:", req.body);
    // Update user data in the database
    const updateQuery = `
        UPDATE donors
        SET username = $1, mobile_number = $2, email = $3, address = $4
        WHERE id = $5
        RETURNING *;
    `;

    client.query(updateQuery, [username, mobile_number, email, address, id])
        .then((result) => {
            if (result.rows.length > 0) {
                const updatedUser = result.rows[0];
                res.json({
                    message: "Profile updated successfully",
                    user: {
                        id: updatedUser.id,
                        UserName: updatedUser.username,
                        Mobile: updatedUser.mobile_number,
                        Email: updatedUser.email,
                        Address: updatedUser.address
                    }
                });
            } else {
                res.status(404).send({ message: "User not found" });
            }
        })
        .catch((err) => {
            console.error('Error updating profile:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
});


app.put('/update-rprofile', (req, res) => {
    const id = req.body.id;
    const username = req.body.UserName;
    const mobile_number = req.body.Mobile;
    const email = req.body.Email;
    const address = req.body.Address;
    console.log("Received update request:", req.body);
    // Update user data in the database
    const updateQuery = `
        UPDATE recipient
        SET username = $1, mobile_number = $2, email = $3, address = $4
        WHERE id = $5
        RETURNING *;
    `;

    client.query(updateQuery, [username, mobile_number, email, address, id])
        .then((result) => {
            if (result.rows.length > 0) {
                const updatedUser = result.rows[0];
                res.json({
                    message: "Profile updated successfully",
                    user: {
                        id: updatedUser.id,
                        UserName: updatedUser.username,
                        Mobile: updatedUser.mobile_number,
                        Email: updatedUser.email,
                        Address: updatedUser.address
                    }
                });
            } else {
                res.status(404).send({ message: "User not found" });
            }
        })
        .catch((err) => {
            console.error('Error updating profile:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
});


app.post('/donate', (req, res) => {
    const { donorId, gadgetName, gadgetType, imeiNo, description } = req.body;

    const insertQuery = `
        INSERT INTO received (donorid, gadgetname, gadgetype, imei, description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    try {
        client.query(insertQuery, [donorId, gadgetName, gadgetType, imeiNo, description])
            .then((response) => {
                res.status(201).json('Donation successfully recorded');
            });
    } catch (error) {
        console.error('Error executing donation insert query:', error);
        res.status(500).json({ message: 'Internal server error while donating gadget' });
    }
});

// Endpoint to fetch received gadgets
app.get('/data/receiving', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM received');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to fetch donated gadgets
app.get('/data/giving', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM donated');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


app.delete('/cancel-received/:gadgetid', async (req, res) => {
    const gadgetid = req.params.gadgetid;

    try {
        const result = await client.query('DELETE FROM received WHERE id = $1 RETURNING *', [gadgetid]);
        if (result.rows.length > 0) {
            res.json({ message: "Gadget cancelled successfully", gadget: result.rows[0] });
        } else {
            res.status(404).json({ message: "Gadget not found" });
        }
    } catch (err) {
        console.error('Error executing delete query:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.delete('/cancel-donation/:gadgetid', async (req, res) => {
    const gadgetid = req.params.gadgetid;
    try {
        await client.query('BEGIN');
        const fetchGadget = await client.query('SELECT * FROM donated WHERE id = $1', [gadgetid]);
        if (fetchGadget.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Gadget not found in donated" });
        }
        const { donorid, gadgetname, gadgetype, imei, description } = fetchGadget.rows[0];
        const insertGadget = 'INSERT INTO gadgetlist (donorid, gadgetname, gadgetype, imei, description) VALUES ($1, $2, $3, $4, $5)';
        await client.query(insertGadget, [donorid, gadgetname, gadgetype, imei, description]);
        await client.query('DELETE FROM donated WHERE id = $1', [gadgetid]);
        await client.query('COMMIT');
        res.json({ message: "Donation cancelled and gadget moved to gadgets table successfully" });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error executing transaction:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});


app.post('/dlogin', async (req, res) => {
    const { id, password } = req.body;

    try {
        const query = 'SELECT * FROM dlogin WHERE id = $1';
        const { rows } = await client.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = rows[0];
        if (password === user.password) {
            res.status(200).json({ message: "Login successful", userId: user.id });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error('Database error', error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.post('/confirm-receive', async (req, res) => {
    const { id } = req.body; // ID of the gadget in 'received' table
    try {
        // Begin transaction
        await client.query('BEGIN');

        // Fetch gadget from 'received'
        const fetchQuery = 'SELECT * FROM received WHERE id = $1';
        const fetchResult = await client.query(fetchQuery, [id]);
        if (fetchResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Gadget not found in received" });
        }

        const gadget = fetchResult.rows[0];

        // Insert gadget into 'gadgets'
        const insertQuery = 'INSERT INTO gadgetlist (donorid, gadgetname, gadgetype, imei, description) VALUES ($1, $2, $3, $4, $5)';
        await client.query(insertQuery, [gadget.donorid, gadget.gadgetname, gadget.gadgetype, gadget.imei, gadget.description]);
        const insert1Query = 'INSERT INTO donatedhistory (id,donorid, gadgetname, gadgetype, imei, description) VALUES ($1, $2, $3, $4, $5, $6)';
        await client.query(insert1Query, [id, gadget.donorid, gadget.gadgetname, gadget.gadgetype, gadget.imei, gadget.description]);

        // Delete gadget from 'received'
        const deleteQuery = 'DELETE FROM received WHERE id = $1';
        await client.query(deleteQuery, [id]);

        // Commit transaction
        await client.query('COMMIT');

        res.status(200).json({ message: 'Gadget successfully confirmed and moved to gadgets' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Failed to confirm receive:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Confirm giving a gadget
app.post('/confirm-give', async (req, res) => {
    const { id } = req.body; // ID of the gadget in 'donated' table
    try {
        const fetchQuery = 'SELECT * FROM donated WHERE id = $1';
        const fetchResult = await client.query(fetchQuery, [id]);
        if (fetchResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Gadget not found in donated" });
        }

        const gadget = fetchResult.rows[0];
        const insert1Query = 'INSERT INTO receivedhistory (id,recipientid , gadgetname, gadgetype, imei, description) VALUES ($1, $2, $3, $4, $5, $6)';
        await client.query(insert1Query, [id, gadget.receiverid, gadget.gadgetname, gadget.gadgetype, gadget.imei, gadget.description]);
        // Delete gadget from 'donated'
        const deleteQuery = 'DELETE FROM donated WHERE id = $1';
        const result = await client.query(deleteQuery, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Gadget not found in donated" });
        }

        res.status(200).json({ message: 'Gadget successfully removed from donated' });
    } catch (error) {
        console.error('Failed to confirm give:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/gadgetlist', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM gadgetlist');
        res.json(result.rows); // Send the rows back to the client
    } catch (error) {
        console.error('Failed to fetch devices:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/receive-gadget', async (req, res) => {
    const { id, recipientId } = req.body; // assuming recipientId is also sent from frontend
    try {
        await client.query('BEGIN');
        const fetchQuery = 'SELECT * FROM gadgetlist WHERE id = $1';
        const gadget = await client.query(fetchQuery, [id]);
        if (gadget.rows.length === 0) {
            return res.status(404).json({ message: 'Gadget not found' });
        }
        const gadgetData = gadget.rows[0];
        const insertQuery = 'INSERT INTO donated (donorid, gadgetname, gadgetype, imei, description, receiverid) VALUES ($1, $2, $3, $4, $5, $6)';
        await client.query(insertQuery, [gadgetData.donorid, gadgetData.gadgetname, gadgetData.gadgetype, gadgetData.imei, gadgetData.description, recipientId]);
        const deleteQuery = 'DELETE FROM gadgetlist WHERE id = $1';
        await client.query(deleteQuery, [id]);
        await client.query('COMMIT');
        res.json({ message: 'Gadget received successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Failed to receive gadget:', error);
        res.status(500).json({ message: 'Failed to process the transaction' });
    }
});

app.get('/api/gadgets/:donorid', async (req, res) => {
    const { donorid } = req.params;
    try {
        const receivedGadgets = await client.query('SELECT *, \'received\' as source FROM received WHERE donorid = $1', [donorid]);
        console.log('Received Gadgets:', receivedGadgets.rows);
        const donatedGadgets = await client.query('SELECT *, \'donated\' as source FROM donatedhistory WHERE donorid = $1', [donorid]);
        console.log('Donated Gadgets:', donatedGadgets.rows);

        const gadgets = [
            ...donatedGadgets.rows,
            ...receivedGadgets.rows
        ];
        res.json(gadgets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/gadgets/donated/:recipientId', async (req, res) => {
    const recipientId = req.params.recipientId;
    try {
        const query = 'SELECT * FROM donated WHERE receiverid = $1';
        const result = await client.query(query, [recipientId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Failed to fetch gadgets:', err);
        res.status(500).send('Failed to retrieve data');
    }
});

// Fetch gadgets by recipientId from "received_history" table
app.get('/api/gadgets/receivedhistory/:recipientId', async (req, res) => {
    const recipientId = req.params.recipientId;
    try {
        const query = 'SELECT * FROM receivedhistory WHERE recipientid = $1';
        const result = await client.query(query, [recipientId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Failed to fetch received history gadgets:', err);
        res.status(500).send('Failed to retrieve data');
    }
});

app.post('/dlogin', async (req, res) => {
    const { id, password } = req.body;

    try {
        const query = 'SELECT * FROM dlogin WHERE id = $1';
        const { rows } = await client.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = rows[0];
        if (password === user.password) {
            res.status(200).json({ message: "Login successful", userId: user.id });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error('Database error', error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Start the Express server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
