// main.js — maneja login y carta con el mismo archivo
(function(){
  const form = document.getElementById('login-form');
  const whoSpan = document.getElementById('who');

  // Si estamos en index.html
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('name').value || '').trim();
      // guarda para la siguiente página
      sessionStorage.setItem('loverName', name || 'mi amor');
      // redirige a la carta
      window.location.href = 'letter.html';
    });
    return;
  }

  // Si estamos en letter.html
  if (whoSpan) {
    const name = sessionStorage.getItem('loverName') || 'mi amor';
    whoSpan.textContent = name;

    // Si quieres añadir música elegante más tarde, lo montamos aquí.
    // (lo dejo limpio por ahora para cumplir “empezar de nuevo”)
  }
})();
