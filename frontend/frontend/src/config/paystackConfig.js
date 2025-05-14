// Paystack configuration
const paystackConfig = {
  publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'your_test_public_key',
  currency: 'GHS',
  channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
};

export default paystackConfig;