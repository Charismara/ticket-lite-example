# Projekt Layout

- In dem Ordner `src/server/db` findest du die Drizzle Datenbank Konfiguration, die Schema Definitionen und die Relations.
- In dem Ordner `src/server/actions` findest du die Server Actions für die Datenbank Interaktionen.
- In dem Ordner `src/client/requests` findest du die Hooks für die Datenbank Abfragen.

## Allgemeine Regeln

1. Erstelle für Datenbank interaktionen Server Actions in der entsprechenden .ts Datei unter `src/server/actions/`
2. Verwende keine interfaces, sondern types für Typdefinitionen.
3. Erstelle für jede Server Action ebenfalls einen Route Handler.
4. Erstelle für abfragen eine useQuery hook in der entsprechenden .ts Datei unter `src/client/requests/`
5. Verwende, falls nötig, `bun run typecheck` um den Code auf Typfehler zu überprüfen.
6. Schreibe sauberen und gut strukturierten Code.
7. Achte auf eine konsistente Benennungskonvention.
8. Verwende für Server Actions die Typen von Drizzle. 
9. Verwende bei den Route Handlern den `RouteContext` Type für den entsprechenden Route Handler.
10. Führe nach Änderungen innerhalb von `src/server/db` immer `bun run db:push` aus, um die Datenbank anzupassen.


### Code Beispiele

Callback Funktionen in Type Definitions:
```typescript
// Bad
type ExampleType = {
    onHide: () => void;
};

// Good
type ExampleType = {
    onHide(): void;
};
```
