# MarathonDiary-Frontend

Eine Vue.js-Anwendung zum Verfolgen und Verwalten von Marathontrainingseinheiten.

## Projektbeschreibung

MarathonDiary ist eine Webanwendung, die Läufern hilft, ihre Trainingseinheiten für Marathons zu verfolgen und zu analysieren. Die Anwendung ermöglicht es Benutzern, Trainingsziele zu setzen, tatsächliche Leistungen zu erfassen und den Fortschritt über Zeit zu verfolgen.

## Funktionen

- **Trainingseinträge erstellen**: Setzen Sie Ziele für Zeit und Distanz und erfassen Sie Ihre tatsächlichen Laufleistungen
- **Trainingsübersicht**: Sehen Sie alle Ihre Trainingseinheiten in einer übersichtlichen Liste
- **Filterung und Sortierung**: Filtern Sie Einträge nach erreichten Zielen und sortieren Sie nach Datum
- **Bearbeiten und Löschen**: Verwalten Sie Ihre Trainingseinträge nach Bedarf
- **Statistiken**: Sehen Sie Ihre Gesamtleistung, einschließlich:
  - Durchschnittliche Laufzeit
  - Gesamte gelaufene Distanz
  - Anzahl der Trainingseinheiten
  - Prozentualer Anteil der erreichten Ziele

## Technologien

- **Frontend**: Vue.js 3, TypeScript
- **Build-Tool**: Vite
- **HTTP-Client**: Axios
- **Routing**: Vue Router
- **Testing**: Vitest (Unit Tests), Cypress (E2E Tests)

## Voraussetzungen

- Node.js (empfohlen: neueste LTS-Version)
- npm oder yarn
- Backend-Service (läuft standardmäßig auf http://localhost:8080)

## Installation und Setup

1. Klonen Sie das Repository:
   ```sh
   git clone https://github.com/yourusername/MarathonDiary-frontend.git
   cd MarathonDiary-frontend
   ```

2. Installieren Sie die Abhängigkeiten:
   ```sh
   npm install
   ```

3. Konfigurieren Sie die Backend-URL (optional):
   - Die Standard-Backend-URL ist `http://localhost:8080`
   - Um sie zu ändern, passen Sie die `.env`-Datei an:
     ```
     VITE_BACKEND_URL=http://your-backend-url
     ```

## Entwicklung

Starten Sie den Entwicklungsserver:
```sh
npm run dev
```

Die Anwendung ist dann unter http://localhost:5173 verfügbar (oder einem anderen Port, falls 5173 bereits belegt ist).

### Empfohlene IDE-Einrichtung

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (und deaktivieren Sie Vetur).

## Produktion

Erstellen Sie eine produktionsreife Version:
```sh
npm run build
```

Die kompilierten Dateien werden im `dist`-Verzeichnis abgelegt und können auf einem Webserver bereitgestellt werden.

## Tests

### Unit Tests

```sh
npm run test:unit
```

### End-to-End Tests

Entwicklungsserver:
```sh
npm run test:e2e:dev
```

Produktionsversion:
```sh
npm run build
npm run test:e2e
```

## Projektstruktur

- `src/`: Quellcode der Anwendung
  - `components/`: Vue-Komponenten
  - `assets/`: Statische Ressourcen (CSS, Bilder)
  - `router/`: Vue Router Konfiguration
- `tests/`: Test-Dateien
- `public/`: Statische Dateien, die unverändert kopiert werden
- `dist/`: Kompilierte Dateien (nach dem Build)

## Lizenz

[MIT](LICENSE)