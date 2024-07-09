const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const createUserSubscription = require("./components/create_user_subscription");
const getUserSubscriptionStatus = require("./components/user_subscription_status");
const verifyVPA = require("./components/verify_vpa");
const submitAuthRequest = require("./components/submit_auth_req");
const authReqStatus = require("./components/auth_req_status");
const recurringNotification = require("./components/recurring_notification");
const recurringDebitExecute = require("./components/recurring_debit_exec");
const recurringDebitStatus = require("./components/recurring_debit_status");
const revokeSub = require("./components/revoke_sub");

const app = express();
const port = 3002;

// Setting up middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Test route
app.get("/", (req, res) => {
  res.send("PhonePe Integration APIs!");
});

// Routes
app.post("/subscription/create", createUserSubscription);
app.get("/subscription/validate/:subscriptionId", getUserSubscriptionStatus);
app.get("/vpa/verify/:vpa", verifyVPA);
app.post("/auth/submit", submitAuthRequest);
app.get("/auth/status/:authRequestId", authReqStatus);
app.post("/recurring/init", recurringNotification);
app.post("/recurring/execute", recurringDebitExecute);
app.get("/recurring/status/:merchantTransactionId", recurringDebitStatus);
app.post("/callback/revoke", revokeSub);

// Starting the server
app.listen(port, () => {
  console.log(`PhonePe application listening on port ${port}`);
});
