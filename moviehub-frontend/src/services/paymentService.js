// Payment services simulate transaction gateways entirely on the client-side
// because the backend does not expose payment endpoints.

export const initiatePayment = async (paymentData) => {
  return {
    id: Math.floor(Math.random() * 100000),
    amount: paymentData.amount,
    status: "PENDING"
  };
};

export const processPayment = async (processData) => {
  return {
    id: processData.paymentId,
    transactionId: processData.transactionId || `TXN-${Math.floor(Math.random() * 10000000)}`,
    status: "SUCCESS"
  };
};
