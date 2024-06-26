const zones = [
  {
    zone_name: "sydney",
    street: "20 George Street",
    suburb: "Sydney",
    city: "Sydney",
    state: "NSW",
    post_code: "2000",
    country_code: "AU",
  },
  {
    zone_name: "other-nsw",
    street: "123 Tweed Coast Road",
    suburb: "Cudgen",
    city: "Cudgen",
    state: "NSW",
    post_code: "2487",
    country_code: "AU",
  },
  {
    zone_name: "melbourne",
    street: "123 Collins St",
    suburb: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    post_code: "3000",
    country_code: "AU",
  },
  {
    zone_name: "other-vic",
    street: "11 Hosking Road",
    suburb: "Jeetho",
    city: "Jeetho",
    state: "VIC",
    post_code: "3945",
    country_code: "AU",
  },
  {
    zone_name: "brisbane",
    street: "123 Albion Avenue",
    suburb: "Miami",
    city: "Miami",
    state: "QLD",
    post_code: "4220",
    country_code: "AU",
  },
  {
    zone_name: "near-qld",
    street: "123 Collins St",
    suburb: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    post_code: "3000",
    country_code: "AU",
  },
  {
    zone_name: "mid-qld",
    street: "123 Collins St",
    suburb: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    post_code: "3000",
    country_code: "AU",
  },
  {
    zone_name: "nth-qld",
    street: "123 Collins St",
    suburb: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    post_code: "3000",
    country_code: "AU",
  },
  {
    zone_name: "perth",
    street: "123 Queen St",
    suburb: "Perth",
    city: "Perth",
    state: "WA",
    post_code: "6000",
    country_code: "AU",
  },
  {
    zone_name: "mid-wa",
    street: "123 Collins St",
    suburb: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    post_code: "3000",
    country_code: "AU",
  },
  {
    zone_name: "nth-wa",
    street: "123 Collins St",
    suburb: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    post_code: "3000",
    country_code: "AU",
  },
  {
    zone_name: "adelaide",
    street: "123 Queen St",
    suburb: "Adelaide",
    city: "Adelaide",
    state: "SA",
    post_code: "5000",
    country_code: "AU",
  },
  {
    zone_name: "other-sa",
    street: "123 Collins St",
    suburb: "Melbourne",
    city: "Melbourne",
    state: "VIC",
    post_code: "3000",
    country_code: "AU",
  },
  {
    zone_name: "northern-territory",
    street: "1 Queen St",
    suburb: "Stuart Park",
    city: "Stuart Park",
    state: "NT",
    post_code: "0820",
    country_code: "AU",
  },
  {
    zone_name: "tasmania",
    street: "12 Hobart Rd",
    suburb: "South Launceston",
    city: "South Launceston",
    state: "TAS",
    post_code: "7249",
    country_code: "AU",
  },
];

let apiKey = "";
let subscriptionKey = "";

// Function to show the API key modal
function showApiKeyModal() {
  const modal = document.getElementById("api-key-modal");
  modal.style.display = "block";

  const storedApiKey = localStorage.getItem("apiKey");
  const storedSubscriptionKey = localStorage.getItem("subscriptionKey");

  if (storedApiKey && storedSubscriptionKey) {
    document.getElementById("api-key").value = apiKey;
    document.getElementById("subscription-key").value = subscriptionKey;
  }
}

// Function to close the API key modal
function closeApiKeyModal() {
  const modal = document.getElementById("api-key-modal");
  modal.style.display = "none";
}

// Function to save the API and Subscription keys
function saveApiKeys() {
  apiKey = document.getElementById("api-key").value;
  subscriptionKey = document.getElementById("subscription-key").value;

  if (apiKey && subscriptionKey) {
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("subscriptionKey", subscriptionKey);
    closeApiKeyModal();
    alert("API keys saved successfully!");
  } else {
    alert("Please enter both API Key and Subscription Key.");
  }
}

// Retrieve API and Subscription keys from localStorage
const storedApiKey = localStorage.getItem("apiKey");
const storedSubscriptionKey = localStorage.getItem("subscriptionKey");

if (storedApiKey && storedSubscriptionKey) {
  apiKey = storedApiKey;
  subscriptionKey = storedSubscriptionKey;
}

