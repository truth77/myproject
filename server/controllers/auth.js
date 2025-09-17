const { insertUser, queryUser, updateUserRole, findUserByEmail } = require('../models/auth');
const { comparePass, encodeToken } = require('../auth/utils');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { verifyAndUpdateUserRole } = require('../services/subscriptionService');

exports.createUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        // Validate required fields
        if (!username || !password || !email) {
            return res.status(400).json({
                status: 'error',
                message: 'Username, email, and password are required',
            });
        }

        // Create user with default 'user' role
        const user = await insertUser(username, password, email);
        const token = encodeToken({
            id: user[0].id,
            username: user[0].username,
            email: user[0].email,
            role: user[0].role || 'user',
            avatar: user[0].avatar
        });

        // Return success response with token and user data
        return res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user[0].id,
                username: user[0].username,
                email: user[0].email,
                role: user[0].role || 'user',
                avatar: user[0].avatar
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        if (err.code === "23505") {
            return res.status(400).json({
                status: 'error',
                message: 'Username or email already exists',
            });
        }
        return res.status(500).json({
            status: 'error',
            message: 'An error occurred during registration',
        });
    }
};

exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        try {
            // Get the customer email from the session
            const customerEmail = session.customer_email || session.customer_details?.email;
            
            if (!customerEmail) {
                console.error('No customer email found in session:', session.id);
                return res.status(400).json({ error: 'No customer email found' });
            }

            // Find the user by email
            const user = await findUserByEmail(customerEmail);
            
            if (!user) {
                console.error('User not found with email:', customerEmail);
                return res.status(404).json({ error: 'User not found' });
            }

            // Update user role to 'subscriber'
            await updateUserRole(user.id, 'subscriber');
            console.log(`User ${user.id} upgraded to subscriber`);
            
        } catch (err) {
            console.error('Error processing webhook:', err);
            return res.status(500).json({ error: 'Error processing webhook' });
        }
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
};

exports.logUserIn = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await queryUser(username);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'User not found',
            });
        }

        const arePasswordsEqual = comparePass(password, user.password);

        if (arePasswordsEqual) {
            // Verify and update user role based on subscription status
            const updatedUser = await verifyAndUpdateUserRole(user);
            
            const token = encodeToken({
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role || 'user',
                avatar: updatedUser.avatar
            });
            
            return res.status(200).json({
                status: 'success',
                token,
                user: {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role || 'user',
                    avatar: updatedUser.avatar
                }
            });
        } else {
            return res.status(401).json({
                status: 'error',
                message: 'Incorrect password',
            });
        }
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
            status: 'error',
            message: 'An error occurred during login',
        });
    }
};

exports.loginFacebook = (req, res) => {
    const { username, id, avatar } = req.user;

    try {
        const token = encodeToken({
            username,
            id,
            avatar,
        });

        res.status(200).json({
            status: 'success',
            token,
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err,
        });
    }
};