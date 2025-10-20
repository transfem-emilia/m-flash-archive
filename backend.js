/*
  Mobile-only Ruffle integration for mobile.flash.northpoint.website
  - Redirects desktop users to main site
  - Opens games in new fullscreen tab
  - Optimized for mobile devices
*/

(function() {
  const RUFFLE_CDN = "https://unpkg.com/@ruffle-rs/ruffle";
  const LOCAL_RUFFLE = "/ruffle/ruffle.js";

  // Redirect desktop to main site
  const isMobile = /\b(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)\b/i.test(navigator.userAgent);
  if (!isMobile) {
    window.location.href = "https://flash.northpoint.website/";
    return;
  }

  // Inject Ruffle script tag (prefers local, falls back to CDN)
  function loadRuffleScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.addEventListener('load', resolve);
      script.addEventListener('error', () => reject(new Error(`Failed to load Ruffle script: ${src}`)));
      document.head.appendChild(script);
    });
  }

  // Wait for DOM + Ruffle
  document.addEventListener('DOMContentLoaded', async () => {
    let usingCDN = false;
    try {
      await loadRuffleScript(LOCAL_RUFFLE);
    } catch {
      console.warn('Local Ruffle failed, falling back to CDN');
      await loadRuffleScript(RUFFLE_CDN);
      usingCDN = true;
    }

    // Global configuration
    window.RufflePlayer = window.RufflePlayer || {};
    window.RufflePlayer.config = {
      publicPath: usingCDN ? 'https://unpkg.com/@ruffle-rs/ruffle/' : '/ruffle/',
      polyfills: true,
      allowScriptAccess: false,
      autoplay: 'auto',
      unmuteOverlay: 'visible',
      scale: 'showAll',
      allowFullscreen: true,
      logLevel: 'info',
    };

    // Game list
    const games = [
        { name: "Candy Crush (The Original)", file: "candyc.swf" },
        { name: "Jacksmith", file: "jacksmith.swf" },
        { name: "Papa's Bakeria", file: "papasbakeria.swf" },
        { name: "Papa's Burgeria", file: "papasburgeria.swf" },
        { name: "Papa's Cheeseria", file: "papascheeseria_102.swf" },
        { name: "Papa's Cupcakeria", file: "papascupcakeria.swf" },
        { name: "Papa's Donuteria", file: "papasdonuteria.swf" },
        { name: "Papa's Freezeria", file: "papasfreezeria.swf" },
        { name: "Papa's Hot Doggeria", file: "papashotdoggeria.swf" },
        { name: "Papa's Pancakeria", file: "papaspancakeria.swf" },
        { name: "Papa's Pastaria", file: "papaspastaria.swf" },
        { name: "Papa's Pizzeria", file: "papaspizzeria_v2.swf" },
        { name: "Papa's Scooperia", file: "papasscooperia_v102.swf" },
        { name: "Papa's Sushiria", file: "papassushiria.swf" },
        { name: "Papa's Taco Mia", file: "papastacomia.swf" },
        { name: "Papa's Wingeria", file: "papaswingeria.swf" }
    ];

    const btns = document.querySelector('.buttons');

    // Build mobile dropdown
    const select = document.createElement('select');
    select.id = 'gameSelect';
    select.style.margin = '1em auto';
    select.style.display = 'block';
    select.style.padding = '12px';
    select.style.fontSize = '16px';
    select.style.width = '90%';
    select.style.maxWidth = '400px';
    select.innerHTML = `<option value="">-- Select a Game to Play --</option>`;

    games.forEach(({ name, file }) => {
      const opt = document.createElement('option');
      opt.value = file;
      opt.textContent = name;
      select.appendChild(opt);
    });

    select.addEventListener('change', () => {
      if (select.value) {
        // Open in new tab with game parameter
        window.open(`/player.html?game=${encodeURIComponent(select.value)}`, '_blank');
        // Reset dropdown
        select.value = '';
      }
    });

    // Add dropdown to page
    btns.appendChild(select);
  });
})();