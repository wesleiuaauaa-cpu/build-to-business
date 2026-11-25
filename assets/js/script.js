/* ============================================================
   BUILD TO BUSINESS — interações
   - carrossel de projetos (troca automática a cada 10s)
   - reveal on scroll, header scrolled, menu mobile
   - contadores animados, FABs, tilt do avatar
   ============================================================ */
(() => {
  "use strict";

  /* ---------- marquee: duplica o grupo para loop infinito ---------- */
  document.querySelectorAll(".marquee-track").forEach((track) => {
    const group = track.querySelector(".marquee-group");
    if (group) track.appendChild(group.cloneNode(true));
  });

  /* ---------- header scrolled ---------- */
  const header = document.getElementById("siteHeader");
  const backToTop = document.getElementById("backToTop");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
    backToTop.classList.toggle("visible", window.scrollY > 700);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ---------- menu mobile ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  mainNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      mainNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- assinatura: draw quando visível ---------- */
  const flourishes = document.querySelectorAll(".signature-flourish");
  const sigObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("drawn");
          sigObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  flourishes.forEach((f) => sigObserver.observe(f));

  /* ---------- contadores animados ---------- */
  const counters = document.querySelectorAll(".metric-value");
  const fmt = (n, sep) => n.toLocaleString("pt-BR");
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        countObserver.unobserve(el);
        const target = parseInt(el.dataset.count, 10);
        const prefix = el.dataset.prefix || "";
        const dur = 1600;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + fmt(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => countObserver.observe(c));

  /* ---------- tilt 3D do avatar ---------- */
  const avatarCard = document.getElementById("avatarCard");
  if (avatarCard && matchMedia("(pointer: fine)").matches) {
    const wrap = avatarCard.parentElement;
    wrap.addEventListener("mousemove", (e) => {
      const r = avatarCard.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      avatarCard.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
    });
    wrap.addEventListener("mouseleave", () => {
      avatarCard.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
    });
  }

  /* ---------- carrossel de projetos: troca a cada 10s ---------- */
  const slides = [...document.querySelectorAll(".project-slide")];
  const dotsWrap = document.getElementById("showcaseDots");
  const prevBtn = document.getElementById("prevProject");
  const nextBtn = document.getElementById("nextProject");
  const progressBar = document.getElementById("progressBar");
  const counterEl = document.getElementById("currentIdx");
  const INTERVAL = 10000;
  let index = 0;
  let timer = null;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Ver projeto ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];

  function render(prev) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active", "leaving");
      if (i === index) slide.classList.add("active");
      else if (i === prev) slide.classList.add("leaving");
    });
    dots.forEach((d, i) => {
      d.classList.toggle("active", i === index);
      d.setAttribute("aria-selected", String(i === index));
    });
    counterEl.textContent = index + 1;

    /* reinicia a barra de progresso de 10s */
    progressBar.classList.remove("run");
    void progressBar.offsetWidth;
    progressBar.classList.add("run");
  }

  function goTo(i, manual = false) {
    const prev = index;
    index = (i + slides.length) % slides.length;
    render(prev);
    restart();
  }

  function next() {
    const prev = index;
    index = (index + 1) % slides.length;
    render(prev);
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }
  restart();

  nextBtn.addEventListener("click", () => goTo(index + 1, true));
  prevBtn.addEventListener("click", () => goTo(index - 1, true));

  const showcase = document.getElementById("projectShowcase");
  showcase.addEventListener("mouseenter", () => clearInterval(timer));
  showcase.addEventListener("mouseleave", restart);

  /* pausa quando fora da viewport (economia e sync) */
  const showcaseObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { if (!timer) restart(); }
        else { clearInterval(timer); timer = null; }
      });
    },
    { threshold: 0.2 }
  );
  showcaseObserver.observe(showcase);

  /* ---------- botões magnéticos ---------- */
  if (matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.14}px, ${y * 0.2}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------- toast WhatsApp (aparece 1x após 8s) ---------- */
  const toast = document.getElementById("waToast");
  const toastSeen = "b2b_wa_toast_seen";
  try {
    if (sessionStorage.getItem(toastSeen)) {
      sessionStorage.setItem(toastSeen, "1"); // no refetch
    }
    setTimeout(() => {
      if (sessionStorage.getItem(toastSeen)) return;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 9000);
      sessionStorage.setItem(toastSeen, "1");
    }, 8000);
  } catch (_) {
    setTimeout(() => toast.classList.add("show"), 8000);
    setTimeout(() => toast.classList.remove("show"), 9000 + 8000);
  }
  document.getElementById("waToastClose").addEventListener("click", () =>
    toast.classList.remove("show")
  );
})();
