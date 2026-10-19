const axios = require('axios');

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

async function run() {
  if (!adminEmail || !adminPassword) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD for an existing administrator account.");
  }

  try {
    console.log("1. Logging in as admin...");
    const loginResponse = await axios.post("http://localhost:8080/api/auth/login", {
      email: adminEmail,
      password: adminPassword
    });
    console.log("Login successful. Token acquired.");
    
    const token = loginResponse.data.token;
    
    console.log("2. Fetching users list...");
    const usersResponse = await axios.get("http://localhost:8080/api/admin/users", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    console.log("Users fetched successfully!");
    console.log("User list count:", usersResponse.data.length);
    console.log("Users detail:");
    console.log(JSON.stringify(usersResponse.data, null, 2));
    
  } catch (error) {
    console.error("Error occurred during API test:", error.response ? error.response.data : error.message);
  }
}

run();