function calculateShippingRate() {
  console.log("Calculating shipping rate...");
  document.getElementById("fetch-message").textContent = "Fetching results...";

  if (!apiKey || !subscriptionKey) {
    showApiKeyModal();
    return;
  }

  const formData = {
    order_id: 100000,
    refresh_rate: true,
    sender: {
      street: document.getElementById("street").value,
      suburb: document.getElementById("suburb").value,
      city: document.getElementById("suburb").value,
      state: document.getElementById("state").value,
      post_code: document.getElementById("post-code").value,
      country_code: "AU",
    },
    packages: [
      {
        weight: parseFloat(document.getElementById("weight").value),
        height: parseFloat(document.getElementById("height").value / 100),
        width: parseFloat(document.getElementById("width").value / 100),
        length: parseFloat(document.getElementById("length").value / 100),
        package_name: "Package",
      },
    ],
    declared_value: 20.0,
    return_order: false,
    include_pricing: true,
    no_cache: true,
    currency: "AUD",
  };

  console.log(
    "...from sender address",
    formData.sender,
    "with the package",
    formData.packages
  );

  const delay = 6900; // Delay in milliseconds between requests
  const maxRetries = 5; // Maximum number of retries for failed requests
  let delayCounter = 0;

  const promises = zones.map((destination, index) => {
    const requestData = { ...formData, destination };

    return fetchDeliveryServicesWithRetry(
      requestData,
      index,
      delay,
      maxRetries,
      delayCounter
    );
  });

  Promise.all(promises)
    .then(() => {
      // Show the "Completed" message
      document.getElementById("fetch-message").textContent = "Completed";
    })
    .catch((error) => {
      console.error("Error:", error);

      // Show the "Completed" message even if there's an error
      document.getElementById("fetch-message").textContent =
        "Request Complete - Error fetching data";
    });
}

function fetchDeliveryServicesWithRetry(
  requestData,
  index,
  delay,
  maxRetries,
  delayCounter
) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch("https://api.starshipit.com/api/deliveryservices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "StarShipIT-Api-Key": apiKey,
          "Ocp-Apim-Subscription-Key": subscriptionKey,
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const services = data.services.map(
              (service) => `
            <strong>${service.carrier}</strong> ${service.service_name} (${
                service.service_code
              }) • $${service.total_price.toFixed(2)}<br><br>
            `
            );

            document.getElementById(
              `result-${requestData.destination.zone_name}`
            ).innerHTML = services.join("");
            resolve();
          } else {
            if (delayCounter < maxRetries) {
              console.log(
                `Failed to get services for ${requestData.destination.zone_name}. Retrying...`
              );
              fetchDeliveryServicesWithRetry(
                requestData,
                index,
                delay,
                maxRetries,
                delayCounter + 1
              )
                .then(resolve)
                .catch(reject);
            } else {
              document.getElementById(
                `result-${requestData.destination.zone_name}`
              ).innerHTML = "Failed to get services after multiple retries";
              resolve();
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          if (delayCounter < maxRetries) {
            console.log(
              `An error occurred for ${requestData.destination.zone_name}. Retrying...`
            );
            fetchDeliveryServicesWithRetry(
              requestData,
              index,
              delay,
              maxRetries,
              delayCounter + 1
            )
              .then(resolve)
              .catch(reject);
          } else {
            document.getElementById(
              `result-${requestData.destination.zone_name}`
            ).innerHTML = "An error occurred after multiple retries";
            resolve();
          }
        });
    }, delayCounter * delay);
    delayCounter++;
  });
}

function fetchRatesWithRetry(
  requestData,
  index,
  delay,
  maxRetries,
  delayCounter,
  isPreset
) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch("https://api.starshipit.com/api/rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "StarShipIT-Api-Key": apiKey,
          "Ocp-Apim-Subscription-Key": subscriptionKey,
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            if (isPreset) {
              const rates = data.rates
                .map(
                  (rate) =>
                    `${rate.service_name}: $${rate.total_price.toFixed(2)}`
                )
                .join("<br>");
              console.log(
                `Rates for ${requestData.destination.zone_name}:`,
                rates
              );
              document.getElementById(
                `result-${requestData.destination.zone_name}`
              ).innerHTML = rates;
            }
            resolve(data);
          } else {
            if (delayCounter < maxRetries) {
              console.log(
                `Failed to get rates for ${
                  isPreset
                    ? requestData.destination.zone_name
                    : "Custom Address"
                }. Retrying...`
              );
              fetchRatesWithRetry(
                requestData,
                index,
                delay,
                maxRetries,
                delayCounter + 1,
                isPreset
              )
                .then(resolve)
                .catch(reject);
            } else {
              if (isPreset) {
                document.getElementById(
                  `result-${requestData.destination.zone_name}`
                ).innerHTML = "Failed to get rates after multiple retries";
              } else {
                document.getElementById("result-custom-address").innerHTML =
                  "Failed to get rates after multiple retries";
              }
              resolve(null);
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          if (delayCounter < maxRetries) {
            console.log(
              `An error occurred for ${
                isPreset ? requestData.destination.zone_name : "Custom Address"
              }. Retrying...`
            );
            fetchRatesWithRetry(
              requestData,
              index,
              delay,
              maxRetries,
              delayCounter + 1,
              isPreset
            )
              .then(resolve)
              .catch(reject);
          } else {
            if (isPreset) {
              document.getElementById(
                `result-${requestData.destination.zone_name}`
              ).innerHTML = "An error occurred after multiple retries";
            } else {
              document.getElementById("result-custom-address").innerHTML =
                "An error occurred after multiple retries";
            }
            resolve(null);
          }
        });
    }, delayCounter * delay);
    delayCounter++;
  });
}

