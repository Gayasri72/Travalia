import Booking from '../models/booking.model.js';
import Tour from '../models/tour.model.js';
import User from '../models/user.model.js';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY =
  'sk_test_51R4zgnERWCzInAGIujIUZjR1bRFkyfec5Pby40W7El88cG3348oASuoniaSmlguPHiHVWRGW4A2RvrstSP2ZLSwz00wLEurBlN'; // Replace with your actual Stripe secret key
const STRIPE_WEBHOOK_SECRET =
  'whsec_08da1f1fb62126b781fa92df65052876fd59b1f7ca584c5d3c3cd0bc8b26f0b7'; // Replace with your actual webhook secret
const CLIENT_URL = 'http://localhost:5173';

const stripe = new Stripe(STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { tourId, email } = req.body; // allow any email from frontend
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${CLIENT_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/tours/${tourId}`,
      customer_email: email || 'test@example.com', // use provided email
      client_reference_id: tourId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: tour.name,
              description: tour.summary,
            },
            unit_amount: tour.price * 100,
          },
          quantity: 1,
        },
      ],
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

// Stripe Webhook to confirm payment and create booking
export const stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // use req.body (Buffer) for Stripe signature verification
      sig,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const tourId = session.client_reference_id;
    const user = await User.findOne({ email: session.customer_email });
    if (!user) {
      console.warn('No user found for email:', session.customer_email);
      return res.status(200).json({ received: true });
    }
    await Booking.create({
      tour: tourId,
      user: user._id,
      price: session.amount_total / 100,
      paid: true,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
    });
  }
  res.status(200).json({ received: true });
};

// Get all bookings for the logged-in user
export const getUserBookings = async (req, res, next) => {
  try {
    // For now, get userId from query or body for demo (replace with req.user._id if using auth)
    const userId = req.user?._id || req.query.userId || req.body.userId;
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    const bookings = await Booking.find({ user: userId }).populate('tour');
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};
