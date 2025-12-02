document.addEventListener("DOMContentLoaded", () =>{
    const form = document.getElementById("saveProfile");
    const inputs = form.querySelectorAll("input[required]");

    form.addEventListener("submit", function(f) {
        let isValid = true;
        inputs.forEach(input => {
            if( input.value.trim() === ""){
                isValid = false;
            }
        });
        if(!isValid){
            f.preventDefault();
        }
    });
});

const btn = document.getElementById('accountButtonID');
const panel =document.getElementById('accountPanel');
const closeP = document.getElementById('closePanel');

function togglePanel() {
  panel.classList.remove('hidden');
  btn.setAttribute('aria-expanded', 'true');
  panel.querySelector('closePanel').focus();
}

function closePanel() {
  panel.classList.add('hidden');
  btn.setAttribute('aria-expanded', 'false');
  btn.focus();
}

btn.addEventListener('click', () => {
  const isOpen = btn.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closePanel();
  } else {
    togglePanel();
  }
});
closeP.addEventListener('click', closePanel);


const btnLogout = document.getElementById('logoutPopUpButton');
const panelLogout =document.getElementById('logoutPopUp');
const closeLogout= document.getElementById('exitButton');

function togglePanelLogout() {
  panelLogout.classList.remove('hidden');
  btnLogout.setAttribute('aria-expanded', 'true');
  panelLogout.querySelector('exitButton').focus();
}

function closePanelLogout() {
  panelLogout.classList.add('hidden');
  btnLogout.setAttribute('aria-expanded', 'false');
  btnLogout.focus();
}

btnLogout.addEventListener('click', () => {
  const isOpen = btnLogout.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closePanelLogout();
  } else {
    togglePanelLogout();
  }
});
closeLogout.addEventListener('click', closePanelLogout);