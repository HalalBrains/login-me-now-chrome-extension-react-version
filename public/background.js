// background.js
// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "saveData") {
	  // eslint-disable-next-line no-unused-vars
	  const { siteUrl, email, password, accessHours, expiration } = request.data;

	}
  });
  