# Schulclub Impressum

Ein browserbasierter Generator für ein Zug-Layout im Schulmagazin-Impressum.

## Funktionen

- Beliebig viele klassische Zugwagons, drei nebeneinander
- Bis zu zwei Personen pro Wagon
- Namen, Aufgaben und optionale Profilbilder
- Individuelle Wagonfarbe
- Live-Vorschau und SVG-Export
- Fotos werden lokal im Browser verarbeitet und nicht hochgeladen

## Verwendung

Die `index.html` direkt über GitHub Pages oder einen lokalen statischen Webserver öffnen. Es werden keine Build-Schritte oder npm-Pakete benötigt.

## Verzeichnisstruktur

- `index.html` – Oberfläche und Eingabevorlagen
- `src/main.css` – globale Schriftdefinition
- `src/css/impressum.css` – Gestaltung der Oberfläche
- `src/js/Impressum.js` – Editor und SVG-Generierung
