document.addEventListener('DOMContentLoaded', function() {
  const clearBtn = document.getElementById('clearCity');
  const cityInput = document.getElementById('cityInput');
  if (clearBtn && cityInput) {
    clearBtn.addEventListener('click', function(){
      cityInput.value = '';
      cityInput.focus();
    });
  }
});


const btn = document.getElementById('helpBtn');
const panel =document.getElementById('helpPanel');
const closeHelp = document.getElementById('closeHelp');

function togglePanel() {
  panel.classList.remove('hidden');
  btn.setAttribute('aria-expanded', 'true');
  panel.querySelector('buttton').focus();
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
closeHelp.addEventListener('click', closePanel);
