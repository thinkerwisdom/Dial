const activityName = document.body.dataset.name || 'Actividad';
const activityColor = document.body.dataset.color || '#6c3cff';
document.documentElement.style.setProperty('--activity-color', activityColor);
document.title = `${activityName} · DIal`;
document.querySelector('[data-activity-name]').textContent = activityName;

function speakActivity() {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const message = new SpeechSynthesisUtterance(activityName);
  message.lang = 'es-CO';
  message.rate = 0.9;
  message.pitch = 1;
  window.speechSynthesis.speak(message);
}

function returnToDial() {
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'dial:back' }, window.location.origin);
  } else {
    window.history.back();
  }
}

window.addEventListener('load', () => window.setTimeout(speakActivity, 180));
document.querySelector('[data-repeat]').addEventListener('click', speakActivity);
document.addEventListener('dblclick', returnToDial);
window.addEventListener('keydown', (event) => {
  if (['Escape', 'Backspace'].includes(event.key)) {
    event.preventDefault();
    returnToDial();
  } else if (['Enter', ' '].includes(event.key)) {
    event.preventDefault();
    speakActivity();
  }
});
