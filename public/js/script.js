console.log("Front script");

// Common variables

const activeStages = [];
const activeDates = [];

//Helpers

const validateEmail = (mail) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);

const getYearUrl = (e) => {
  const year =
    document.getElementById("selYear").selectedOptions[0].value ||
    document.getElementById("current-year").innerHTML.trim();
  url = `/year/${year}`;
  return url;
};

// Shows
const showFilteredEvents = () => {
  let stages = [];
  let days = [];
  if (activeStages.length) {
    stages = activeStages.map((el) => document.getElementById(el).innerText);
  } else {
    const items = document.getElementById("stages").childNodes;
    items.forEach((el) => {
      if (el.className && el.className.includes("items"))
        stages.push(document.getElementById(el.id).innerText);
    });
  }
  if (activeDates.length) {
    days = activeDates.map(
      (el) => document.getElementById(el).innerText.split(" ")[0]
    );
  } else {
    const items = document.getElementById("dates").childNodes;
    items.forEach((el) => {
      if (el.className && el.className.includes("items")) {
        days.push(document.getElementById(el.id).innerText.split(" ")[0]);
      }
    });
  }

  const items = document.getElementById("right-container").childNodes;
  items.forEach((el) => {
    if (el.className && el.className.includes("items")) {
      const data = JSON.parse(document.getElementById(el.id).dataset.events);
      const date = new Date(data.Startdate).getDate();
      document.getElementById(el.id).classList.add("hidden");

      if (stages.indexOf(data.Name) != -1 && days.indexOf(`${date}`) != -1)
        document.getElementById(el.id).classList.remove("hidden");
    }
  });
};

// Listeners

const listHandler = (e) => {
  url = getYearUrl();
  console.log(url);
  window.location.href = url;
};

const datesHandler = (e) => {
  if (!e.target.id) return;
  dateDiv = document.getElementById(e.target.id);
  if (activeDates.indexOf(e.target.id) == -1) {
    dateDiv.classList.add("active");
    activeDates.push(e.target.id);
  } else {
    dateDiv.classList.remove("active");
    activeDates.splice(activeDates.indexOf(e.target.id), 1);
  }
  showFilteredEvents();
};

const stagesHandler = (e) => {
  if (!e.target.id) return;
  stageDiv = document.getElementById(e.target.id);
  if (activeStages.indexOf(e.target.id) == -1) {
    stageDiv.classList.add("active");
    activeStages.push(e.target.id);
  } else {
    stageDiv.classList.remove("active");
    activeStages.splice(activeStages.indexOf(e.target.id), 1);
  }
  showFilteredEvents();
};

const menuHandler = (e) => {
  const year = document.getElementById("current-year").innerHTML.trim();
  const field = e.target.id;
  if (["faq", "contact", "about"].indexOf(field) == -1) return;
  url = `/${field}?year=${year}`;
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
    request.onload = () => {
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

const cont_dates = document.getElementById("dates");
if (cont_dates) cont_dates.addEventListener("click", datesHandler);

const cont_stages = document.getElementById("stages");
if (cont_stages) cont_stages.addEventListener("click", stagesHandler);

document.getElementById("menu").addEventListener("click", menuHandler);

const contactSubmit = document.getElementById("submit");
if (contactSubmit) contactSubmit.addEventListener("click", sendMessageHandler);
