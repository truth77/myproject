const knex = require('knex');
const config = require('../knexfile.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const db = knex(config.development);

async function createOrUpdateProduct(productData) {
  try {
    let product;
    
    // Check if product exists
    const existingProducts = await stripe.products.list({ active: true });
    const existingProduct = existingProducts.data.find(p => p.name === productData.name);

    if (existingProduct) {
      // Update existing product
      product = await stripe.products.update(existingProduct.id, {
        name: productData.name,
        description: productData.description,
        active: true,
      });
    } else {
      // Create new product
      product = await stripe.products.create({
        name: productData.name,
        description: productData.description,
        active: true,
      });
    }

    return product;
  } catch (error) {
    console.error('Error creating/updating product:', error);
    throw error;
  }
}

async function createOrUpdatePrice(productId, priceData) {
  try {
    // First, deactivate any existing prices for this product and interval
    const existingPrices = await stripe.prices.list({
      product: productId,
      active: true,
    });

    // Deactivate existing prices with the same interval
    for (const price of existingPrices.data) {
      if (price.recurring?.interval === priceData.recurring.interval) {
        await stripe.prices.update(price.id, { active: false });
      }
    }

    // Create new price
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: priceData.amount,
      currency: priceData.currency || 'usd',
      recurring: {
        interval: priceData.interval,
      },
      metadata: {
        interval: priceData.interval,
        interval_count: priceData.interval === 'year' ? 1 : 1,
      },
    });

    return price;
  } catch (error) {
    console.error('Error creating/updating price:', error);
    throw error;
  }
}

async function createTestPlans() {
  try {
    // Premium Subscription Product
    const product = await createOrUpdateProduct({
      name: 'Premium Membership',
      description: 'Access to premium content and features',
    });

    console.log('✅ Created/updated product:', product.id);

    // Monthly Plan
    const monthlyPrice = await createOrUpdatePrice(product.id, {
      amount: 999, // $9.99
      currency: 'usd',
      interval: 'month',
    });

    // Yearly Plan
    const yearlyPrice = await createOrUpdatePrice(product.id, {
      amount: 9990, // $99.90 (about $8.33/month)
      currency: 'usd',
      interval: 'year',
    });

    console.log('✅ Created/updated prices:');
    console.log(`- Monthly: ${monthlyPrice.id} (${monthlyPrice.unit_amount / 100} ${monthlyPrice.currency}/${monthlyPrice.recurring.interval})`);
    console.log(`- Yearly: ${yearlyPrice.id} (${yearlyPrice.unit_amount / 100} ${yearlyPrice.currency}/${yearlyPrice.recurring.interval})`);

    // Save to database
    const plans = [
      {
        id: monthlyPrice.id,
        product_id: product.id,
        name: 'Monthly Subscription',
        description: 'Full access to all premium content for one month',
        amount: monthlyPrice.unit_amount,
        currency: monthlyPrice.currency,
        interval: monthlyPrice.recurring.interval,
        features: JSON.stringify([
          'Access to all premium content',
          'Downloadable resources',
          'Priority support',
          'Cancel anytime'
        ]),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: yearlyPrice.id,
        product_id: product.id,
        name: 'Yearly Subscription',
        description: 'Full access to all premium content for one year (2 months free!)',
        amount: yearlyPrice.unit_amount,
        currency: yearlyPrice.currency,
        interval: yearlyPrice.recurring.interval,
        features: JSON.stringify([
          'Access to all premium content',
          'Downloadable resources',
          'Priority support',
          'Save 30% compared to monthly',
          'Cancel anytime'
        ]),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Insert or update plans in database
    for (const plan of plans) {
      await db('plans')
        .insert(plan)
        .onConflict('id')
        .merge();
    }

    console.log('✅ Successfully updated database with subscription plans');
  } catch (error) {
    console.error('❌ Error creating test plans:', error);
  } finally {
    await db.destroy();
    process.exit(0);
  }
}

// Check if STRIPE_SECRET_KEY is set
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Error: STRIPE_SECRET_KEY environment variable is not set');
  console.log('Please set your Stripe secret key and try again.');
  console.log('Example: export STRIPE_SECRET_KEY=sk_test_...');
  process.exit(1);
}

createTestPlans();
