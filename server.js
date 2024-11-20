import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: '*', // Allow all origins or specify your frontend URL
};
app.use(cors(corsOptions));
app.use(express.json());

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
};

// Set initial values to 0
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
};

// Duration of the campaign in hours and update interval in milliseconds
const totalDurationHours = 96;
const updateIntervalMs = 10 * 1000;
const totalUpdates = (totalDurationHours * 60 * 60 * 1000) / updateIntervalMs;

// Calculate incremental steps for each data point
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
};

// Function to update data gradually
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
  };
};

// Start server
const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  
});

// WebSocket server
const wss = new WebSocketServer({ server });

// Broadcast data to all connected clients
const broadcastData = () => {
  const jsonData = JSON.stringify(data);
  
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(jsonData);
      
      
    }
  });
};

// Update and broadcast data periodically
setInterval(() => {
  updateData();
  broadcastData();
}, updateIntervalMs);