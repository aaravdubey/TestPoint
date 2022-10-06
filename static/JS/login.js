setTimeout(() => {
  const box = document.getElementById('box');

  // 👇️ removes element from DOM
  // box.style.display = 'none';

  // 👇️ hides element (still takes up space on page)
  box.style.visibility = 'hidden';
}, 3000);


const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const sign_in_btnorg = document.querySelector("#sign-in-btn1");
const sign_up_btnorg = document.querySelector("#sign-up-btn1");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

sign_up_btnorg.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btnorg.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

function confirmPassFunc() {
  let pass = document.getElementById('pass').value;
  let confirmPass = document.getElementById('confirmPass').value;

  console.log(pass + confirmPass);
  if (pass != confirmPass) {
    document.getElementById('errorMssg').style.visibility = "visible";
  } else {
    document.getElementById('errorMssg').style.visibility = "hidden";
  }

}


