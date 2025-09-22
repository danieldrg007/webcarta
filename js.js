// Medianoche: estrellas + reveal lento por etapas (sin cambiar fondo)
(function () {
  // 1) Poner el nombre en #who desde sessionStorage o ?name=
  try {
    const el = document.getElementById("who");
    if (el) {
      const byQuery = new URLSearchParams(location.search).get("name");
      const bySession = (typeof sessionStorage !== "undefined")
        ? sessionStorage.getItem("loverName")
        : null;
      const who = byQuery || bySession;
      if (who && String(who).trim()) el.textContent = who.trim();
    }
  } catch {}

  // 2) Fondo de estrellas (canvas)
  const canvas = document.getElementById("stars");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w, h, stars;

    function resize() {
      // Asegura que el canvas ocupe el tamaño del contenedor
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      spawnStars();
    }

    function spawnStars() {
      const count = Math.floor((w * h) / 14000); // densidad moderada
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        a0: Math.random() * 0.5 + 0.25,
        tw: Math.random() * 0.02 + 0.005,
        t: Math.random() * Math.PI * 2
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.t += s.tw;
        const alpha = s.a0 + Math.sin(s.t) * 0.25;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();
  }

  // 3) Reveal por etapas (solo después de pulsar "Leer más", y más lento)
  const paras = Array.from(document.querySelectorAll(".reveal"));
  const revealBtn = document.getElementById("revealBtn");
  const mediaReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let idx = 0;
  function showNext() {
    if (idx >= paras.length) return false;
    const p = paras[idx];
    p.classList.add("show");
    idx++;

    // Opcional: auto-scroll suave hacia el párrafo que aparece
    try {
      p.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch {}

    return idx < paras.length;
  }

  if (mediaReduce) {
    // Accesibilidad: sin animaciones, mostrar todo
    paras.forEach(p => p.classList.add("show"));
    if (revealBtn) revealBtn.disabled = true;
  } else if (revealBtn) {
    // No mostramos nada hasta que el usuario pulse "Leer más"
    revealBtn.addEventListener("click", () => {
      if (revealBtn.disabled) return;
      revealBtn.textContent = "Leyendo…";
      revealBtn.setAttribute("aria-busy", "true");

      // Muestra el primero inmediatamente...
      showNext();

      // ...y el resto cada 2.8s (más lento)
      const timer = setInterval(() => {
        const more = showNext();
        if (!more) {
          clearInterval(timer);
          revealBtn.textContent = "Listo";
          revealBtn.disabled = true;
          revealBtn.removeAttribute("aria-busy");
        }
      }, 2800);
    });
  }

  // 4) Se eliminó por completo la lógica de "Cambiar fondo"
})();
