// utils/notification.js
async function notifyUser(userId, message) {
  // Hook into email/Slack/push notifications here.
  console.log(`Notify ${userId}: ${message}`);
  return true;
}

module.exports = { notifyUser };
