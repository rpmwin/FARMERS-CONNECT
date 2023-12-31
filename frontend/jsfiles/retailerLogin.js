async function submitRetailerLogin() {
  // Retrieve retailer login form data
  let email = document.getElementById("retailerEmail").value;
  let password = document.getElementById("retailerPassword").value;

  // Validate form data (similar to the existing validation logic)

  // Make a POST request to retailer login endpoint
  try {
    const response = await fetch("http://localhost:8000/api/retailerLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.passwordMatch) {
        console.log("Retailer logged in successfully:", data.retailer);
        window.location.href = "5thshowinfo.html";
        // Redirect or perform any other actions as needed
      } else {
        console.log("Incorrect password. Please try again.");
      }
    } else {
      console.log("Error logging in retailer:", response.statusText);
    }
  } catch (err) {
    console.log("Error logging in retailer:", err.message);
  }
}
