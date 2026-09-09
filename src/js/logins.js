async function login(username, password) {
  const response = await fetch(
    "https://schulclub.intensed.workers.dev/v1/svgs/logins",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    }
  );

  const data = await response.json();

  return data;
}

// Beispiel
//const result = await login("max", "passwort123");

//if (result.ok) {
//  console.log("Login erfolgreich!");
//  console.log("Code:", result.code);
//} else {
//  console.log("Login fehlgeschlagen");
//}
