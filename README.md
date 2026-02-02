# Ticket Lite Next.js Example

Tools:

- [Bun](https://bun.sh) (Package Manager)
- [Next.js](https://nextjs.org) (Web-Framework)
- [Drizzle](https://orm.drizzle.team) (ORM)

## Setup

1. Installiere `bun` von https://bun.sh
2. Führe `bun install` aus, um die Abhängigkeiten zu installieren
3. Führe `bun run db:push` aus, um die Datenbank zu initialisieren
4. Starte die Entwicklungsumgebung mit `bun run dev`

## Projektstruktur

- `src/app`: Enthält die Next.js App-Routen und Seiten
    - `layout.tsx` Dateien definieren ein gemeinsames Layout für die Seiten unterhalb des Verzeichnisses
    - `page.tsx` Dateien definieren die Hauptinhalte der Seiten
    - `route.ts` Dateien definieren API-Routen
- `src/server/db`: Enthält die Datenbankkonfiguration und -modelle
    - `schema.ts`: Definiert die Tabellen und Spalten der Datenbank
    - `relations.ts`: Definiert die Beziehungen zwischen den Tabellen
    - `index.ts`: Initialisiert die Datenbankverbindung mit Drizzle ORM
- `src/server/actions`: Enthält serverseitige Aktionen zur Interaktion mit der Datenbank
    - Diese Aktionen werden genutzt, um die Funktionen von API-Routen und Frontend Seiten basierend auf einer implementierten Logik bereitzustellen ohne dabei das "Infered Typing"
      im Frontend zu verlieren.
