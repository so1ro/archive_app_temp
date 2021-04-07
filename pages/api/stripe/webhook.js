import { stripe } from '@/utils/stripe';
import { postData } from '@/utils/helpers';

// Stripe requires the raw body to construct the event.
export const config = {
    api: {
        bodyParser: false
    }
};

async function buffer(readable) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        );
    }
    return Buffer.concat(chunks);
}

const relevantEvents = new Set([
    'product.created',
    'product.updated',
    'price.created',
    'price.updated',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
]);

// Match the raw body to content type application/json
const webhookHandler = async (req, res) => {
    if (req.method === 'POST') {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];

        const webhookSecret =
            process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET_LIVE ??
            process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET;

        let event;

        try {
            event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
        } catch (err) {
            console.log(`❌ Error message: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (relevantEvents.has(event.type)) {
            try {
                // Handle the event
                switch (event.type) {
                    case 'checkout.session.completed':
                        const checkoutSession = event.data.object;
                        console.log('checkoutSession:', checkoutSession)

                        // Then define and call a method to handle the successful payment intent.
                        // handlePaymentIntentSucceeded(paymentIntent);
                        break;
                    case 'payment_method.attached':
                        const paymentMethod = event.data.object;

                        // Then define and call a method to handle the successful attachment of a PaymentMethod.
                        // handlePaymentMethodAttached(paymentMethod);
                        break;
                    // ... handle other event types
                    default:
                        console.log(`Unhandled event type ${event.type}`);
                }

            } catch (error) {
                console.log(error);
                return res.json({ error: 'Webhook handler failed. View logs.' });
            }
        }

        // Return a response to acknowledge receipt of the event
        res.json({ received: true });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
};

export default webhookHandler;