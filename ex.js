const onLogin = async () => {
  try {
    const response = await fetch("http://vps.akabom.me/api/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "abc@gmail.com",
        password: "r234598325",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.id, "=>", data);
      console.log("Logged in successfully");
    } else {
      console.log("Invalid email or password");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const onRegister = async () => {
  try {
    const result = await fetch("http://vps.akabom.me/api/account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "string",
        email: "string",
        fullName: "string",
        password: "string",
        isActive: true,
        imgUrl: "string",
        role: "string",
      }),
    });

    if (result.ok) {
      console.log("Registered successfully");
    } else {
      console.log(result.body);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

onRegister();
// onLogin();
