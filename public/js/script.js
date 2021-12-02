console.log("Front script");
// const locations = JSON.parse(document.getElementById('map').dataset.locations);
//Helpers

const validateEmail = (mail) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);

const getYearUrl = () => {
  const year = document.getElementById("current-year").innerHTML.trim();
  console.log(year);
  url = `/year/${year}`;
  console.log(url);
  return url;
};

// Listeners

const listHandler = () => {
  url = getYearUrl();
  window.location.href = url;
};

const containerHandler = (e) => {
  console.log("Clicked");
  console.log(e.target.id);
  document.getElementById(e.target.id).classList.add("active");
};

const contactHandler = () => {
  year = document.getElementById("current-year").innerHTML.trim();
  url = `/contact/${year}`;
  window.location.href = url;
};

const sendMessageHandler = (e) => {
  e.preventDefault();
  const status = document.getElementById("status");
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  // checks
  status.classList.add("invalid");
  document.getElementById("name-status").innerHTML = "";
  document.getElementById("email-status").innerHTML = "";
  document.getElementById("msg-status").innerHTML = "";
  status.innerHTML = "";
  if (!name) {
    document.getElementById("name-status").innerHTML =
      "You have to provide your name.";
  } else if (!validateEmail(email)) {
    document.getElementById("email-status").innerHTML =
      "You have to provide valid e-mail.";
  } else if (!message && message.length < 10) {
    document.getElementById("msg-status").innerHTML =
      "Please enter your message.";
  } else {
    const request = new XMLHttpRequest();

    request.open("POST", "/api/v1/contact", true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onload = function () {
      // do something to response
      status.classList.add("valid");
      status.innerHTML = "The message have been sent.";
      console.log(this.responseText);
      setTimeout(() => {
        url = getYearUrl();
        window.location.href = url;
      }, 2000);
    };
    request.send(JSON.stringify({ name, email, message }));
  }
};

document.getElementById("selYear").addEventListener("change", listHandler);

const cont = document.getElementById("element-container");
if (cont) cont.addEventListener("click", containerHandler);

document.getElementById("contact").addEventListener("click", contactHandler);

const contactSubmit = document.getElementById("submit");
if (contactSubmit) contactSubmit.addEventListener("click", sendMessageHandler);
