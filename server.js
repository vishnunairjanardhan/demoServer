import { WebSocketServer } from 'ws';

// Set initial and target data values
const targetData = {
  totalSales: 5000000000,
  giftCardSold: 2000000,
  giftCardRedeem: 1500000,
  giftCardLift: 10,
  totalOrderLift: 8,
  loyaltySignup: 500000,
  loyaltyPointEarn: 100000000,
  loyaltyPointRedeem: 70000000,
  orderPlacedUsingLoyaltyPoint: 100000,
  orderPlacedUsingCashback: 100000,
  orderPlacedUsingStoreCredit: 200000,
};


let data = {
  totalSales: 0,
  giftCardSold: 0,
  giftCardRedeem: 0,
  giftCardLift: 0,
  totalOrderLift: 0,
  loyaltySignup: 0,
  loyaltyPointEarn: 0,
  loyaltyPointRedeem: 0,
  orderPlacedUsingLoyaltyPoint: 0,
  orderPlacedUsingCashback: 0,
  orderPlacedUsingStoreCredit: 0,
};


const totalDurationHours = 96;
const updateIntervalMs = 10 * 1000;
const totalUpdates = (totalDurationHours * 60 * 60 * 1000) / updateIntervalMs;


const incrementSteps = {
  totalSales: targetData.totalSales / totalUpdates,
  giftCardSold: targetData.giftCardSold / totalUpdates,
  giftCardRedeem: targetData.giftCardRedeem / totalUpdates,
  giftCardLift: targetData.giftCardLift / totalUpdates,
  totalOrderLift: targetData.totalOrderLift / totalUpdates,
  loyaltySignup: targetData.loyaltySignup / totalUpdates,
  loyaltyPointEarn: targetData.loyaltyPointEarn / totalUpdates,
  loyaltyPointRedeem: targetData.loyaltyPointRedeem / totalUpdates,
  orderPlacedUsingLoyaltyPoint: targetData.orderPlacedUsingLoyaltyPoint / totalUpdates,
  orderPlacedUsingCashback: targetData.orderPlacedUsingCashback / totalUpdates,
  orderPlacedUsingStoreCredit: targetData. orderPlacedUsingStoreCredit / totalUpdates,
};


const updateData = () => {
  data = {
    totalSales: Math.min(data.totalSales + incrementSteps.totalSales, targetData.totalSales),
    giftCardSold: Math.min(data.giftCardSold + incrementSteps.giftCardSold, targetData.giftCardSold),
    giftCardRedeem: Math.min(data.giftCardRedeem + incrementSteps.giftCardRedeem, targetData.giftCardRedeem),
    giftCardLift: Math.min(data.giftCardLift + incrementSteps.giftCardLift, targetData.giftCardLift),
    totalOrderLift: Math.min(data.totalOrderLift + incrementSteps.totalOrderLift, targetData.totalOrderLift),
    loyaltySignup: Math.min(data.loyaltySignup + incrementSteps.loyaltySignup, targetData.loyaltySignup),
    loyaltyPointEarn: Math.min(data.loyaltyPointEarn + incrementSteps.loyaltyPointEarn, targetData.loyaltyPointEarn),
    loyaltyPointRedeem: Math.min(data.loyaltyPointRedeem + incrementSteps.loyaltyPointRedeem, targetData.loyaltyPointRedeem),
    orderPlacedUsingLoyaltyPoint: Math.min(data.orderPlacedUsingLoyaltyPoint + incrementSteps.orderPlacedUsingLoyaltyPoint, targetData.orderPlacedUsingLoyaltyPoint),
    orderPlacedUsingCashback: Math.min(data.orderPlacedUsingCashback + incrementSteps.orderPlacedUsingCashback, targetData.orderPlacedUsingCashback),
    orderPlacedUsingStoreCredit: Math.min(data.orderPlacedUsingStoreCredit + incrementSteps.orderPlacedUsingStoreCredit, targetData.orderPlacedUsingStoreCredit),
  };
};


const wss = new WebSocketServer({ port: 5000 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.send(JSON.stringify(data));

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});


const broadcastData = () => {
  const jsonData = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(jsonData);
    }
  });
};


setInterval(() => {
  updateData();
  broadcastData();
}, updateIntervalMs);

console.log('WebSocket server is running on port 5000');