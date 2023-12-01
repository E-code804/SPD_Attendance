import names from "./names.js";

// Adding autocomplete to index.html
const datalist = document.querySelector("#names");
names.forEach((name) => {
  const newOption = document.createElement("option");
  newOption.value = name;
  datalist.appendChild(newOption);
});

document.getElementById("form").onsubmit = function (event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Check if the form has the correct ID
  const form = document.getElementById("form");
  if (!form) {
    console.error("Form with ID 'form' not found.");
    return false;
  }

  const currentDate = new Date().toISOString().split("T")[0];
  const oldDate = localStorage.getItem("date");

  if (!(currentDate === oldDate)) {
    // Allow the form to submit
    alert("You have successfully submitted your attendance!");
    localStorage.setItem("date", currentDate);
    form.submit();
  } else {
    alert("You naughty boy, you already submitted!");
    // Prevent the form from submitting
    return false;
  }
};
