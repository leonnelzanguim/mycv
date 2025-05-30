#!/bin/bash
set -e

# 🕒 Attendre que PostgreSQL soit prêt
until nc -z postgres 5432; do
  echo "⏳ Waiting for PostgreSQL..."
  sleep 2
done

# 🛠️ Générer les migrations si demandé
if [ "$TYPEORM_GENERATE" = "ENABLE" ]; then
  echo "🛠️ Generating migration..."
  npm run typeorm migration:generate src/migrations/initial
fi

# 🚀 Exécuter les migrations si demandé
if [ "$TYPEORM_MIGRATION" = "ENABLE" ]; then
  echo "🚀 Running migrations..."
  npm run migration:run
fi

# ✅ Lancer l'application NestJS
echo "✅ Starting NestJS app..."
exec npm run start:debug