function calculateCustomAddressShippingRate() {
  console.log("Calculating shipping rate for custom address...");
  document.getElementById("fetch-message").textContent = "Fetching results...";

  if (!apiKey || !subscriptionKey) {
    showApiKeyModal();
    return;
  }

  const formData = {
    order_id: 100000,
    refresh_rate: true,
    sender: {
      street: document.getElementById("street").value,
      suburb: document.getElementById("suburb").value,
      city: document.getElementById("suburb").value,
      state: document.getElementById("state").value,
      post_code: document.getElementById("post-code").value,
      country_code: "AU",
    },
    packages: [
      {
        weight: parseFloat(document.getElementById("weight").value),
        height: parseFloat(document.getElementById("height").value / 100),
        width: parseFloat(document.getElementById("width").value / 100),
        length: parseFloat(document.getElementById("length").value / 100),
        package_name: "Package",
      },
    ],
    declared_value: 20.0,
    return_order: false,
    include_pricing: true,
    no_cache: true,
    currency: "AUD",
  };

  const customDeliveryAddress = {
    street: document.getElementById("delivery-street").value,
    suburb: document.getElementById("delivery-suburb").value,
    city: document.getElementById("delivery-suburb").value,
    state: document.getElementById("delivery-state").value,
    post_code: document.getElementById("delivery-post-code").value,
    country_code: "AU", // Assuming the country code is always "AU"
  };

  const isCustomAddressValid =
    customDeliveryAddress.street &&
    customDeliveryAddress.suburb &&
    customDeliveryAddress.city &&
    customDeliveryAddress.state &&
    customDeliveryAddress.post_code;

  if (!isCustomAddressValid) {
    document.getElementById("result-custom-address").innerHTML =
      "Please enter a valid delivery address.";
    document.getElementById("fetch-message").textContent = "Completed";
    return;
  }

  const delay = 6900; // Delay in milliseconds between requests
  const maxRetries = 5; // Maximum number of retries for failed requests
  let delayCounter = 0;

  const requestData = { ...formData, destination: customDeliveryAddress };

  fetchDeliveryServicesWithRetry(
    requestData,
    null,
    delay,
    maxRetries,
    delayCounter
  )
    .then((data) => {
      if (data && data.success) {
        const services = data.services.map(
          (service) => `
        <strong>${service.carrier}</strong> ${service.service_name} (${
            service.service_code
          }) • $${service.total_price.toFixed(2)}<br><br>
      `
        );

        document.getElementById("result-custom-address").innerHTML =
          services.join("");
      } else {
        document.getElementById("result-custom-address").innerHTML =
          "Failed to get services";
      }

      // Show the "Completed" message
      document.getElementById("fetch-message").textContent = "Completed";
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      document.getElementById("result-custom-address").innerHTML =
        "An error occurred";

      // Show the "Completed" message even if there's an error
      document.getElementById("fetch-message").textContent =
        "Request Complete - Error fetching data";
    });
}

function fetchDeliveryServicesWithRetry(
  requestData,
  index,
  delay,
  maxRetries,
  delayCounter
) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch("https://api.starshipit.com/api/deliveryservices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "StarShipIT-Api-Key": apiKey,
          "Ocp-Apim-Subscription-Key": subscriptionKey,
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            if (index !== null) {
              const services = data.services.map(
                (service) => `
                <strong>${service.carrier}</strong> ${service.service_name} (${
                  service.service_code
                }) • $${service.total_price.toFixed(2)}<br><br>
                `
              );

              document.getElementById(
                `result-${requestData.destination.zone_name}`
              ).innerHTML = services.join("");
            }
            resolve(data);
          } else {
            if (delayCounter < maxRetries) {
              console.log(
                `Failed to get services for ${
                  index !== null
                    ? requestData.destination.zone_name
                    : "Custom Address"
                }. Retrying...`
              );
              fetchDeliveryServicesWithRetry(
                requestData,
                index,
                delay,
                maxRetries,
                delayCounter + 1
              )
                .then(resolve)
                .catch(reject);
            } else {
              if (index !== null) {
                document.getElementById(
                  `result-${requestData.destination.zone_name}`
                ).innerHTML = "Failed to get services after multiple retries";
              } else {
                document.getElementById("result-custom-address").innerHTML =
                  "Failed to get services after multiple retries";
              }
              resolve(null);
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          if (delayCounter < maxRetries) {
            console.log(
              `An error occurred for ${
                index !== null
                  ? requestData.destination.zone_name
                  : "Custom Address"
              }. Retrying...`
            );
            fetchDeliveryServicesWithRetry(
              requestData,
              index,
              delay,
              maxRetries,
              delayCounter + 1
            )
              .then(resolve)
              .catch(reject);
          } else {
            if (index !== null) {
              document.getElementById(
                `result-${requestData.destination.zone_name}`
              ).innerHTML = "An error occurred after multiple retries";
            } else {
              document.getElementById("result-custom-address").innerHTML =
                "An error occurred after multiple retries";
            }
            resolve(null);
          }
        });
    }, delayCounter * delay);
    delayCounter++;
  });
}

