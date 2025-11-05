# ===== Transcendence Makefile =====
# Backend: ./api (Fastify/TS/Prisma)
# Front:   ./web (Vite)
# Proxy:   nginx (HTTPS 8443)
# ==================================

SHELL := /bin/bash

PROJECT ?= transcendence
COMPOSE ?= docker compose

API_SERVICE     := api
NGINX_SERVICE   := nginx
WEB_BUILD_SVC   := web-build

PORT            := 8443
CERT_DIR        := certs
CERT_KEY        := $(CERT_DIR)/selfsigned.key
CERT_CRT        := $(CERT_DIR)/selfsigned.crt

ENV_FILE        := api/.env
ENV_EXAMPLE     := api/.env.example

.DEFAULT_GOAL := help

.PHONY: help up down restart ps logs logs-api logs-nginx open curl test-nginx reload-nginx \
        build build-front certs env-init reset clean clean-front clean-api kill-port

# -------- Helpers --------
define hr
	printf "\033[1;36m%s\033[0m\n" "────────────────────────────────────────────────────────"
endef
define ok
	printf "\033[1;32m✔ %s\033[0m\n" "$(1)"
endef
define warn
	printf "\033[1;33m⚠ %s\033[0m\n" "$(1)"
endef
define err
	printf "\033[1;31m✖ %s\033[0m\n" "$(1)"
endef

# -------- Target: help --------
help:
	@echo "Targets:"
	@echo "  make up           → build front (si besoin), certs (si besoin), puis docker compose up -d"
	@echo "  make down         → docker compose down --remove-orphans"
	@echo "  make restart      → restart $(NGINX_SERVICE) et $(API_SERVICE)"
	@echo "  make ps           → afficher l'état des services"
	@echo "  make logs         → logs de tous les services"
	@echo "  make logs-api     → logs de l'API"
	@echo "  make logs-nginx   → logs de Nginx"
	@echo "  make open         → ouvrir https://localhost:$(PORT)"
	@echo "  make curl         → HEAD sur https://localhost:$(PORT)"
	@echo "  make test-nginx   → nginx -t (en conteneur éphémère)"
	@echo "  make reload-nginx → nginx -t puis reload dans le conteneur en cours"
	@echo "  make build        → rebuild images (api, nginx)"
	@echo "  make build-front  → build du front (service web-build ou fallback node:20-bookworm)"
	@echo "  make certs        → générer certs auto-signés (SAN: localhost, 127.0.0.1, *.127.0.0.1.nip.io)"
	@echo "  make env-init     → copier api/.env.example vers api/.env si manquant"
	@echo "  make reset        → down → build-front → up"
	@echo "  make clean        → nettoyer node_modules/dist front & back"
	@echo "  make kill-port    → libérer le port $(PORT) si déjà occupé"

# -------- Guards --------
guard-env:
	@if [ ! -f "$(ENV_FILE)" ]; then \
	  $(call warn,$(ENV_FILE) absent. Exécute: make env-init puis édite les valeurs.); \
	  exit 1; \
	fi

guard-certs:
	@if [ ! -f "$(CERT_CRT)" ] || [ ! -f "$(CERT_KEY)" ]; then \
	  $(call warn,Certificats manquants dans ./certs. Exécute: make certs); \
	  exit 1; \
	fi

guard-port:
	@if ss -ltn | grep -q ":$(PORT) "; then \
	  $(call warn,Le port $(PORT) est occupé. Utilise 'make kill-port' ou change le mapping dans docker-compose.yml); \
	  exit 1; \
	fi

