// web/src/main.ts

import { renderRoute } from "./router";
import { initGoose3D } from "./goose3d";

function bootstrap() {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) {
    console.error("#app container not found");
    return;
  }

  // Lancer l’oie une fois au démarrage
  initGoose3D();

  // Première route
  renderRoute(window.location.pathname);

  // Gestion des boutons back/forward
  window.addEventListener("popstate", () => {
    renderRoute(window.location.pathname);
  });

  // Navigation interne via <a data-nav>
  document.body.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const link = target.closest("a[data-nav]") as HTMLAnchorElement | null;
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    event.preventDefault();
    window.history.pushState({}, "", href);
    renderRoute(href);
  });
}

bootstrap();

