# La Rete del Borgo - Centro Commerciale Virtuale

Un centro commerciale virtuale moderno che trasforma la scoperta delle attività locali in un'esperienza immersiva e coinvolgente.

## 🚀 Funzionalità Principali

### MVP (Fase 1)
- **Mappa Interattiva**: Visualizzazione delle attività su Google Maps con geolocalizzazione
- **Profili Dettagliati**: Ogni attività ha foto, descrizioni, recensioni e contatti diretti
- **Ricerca Avanzata**: Filtri per categoria e ricerca testuale
- **Geolocalizzazione**: Ordinamento per distanza e indicazioni stradali
- **Design Responsive**: Ottimizzato per mobile e desktop

### Funzionalità Attuali
- ✅ Vista mappa con Google Maps integrato
- ✅ Vista griglia con cards eleganti
- ✅ Geolocalizzazione utente
- ✅ Calcolo distanze e ordinamento
- ✅ Indicazioni stradali integrate
- ✅ Contatti diretti (telefono, WhatsApp)
- ✅ Sistema di categorie con filtri
- ✅ Modal dettagli attività
- ✅ Design premium con animazioni

## 🛠️ Setup Tecnico

### Credenziali Manager
Per modificare le credenziali Manager, editare il file `src/hooks/useAuth.ts`:
```javascript
const MANAGER_USERNAME = 'manager';
const MANAGER_PASSWORD = 'manager2025@'; // Modificabile qui
```

### Prerequisiti
1. **Google Maps API Key**: 
   - Vai su [Google Cloud Console](https://console.cloud.google.com/)
   - Abilita le API: Maps JavaScript API, Places API
   - Crea una API key e sostituisci `YOUR_GOOGLE_MAPS_API_KEY` nel codice

### Installazione
```bash
npm install
npm run dev
```

### Configurazione Google Maps
1. Sostituisci `YOUR_API_KEY` in `index.html` con la tua Google Maps API key
2. Sostituisci `YOUR_GOOGLE_MAPS_API_KEY` in `src/components/GoogleMap.tsx`

## 📱 Funzionalità Implementate

### Geolocalizzazione
- Richiesta automatica permessi di localizzazione
- Indicatore stato posizione nell'header
- Ordinamento attività per distanza
- Calcolo distanze precise con formula haversine

### Google Maps
- Mappa interattiva con marker personalizzati
- Info window con dettagli attività
- Controlli per centrare sulla posizione utente
- Stili mappa personalizzati per nascondere POI non rilevanti

### UX/UI
- Design mobile-first responsive
- Animazioni fluide e micro-interazioni
- Sistema di colori coerente
- Tipografia ottimizzata per leggibilità

## 🎯 Roadmap Futuro

### Fase 2 - Esperienza Immersiva
- [ ] Sistema di abbonamenti multi-livello
- [ ] Dashboard negozianti
- [ ] Sistema di prenotazioni integrato
- [ ] Chat in-app
- [ ] Tour virtuali 360°
- [ ] Eventi digitali condivisi

### Fase 3 - Multiverso 3D
- [ ] Ambiente 3D navigabile
- [ ] Avatar personalizzabili
- [ ] Eventi virtuali live
- [ ] Programma fedeltà gamificato

## 🏗️ Architettura

```
src/
├── components/          # Componenti riutilizzabili
│   ├── GoogleMap.tsx   # Integrazione Google Maps
│   ├── BusinessCard.tsx # Card attività
│   └── LocationPermissionBanner.tsx
├── hooks/              # Custom hooks
│   └── useGeolocation.ts
├── types/              # Definizioni TypeScript
│   └── index.ts
├── utils/              # Utility functions
│   └── directions.ts
└── App.tsx            # Componente principale
```

## 🎨 Design System

- **Colori Primari**: Blu (#2563eb), Verde (#059669), Oro (#d97706)
- **Spacing**: Sistema basato su multipli di 8px
- **Tipografia**: Gerarchia chiara con line-height ottimizzato
- **Animazioni**: Transizioni fluide e micro-interazioni

## 📊 Metriche Target

- **Copertura**: 30% delle attività locali nel primo paese
- **Engagement**: Tempo medio sessione > 3 minuti
- **Conversioni**: Click-to-contact rate > 15%
- **Retention**: Ritorno utenti settimanale > 40%