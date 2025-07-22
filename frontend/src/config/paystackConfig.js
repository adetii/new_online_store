// Paystack configuration
const paystackConfig = {
  publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  currency: 'GHS',
  channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
};

export default paystackConfig;