const MAX_SAVED_ADDRESSES = 5;
let savedAddresses = [];

// Function to save the sender address
function saveSenderAddress() {
  const senderAddress = {
    street: document.getElementById("street").value,
    suburb: document.getElementById("suburb").value,
    city: document.getElementById("suburb").value,
    state: document.getElementById("state").value,
    post_code: document.getElementById("post-code").value,
    country_code: "AU",
  };

  if (savedAddresses.length < MAX_SAVED_ADDRESSES) {
    savedAddresses.push(senderAddress);
    localStorage.setItem("savedAddresses", JSON.stringify(savedAddresses));
    displaySavedAddresses();
  } else {
    alert(`You can save up to ${MAX_SAVED_ADDRESSES} addresses only.`);
  }
}

// Function to display the saved addresses
function displaySavedAddresses() {
  const savedAddressesList = document.getElementById("saved-addresses-list");
  savedAddressesList.innerHTML = "";

  savedAddresses.forEach((address, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = address.street;
    listItem.addEventListener("click", () => populateSenderAddress(address));
    savedAddressesList.appendChild(listItem);
  });
}

// Function to populate the sender address fields
function populateSenderAddress(address) {
  document.getElementById("street").value = address.street;
  document.getElementById("suburb").value = address.suburb;
  document.getElementById("state").value = address.state;
  document.getElementById("post-code").value = address.post_code;
}

// Retrieve saved addresses from localStorage
const savedAddressesFromStorage = localStorage.getItem("savedAddresses");
if (savedAddressesFromStorage) {
  savedAddresses = JSON.parse(savedAddressesFromStorage);
}

// Display saved addresses on page load
displaySavedAddresses();

const MAX_SAVED_DELIVERY_ADDRESSES = 5;
let savedDeliveryAddresses = [];

// Function to save the custom delivery address
function saveDeliveryAddress() {
  const deliveryAddress = {
    street: document.getElementById("delivery-street").value,
    suburb: document.getElementById("delivery-suburb").value,
    city: document.getElementById("delivery-suburb").value,
    state: document.getElementById("delivery-state").value,
    post_code: document.getElementById("delivery-post-code").value,
    country_code: "AU",
  };

  if (savedDeliveryAddresses.length < MAX_SAVED_DELIVERY_ADDRESSES) {
    savedDeliveryAddresses.push(deliveryAddress);
    localStorage.setItem(
      "savedDeliveryAddresses",
      JSON.stringify(savedDeliveryAddresses)
    );
    displaySavedDeliveryAddresses();
  } else {
    alert(
      `You can save up to ${MAX_SAVED_DELIVERY_ADDRESSES} delivery addresses only.`
    );
  }
}

// Function to display the saved delivery addresses
function displaySavedDeliveryAddresses() {
  const savedDeliveryAddressesList = document.getElementById(
    "saved-delivery-addresses-list"
  );
  savedDeliveryAddressesList.innerHTML = "";

  savedDeliveryAddresses.forEach((address, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = address.street;
    listItem.addEventListener("click", () => populateDeliveryAddress(address));
    savedDeliveryAddressesList.appendChild(listItem);
  });
}

// Function to populate the delivery address fields
function populateDeliveryAddress(address) {
  document.getElementById("delivery-street").value = address.street;
  document.getElementById("delivery-suburb").value = address.suburb;
  document.getElementById("delivery-state").value = address.state;
  document.getElementById("delivery-post-code").value = address.post_code;
}

// Retrieve saved addresses from localStorage
const savedDeliveryAddressesFromStorage = localStorage.getItem(
  "savedDeliveryAddresses"
);
if (savedDeliveryAddressesFromStorage) {
  savedDeliveryAddresses = JSON.parse(savedDeliveryAddressesFromStorage);
}

displaySavedDeliveryAddresses();

// Function to clear the cache
function clearCache() {
  localStorage.clear();
  location.reload();
  alert("Cache has been cleared.");
}
