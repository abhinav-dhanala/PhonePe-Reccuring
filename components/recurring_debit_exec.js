//curl cmd->{"success":true,"code":"SUCCESS","message":"Your request has been successfully submitted","data":{"merchantId":"PGTESTPAYUAT140","transactionId":"TX9876543210","state":"PENDING","amount":39900}}

const axios = require("axios");
const sha256 = require("sha256");

// UAT environment
const MERCHANT_ID = "PGTESTPAYUAT140";
const PHONE_PE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const SALT_INDEX = 1;
const SALT_KEY = "775765ff-824f-4cc4-9053-c3926e493514";

// Helper function to create checksum
function createChecksum(payload, endpoint) {
  const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
  const base64EncodedPayload = bufferObj.toString("base64");
  const string = base64EncodedPayload + endpoint + SALT_KEY;
  const sha256_val = sha256(string);
  return sha256_val + "###" + SALT_INDEX;
}

module.exports = async function (req, res) {
  const { subscriptionId, notificationId, transactionId, userId } = req.body;
  const payload = {
    merchantId: MERCHANT_ID,
    merchantUserId: userId,
    subscriptionId: subscriptionId,
    notificationId: notificationId,
    transactionId: transactionId,
  };

  console.log("Payload to PhonePe:", payload);

  const xVerifyChecksum = createChecksum(payload, "/v3/recurring/debit/execute");

  try {
    let response = await axios.post(
      `${PHONE_PE_HOST_URL}/v3/recurring/debit/execute`,
      { request: Buffer.from(JSON.stringify(payload), "utf8").toString("base64") },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyChecksum,
          accept: "application/json",
        },
      }
    );
    console.log("PhonePe response:", response.data);
    res.send(response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      console.error("Error request:", error.request);
      res.status(500).send("No response received from PhonePe");
    } else {
      console.error("Error message:", error.message);
      res.status(500).send(error.message);
    }
  }
};
