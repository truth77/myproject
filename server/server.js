// Start memory monitoring in development
if (process.env.NODE_ENV === 'development') {
  require('./memory-monitor');
}

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const app = express();

// Database connection
require('./db');

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://127.0.0.1:3002'
    ];
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      console.warn(msg);
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: true
};

// Apply CORS with the specified options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Import routes
const authRoutes = require('./routes/auth');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const subscriptionRoutes = require('./routes/subscriptions');
const paymentRoutes = require('./routes/payments');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);

// Import database connection
const db = require('./db');

// Helper function to test database connection
async function testDbConnection() {
  try {
    await db.raw('SELECT 1');
    return { connected: true };
  } catch (error) {
    console.error('Database connection error:', error);
    return { 
      connected: false, 
      error: error.message,
      connectionInfo: {
        client: db.client.config.client,
        connection: {
          host: db.client.config.connection.host,
          port: db.client.config.connection.port,
          database: db.client.config.connection.database,
          user: db.client.config.connection.user
        }
      }
    };
  }
}

// API Documentation with HTML formatting
app.get('/', async (req, res) => {
  let users = [];
  let databaseTables = [];
  let dbStatus = await testDbConnection();
  
  if (!dbStatus.connected) {
    console.error('Database connection failed:', dbStatus.error);
    users = [{ error: `Database connection failed: ${dbStatus.error}` }];
    databaseTables = ['Cannot connect to database'];
  } else {
    try {
      // Check if users table exists
      const tableExists = await db.schema.hasTable('users');
      
      if (tableExists) {
        // Get all users with all fields (except sensitive ones)
        users = await db('users')
          .select('*')
          .orderBy('created_at', 'desc')
          .catch(err => {
            console.error('Error fetching users:', err);
            return [{ error: `Error fetching users: ${err.message}` }];
          });
      } else {
        users = [{ notice: 'Users table does not exist' }];
      }
      
      // Get list of all tables in the database
      try {
        const result = await db.raw(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
          ORDER BY table_name;
        `);
        databaseTables = result.rows.map(row => row.table_name);
      } catch (err) {
        console.error('Error fetching table list:', err);
        databaseTables = [`Error loading table list: ${err.message}`];
      }
      
    } catch (error) {
      console.error('Unexpected error:', error);
      users = [{ error: `Unexpected error: ${error.message}` }];
      databaseTables = ['Error checking database'];
    }
  }
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Bible App API Reference</title>
    <style>
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        line-height: 1.6;
        max-width: 900px;
        margin: 0 auto;
        padding: 20px;
        color: #333;
      }
      h1 { 
        color: #2c3e50;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
      }
      h2 { 
        color: #3498db;
        margin-top: 30px;
        border-left: 4px solid #3498db;
        padding-left: 10px;
      }
      .endpoint { 
        background: #f8f9fa;
        border-left: 4px solid #3498db;
        padding: 15px;
        margin: 15px 0;
        border-radius: 0 4px 4px 0;
      }
      .method { 
        display: inline-block;
        padding: 3px 8px;
        border-radius: 3px;
        font-weight: bold;
        font-size: 0.8em;
        margin-right: 10px;
        color: white;
      }
      .get { background: #2ecc71; }
      .post { background: #3498db; }
      .put { background: #f39c12; }
      .delete { background: #e74c3c; }
      .path { 
        font-family: monospace;
        font-size: 1.1em;
        font-weight: bold;
      }
      .description { 
        margin: 8px 0 0 28px;
        color: #555;
      }
      .access { 
        display: inline-block;
        background: #ecf0f1;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 0.8em;
        margin-top: 8px;
        color: #7f8c8d;
      }
      .private { border-left-color: #e74c3c; }
      .body-params {
        margin: 8px 0 0 28px;
        font-family: monospace;
        color: #8e44ad;
      }
      .note {
        background: #f8f9fa;
        border: 1px solid #ddd;
        padding: 15px;
        border-radius: 4px;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <h1>Bible App API Reference</h1>
    <p>Welcome to the Bible App API documentation. Below you'll find all available endpoints and how to use them.</p>
    
    <h2>🔑 Authentication</h2>
    
    <div class="endpoint">
      <span class="method post">POST</span>
      <span class="path">/api/auth/login</span>
      <div class="description">Authenticate a user with email and password</div>
      <div class="body-params">Body: { email: 'string', password: 'string' }</div>
      <span class="access">Public</span>
    </div>
    
    <div class="endpoint">
      <span class="method post">POST</span>
      <span class="path">/api/auth/register</span>
      <div class="description">Create a new user account</div>
      <div class="body-params">Body: { username: 'string', email: 'string', password: 'string' }</div>
      <span class="access">Public</span>
    </div>
    
    <div class="endpoint">
      <span class="method get">GET</span>
      <span class="path">/api/auth/me</span>
      <div class="description">Get current user's profile information</div>
      <span class="access">Requires JWT</span>
    </div>
    
    <div class="endpoint">
      <span class="method post">POST</span>
      <span class="path">/api/auth/logout</span>
      <div class="description">Invalidate the current user's session</div>
      <span class="access">Requires JWT</span>
    </div>
    
    <h2>💳 Subscriptions</h2>
    
    <div class="endpoint">
      <span class="method get">GET</span>
      <span class="path">/api/subscriptions/plans</span>
      <div class="description">Get available subscription plans and pricing</div>
      <span class="access">Public</span>
    </div>
    
    <div class="endpoint">
      <span class="method post">POST</span>
      <span class="path">/api/subscriptions/subscribe</span>
      <div class="description">Create a new subscription or process a one-time payment</div>
      <div class="body-params">Body: { priceId: 'string', isSubscription: boolean }</div>
      <span class="access">Requires JWT</span>
    </div>
    
    <div class="endpoint">
      <span class="method get">GET</span>
      <span class="path">/api/subscriptions/status</span>
      <div class="description">Get the current user's subscription status and details</div>
      <span class="access">Requires JWT</span>
    </div>
    
    <div class="endpoint">
      <span class="method post">POST</span>
      <span class="path">/api/subscriptions/portal</span>
      <div class="description">Create a Stripe Customer Portal session for subscription management</div>
      <span class="access">Requires Active Subscription</span>
    </div>
    
    <div class="endpoint">
      <span class="method post">POST</span>
      <span class="path">/api/subscriptions/webhook</span>
      <div class="description">Stripe webhook endpoint for handling payment events</div>
      <span class="access">Stripe Only</span>
    </div>
    
    <h2>⭐ Premium Content</h2>
    
    <div class="endpoint">
      <span class="method get">GET</span>
      <span class="path">/api/premium/content</span>
      <div class="description">Access premium content (requires active subscription)</div>
      <span class="access">Requires Active Subscription</span>
    </div>
    
    <div class="endpoint">
      <span class="method get">GET</span>
      <span class="path">/api/premium/features</span>
      <div class="description">List all premium features available</div>
      <span class="access">Public</span>
    </div>
    
    <h2>⚙️ System</h2>
    
    <div class="endpoint">
      <span class="method get">GET</span>
      <span class="path">/health</span>
      <div class="description">Basic health check endpoint</div>
      <span class="access">Public</span>
    </div>
    
    <div class="endpoint">
      <span class="method get">GET</span>
      <span class="path">/api/health</span>
      <div class="description">Detailed API health check</div>
      <span class="access">Public</span>
    </div>
    
    <h2>👥 Users (${users.length} total)</h2>
    <p>Showing all available user fields from the database. Hover over table cells to see the full content.</p>
    <div style="overflow-x: auto; max-height: 500px; overflow-y: auto; margin: 20px 0; border: 1px solid #e0e0e0; border-radius: 4px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f5f5f5; position: sticky; top: 0; z-index: 1;">
            ${users.length > 0 ? 
              Object.keys(users[0])
                .filter(key => key !== 'password' && key !== 'password_hash')
                .map(key => `<th style="padding: 12px 15px; text-align: left; border-bottom: 2px solid #ddd; white-space: nowrap;">${key}</th>`)
                .join('')
              : '<th>No user data available</th>'
            }
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr style="border-bottom: 1px solid #eee;" onmouseover="this.style.backgroundColor='#f9f9f9'" onmouseout="this.style.backgroundColor='#fff'">
              ${Object.entries(user)
                .filter(([key]) => key !== 'password' && key !== 'password_hash')
                .map(([key, value]) => {
                  // Format the value for display
                  let displayValue = value;
                  if (value === null || value === undefined) {
                    displayValue = '<span style="color: #999;">null</span>';
                  } else if (key.endsWith('_at') || key === 'created_at' || key === 'updated_at') {
                    displayValue = value ? new Date(value).toLocaleString() : '';
                  } else if (key === 'is_active') {
                    return `
                      <td style="padding: 10px 15px; border-bottom: 1px solid #eee; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${value}">
                        <span style="display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.8em; background: ${value ? '#d4edda' : '#f8d7da'}; color: ${value ? '#155724' : '#721c24' };">
                          ${value ? 'Active' : 'Inactive'}
                        </span>
                      </td>`;
                  } else if (key === 'subscription_status') {
                    return `
                      <td style="padding: 10px 15px; border-bottom: 1px solid #eee; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${value || 'No subscription'}">
                        ${value ? `
                          <span style="display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 0.8em; background: #cce5ff; color: #004085;">
                            ${value}
                          </span>
                        ` : '<span style="color: #6c757d;">None</span>'}
                      </td>`;
                  } else if (typeof value === 'boolean') {
                    displayValue = value ? '✅' : '❌';
                  } else if (typeof value === 'object') {
                    displayValue = JSON.stringify(value);
                  }
                  
                  return `
                    <td style="padding: 10px 15px; border-bottom: 1px solid #eee; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${value}">
                      ${displayValue}
                    </td>`;
                }).join('')}
              }
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <style>
      table {
        font-size: 0.9em;
      }
      th {
        font-weight: 600;
        text-transform: capitalize;
      }
      tr:hover {
        background-color: #f5f5f5 !important;
      }
      td {
        vertical-align: top;
      }
    </style>

    <h2>🗃️ Database Tables</h2>
    <div style="margin: 20px 0;">
      <p>Available tables in the database:</p>
      <ul>
        ${databaseTables.map(table => `<li><strong>${table}</strong> - <a href="#${table}-schema">View Schema</a></li>`).join('')}
      </ul>
    </div>

    <div class="note">
      <h3>🔐 Authentication</h3>
      <p>For endpoints that require authentication, include the JWT token in the Authorization header:</p>
      <pre>Authorization: Bearer &lt;your_jwt_token&gt;</pre>
      <p>Get your token by logging in at <code>/api/auth/login</code>.</p>
    </div>
    
    <footer style="margin-top: 40px; color: #7f8c8d; font-size: 0.9em; text-align: center;">
      <p>Documentation generated on ${new Date().toLocaleString()}</p>
    </footer>
  </body>
  </html>
  `;
  
  res.send(html);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Webhook endpoint needs raw body for signature verification
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful checkout
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // Handle subscription changes
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
