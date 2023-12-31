
      async function loginForm(event) {
        event.preventDefault();

        let phone = document.getElementById("phone").value;
        let password = document.getElementById("password").value;

        if (!phone || !password) {
          let missingFields = [];
          if (!phone) missingFields.push("Phone Number");
          if (!password) missingFields.push("Password");
          alert(
            "Please fill in the following fields:\n" + missingFields.join(", ")
          );
          return;
        }

        let userData = await checkPassword("phone", phone, password);

        if (userData) {
          // Password is correct, handle user data
          console.log("User Data:", userData);

          // Pass user data to the dashboard page
          localStorage.setItem("userData", JSON.stringify(userData));

          // Redirect to the dashboard page
          window.location.href = "4thDashBoard.html";
        } else {
          // Password is incorrect
          alert("Incorrect password. Please try again.");
        }
      }

      async function checkPassword(type, value, password) {
        try {
          let response = await fetch(
            `http://localhost:8000/api/checkpassword?type=${type}&value=${value}&password=${password}`
          );
          let data = await response.json();

          if (data.passwordMatch === undefined) {
            // Error handling: Unable to check password
            console.log("Error checking password");
            return null;
          } else if (data.passwordMatch) {
            // Password matches, return the user data
            return data.user;
          } else {
            // Password is incorrect
            return null;
          }
        } catch (error) {
          console.log("Error checking password:", error);
          return null; // Return null to indicate an error
        }
      }
 