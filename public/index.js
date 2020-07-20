const handleRegister = async () => {
  const firstname = event.target.firstName.value;
  const lastname = event.target.lastName.value;
  const username = event.target.username.value;
  const email = event.target.email.value;
  const pass = event.target.pass.value;
  const c_pass = event.target.c_pass.value;

  if (pass !== c_pass) alert("Password do not match");
  const user = {
    firstname,
    lastname,
    username,
    email,
    pass,
  };
  try {
    const res = await fetch("https://extended-chat.herokuapp.com/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(user),
    });
    const addedUser = await res.json();

    console.log("Added user:", addedUser);
    return addedUser;
  } catch (error) {
    console.log(error);
  }
};

document.getElementById("register").addEventListener("submit", handleRegister);
