import { stripe } from '@/utils/stripe';
import { postData } from '@/utils/helpers';
import { upsertSubscriptionRecord, upsertChargeRecord } from '@/utils/useAuth0';

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
    'invoice.payment_succeeded',
    'charge.refunded',
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
        } catch (error) {
            console.log(`❌ Error message: ${error.message}`);
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }

        if (relevantEvents.has(event.type)) {
            try {
                // Handle the event
                switch (event.type) {
                    // case 'customer.created':
                    // case 'payment_intent.succeeded':
                    case 'customer.subscription.created':
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':
                        const subscriptionSession = event.data.object;
                        upsertSubscriptionRecord(subscriptionSession)
                        break;

                    case 'invoice.updated':
                        const invoiceSession = event.data.object;
                        console.log('invoiceSession:', invoiceSession)
                        break;

                    case 'invoice.payment_succeeded':
                        const paymentSession = event.data.object;
                        console.log('invoice:', paymentSession)
                        upsertChargeRecord(paymentSession)
                        break;

                    case 'charge.refunded':
                        const refundSession = event.data.object;
                        console.log('refound:', refundSession)
                        upsertChargeRecord(refundSession)

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