# -------- Main flows --------
up: env-init certs build-front
	$(call hr)
	$(MAKE) guard-env
	@# Ne bloque pas si le port est occupé, mais avertit
	@if ss -ltn | grep -q ":$(PORT) "; then $(call warn,Le port $(PORT) semble occupé, le démarrage de nginx peut échouer.); fi
	$(COMPOSE) up -d --build
	$(call ok,Stack démarrée. Ouvre: https://localhost:$(PORT))

down:
	$(COMPOSE) down --remove-orphans
	$(call ok,Stack stoppée.)

restart:
	$(COMPOSE) restart $(NGINX_SERVICE) $(API_SERVICE)
	$(call ok,Services redémarrés: $(NGINX_SERVICE), $(API_SERVICE))

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f --tail=200

logs-api:
	$(COMPOSE) logs -f --tail=200 $(API_SERVICE)

logs-nginx:
	$(COMPOSE) logs -f --tail=200 $(NGINX_SERVICE)

open:
	@xdg-open "https://localhost:$(PORT)" >/dev/null 2>&1 || \
	 (open "https://localhost:$(PORT)" >/dev/null 2>&1 || true)

curl:
	@curl -kI "https://localhost:$(PORT)" || true

# -------- Nginx tools --------
test-nginx:
	@$(COMPOSE) run --rm $(NGINX_SERVICE) nginx -t

reload-nginx:
	@$(COMPOSE) exec $(NGINX_SERVICE) nginx -t && \
	 $(COMPOSE) exec $(NGINX_SERVICE) nginx -s reload && \
	 $(call ok,Nginx rechargé.)

# -------- Build --------
build:
	$(COMPOSE) build --no-cache
	$(call ok,Images reconstruites.)

build-front:
	$(call hr)
	@echo "→ Build du front (Vite)…"
	@$(COMPOSE) run --rm $(WEB_BUILD_SVC) || \
	docker run --rm -v "$$PWD/web":/web -w /web node:20-bookworm sh -lc "npm ci && npm run build"
	@if [ -f web/dist/index.html ]; then \
		$(call ok,Front build OK (web/dist)); \
	else \
		$(call err,Front build KO (web/dist manquant)); exit 1; \
	fi

# -------- Certs & env --------
certs:
	@mkdir -p "$(CERT_DIR)"
#	@# Génère un cert auto-signé avec SAN adaptés (localhost + nip.io)
	@openssl req -x509 -newkey rsa:2048 -nodes \
	  -keyout "$(CERT_KEY)" -out "$(CERT_CRT)" -days 365 \
	  -subj "/CN=localhost" \
	  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,DNS:front.127.0.0.1.nip.io,DNS:api.127.0.0.1.nip.io" >/dev/null 2>&1 && \
	  chmod 600 "$(CERT_KEY)"
	$(call ok,Certificats générés → $(CERT_CRT) $(CERT_KEY))



env-init:
	@if [ ! -f "$(ENV_FILE)" ] && [ -f "$(ENV_EXAMPLE)" ]; then \
	  cp "$(ENV_EXAMPLE)" "$(ENV_FILE)"; \
	  $(call ok,$(ENV_FILE) créé à partir de $(ENV_EXAMPLE). Pense à éditer les valeurs.); \
	elif [ -f "$(ENV_FILE)" ]; then \
	  $(call ok,$(ENV_FILE) déjà présent.); \
	else \
	  $(call warn,$(ENV_EXAMPLE) introuvable. Crée-le puis relance → make env-init.); \
	fi

# -------- Utilities --------
reset:
	$(MAKE) down
	$(MAKE) build-front
	$(MAKE) up

clean: clean-front clean-api
	$(call ok,Dossiers nettoyés.)

clean-front:
	@rm -rf web/node_modules web/dist
	$(call ok,Front nettoyé (web/node_modules, web/dist).)

clean-api:
	@rm -rf api/node_modules api/dist
	$(call ok,API nettoyée (api/node_modules, api/dist).)

kill-port:
	@echo "→ Recherche d'un conteneur Docker exposant :$(PORT)…"
	@cid="$$(docker ps --format '{{.ID}}\t{{.Ports}}' | awk '/:$(PORT)->/ {print $$1}')" ; \
	if [ -n "$$cid" ]; then \
	  echo "  - Arrêt du conteneur $$cid"; docker stop $$cid >/dev/null; \
	else \
	  echo "→ Recherche d'un process hôte sur :$(PORT)…"; \
	  pid="$$(ss -ltnp | awk '/:$(PORT) / {print $$7}' | sed -E 's/.*pid=([0-9]+).*/\1/' | head -n1)"; \
	  if [ -n "$$pid" ]; then echo "  - kill $$pid"; kill $$pid 2>/dev/null || sudo kill $$pid; else echo "  - rien à tuer"; fi; \
	fi
