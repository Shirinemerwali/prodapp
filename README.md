# 📋 Productivity Assistant – Din digitala vardagshjälp

## 🧠 Om projektet

**Productivity Assistant** är en webbapplikation byggd för att göra din vardag lite enklare och mer strukturerad. Tanken är enkel: ge dig full koll på dina uppgifter, vanor och händelser på ett ställe, så att du kan fokusera på det som verkligen betyder något.

Under två sprintar utvecklade vi appen med **agila principer**, och resultatet är en produkt som hjälper dig att:

* Hålla koll på dina **todos**
* Följa dina **vanor**
* Planera dina **händelser**

Allt presenteras snyggt på en **dashboard** som ger dig en snabb överblick på dagen som kommer – och ett inspirerande citat för lite extra motivation.

---

## 🚀 Vad appen kan göra

### 🧭 Dashboard

Dashboarden är hjärtat i appen. Här ser du direkt:

* Dina **3 senaste ouppfyllda todos**
* De **3 vanor du gjort flest gånger**
* De **3 närmaste händelserna**
* Ett **slumpat citat** från [dummyjson.com](https://dummyjson.com/quotes/random) – för lite vardagsinspiration

---

### ✅ Todos – Få saker gjorda

* Skapa, redigera och ta bort uppgifter
* Markera dem som slutförda
* Kategorisera, sätt tidsestimat och deadline
* Filtrera och sortera efter status, kategori, deadline eller tidsåtgång

---

### 🔁 Habits – Bygg dina rutiner

* Skapa nya vanor och ta bort gamla
* Håll koll på repetitioner: öka, minska eller nollställ
* Prioritera: låg, mellan eller hög
* Filtrera och sortera vanor efter prioritet eller antal repetitioner

---

### 📅 Events – Alltid på rätt plats vid rätt tid

* Skapa, redigera och ta bort händelser
* Alltid sorterade efter när de inträffar
* Filtrera för att se **kommande** eller **tidigare** händelser

---

### 🧩 Små detaljer som gör skillnad

* Responsiv design som fungerar på alla enheter
* Lokal Express-server som backend – snabb och enkel att köra
* Git-flow med feature branches och PR:er
* Funktioner testades av andra i teamet innan merge

---

## 🛠️ Installation

1. Klona projektet:

```bash
git clone https://github.com/Shirinemerwali/prodapp
```

2. Installera beroenden:

```bash
npm install
```

3. Starta applikationen i två terminaler:

**Terminal 1 — Frontend:**

```bash
npm run dev
```

**Terminal 2 — Backend:**

```bash
node server/index.js
```

4. Öppna i webbläsare:

```
http://localhost:5173
```

> Vite används för frontend, och Express-servern hanterar all data lokalt.

---

## 📁 Projektstruktur

```plaintext
src/
├── assets/           # Ikoner och bilder
├── components/       # Återanvändbara UI-komponenter
├── pages/            # Dashboard, Todos, Habits, Events, Auth
├── utils/            # Hjälpfunktioner (t.ex. localStorage)
├── App.jsx           # Rotkomponent
├── main.jsx          # Entrypoint
├── index.css         # Global CSS

server/
└── index.js          # Express-backend

data/
├── users.db
├── todos.db
├── habits.db
└── events.db
```

---

## 🧪 Testning

Vi tog testning på allvar: varje funktion testades av **en annan teammedlem** än den som byggt den.

* De gjorde git pull och körde appen lokalt
* Verifierade att allt fungerade smidigt
* Pull requests mergades först när allt var godkänt i UI
* I Trello flyttades korten från **In Progress → Ready for Test → Done** efter testning

---

## 🧑‍🤝‍🧑 Så här jobbade vi

* **Agil metodik** – två sprintar
* **Kortare standups** via Discord
* **Retrospektiv** efter varje sprint
* **Trello** för planering och flöde
* **Mobbprogrammering** i början för att få en gemensam kodbas
* **Git-flow** med feature branches och PR-granskning

---

## 👥 Teamet

Projektet utvecklades av tre personer, där alla bidrog till frontend, backend och testning:

* **Shirin** – Frontend (Todos, Habits, Events), UI-logik, komponentstruktur
* **Lily** – Backend (Express, databashantering) + frontend
* **Aisha** – Dashboard, Events, UI-design och vissa backend-funktioner

> Alla var delaktiga i testning, buggrättning, designbeslut och slutlig kvalitetssäkring.