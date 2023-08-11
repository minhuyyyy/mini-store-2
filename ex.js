const onLogin = async () => {
  try {
    const response = await fetch("http://vps.akabom.me/api/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "abc@gmail.com",
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

onLogin();
