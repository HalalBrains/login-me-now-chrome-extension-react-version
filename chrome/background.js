// background.js
// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "saveData") {
	  const { siteUrl, email, password, accessHours, expiration } = request.data;
  
	  // Do something with the data (e.g., save it to local storage)
	  // Here, I am just logging the data to the console.
	  console.log("Site URL:", siteUrl);
	  console.log("Email:", email);
	  console.log("Password:", password);
	  console.log("accessHours:", accessHours);
	  console.log("expiration:", expiration);
	}
  });
  