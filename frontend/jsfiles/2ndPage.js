document
  .getElementById("signup-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Form data submitted:", event.target);
  });
document.getElementById("home").addEventListener("click", function () {
  sessionStorage.clear();
  window.open("1stpage.html", "_blank");
  document.getElementById("signup-form").reset();
  window.close();
});

async function submitForm() {
  event.preventDefault();

  let name = document.getElementById("username").value;
  let phone = document.getElementById("phone").value;
  let email = document.getElementById("Email").value;
  let password = document.getElementById("password").value;
  let landnumber = document.getElementById("unique-number").value;

  if (!name || !phone || !email || !password || !landnumber || !address) {
    let missingFields = [];
    if (!name) missingFields.push("Username");
    if (!phone) missingFields.push("Phone Number");
    if (!email) missingFields.push("Email");
    if (!password) missingFields.push("Password");
    if (!landnumber) missingFields.push("10 Digit Unique Number");
    if (!address) missingFields.push("Address");

    alert("Please fill in the following fields:\n" + missingFields.join(", "));
    return;
  }

  // let isUsernameAvailable = await checkAvailability("name", name);
  let isEmailAvailable = await checkAvailability("email", email);
  let islandnumberAvailable = await checkAvailability("landnumber", landnumber);

  // if (!isUsernameAvailable) {
  //   alert(
  //     "Username is already taken. Please choose a different username."
  //   );
  //   return;
  // }
  if (!islandnumberAvailable) {
    alert(
      "Land - number is already taken. Please choose a different Land - number."
    );
    return;
  }

  if (!isEmailAvailable) {
    alert("Email is already registered. Please use a different email address.");
    return;
  }

  let data = {
    name: name,
    phone: phone,
    email: email,
    password: password,
    landnumber: landnumber,
  };
  let jsonData = JSON.stringify(data);

  await fetch("http://localhost:8000/api/users", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: jsonData,
  })
    .then(() => {
      console.log("success: ", jsonData);
      window.location.href = "4thDashBoard.html";
    })
    .catch((err) => {
      console.log("error: ", err);
    });
}

async function checkAvailability(type, value) {
  try {
    let response = await fetch(
      `http://localhost:8000/api/checkAvailability?type=${type}&value=${value}`
    );
    let data = await response.json();
    return data.available;
  } catch (error) {
    console.log("Error checking availability:", error);
    return false;
  }
}
