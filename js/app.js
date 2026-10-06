function logout() {
  localStorage.removeItem("smartKisanUser");
  window.location.href = "login.html";
}

function requireLogin() {
  if (!localStorage.getItem("smartKisanUser")) {
    window.location.href = "login.html";
  }
}

function showUser() {
  const storedUser = localStorage.getItem("smartKisanUser");

  let userName = "Farmer";

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      userName = user.name || "Farmer";
    } catch (error) {
      userName = storedUser;
    }
  }

  document.querySelectorAll("[data-user]").forEach(element => {
    element.textContent = userName;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  showUser();
});