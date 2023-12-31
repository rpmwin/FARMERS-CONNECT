async function submitRetailerSignup() {
  // Retrieve retailer signup form data
  let name = document.getElementById("retailerName").value;
  let phone = document.getElementById("retailerPhone").value;
  let email = document.getElementById("retailerEmail").value;
  let password = document.getElementById("retailerPassword").value;
  let gstNumber = document.getElementById("gstNumber").value;
  let panNumber = document.getElementById("panNumber").value;
  let address = document.getElementById("address").value;

  // Validate form data (similar to the existing validation logic)

  // Check retailer email availability
  let isEmailAvailable = await checkAvailability("email", email);

  if (!isEmailAvailable) {
    alert("Email is already registered. Please use a different email address.");
    return;
  }

  // Prepare data for retailer signup
  let data = {
    name: name,
    phone: phone,
    email: email,
    password: password,
    gstNumber: gstNumber,
    panNumber: panNumber,
    address: address,
  };

  // Make a POST request to retailer signup endpoint
  try {
    const response = await fetch("http://localhost:8000/api/retailerSignup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("Retailer signed up successfully");
      // Redirect or perform any other actions as needed
    } else {
      console.log("Error signing up retailer:", response.statusText);
    }
  } catch (error) {
    console.log("Error signing up retailer:", error.message);
  }
}

async function checkAvailability(type, value) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/checkAvailability?type=${type}&value=${value}`
    );
    const data = await response.json();
    return data.available;
  } catch (error) {
    console.log("Error checking availability:", error.message);
    return false;
  }
}
