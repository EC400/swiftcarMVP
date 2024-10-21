
// Firebase SDK Imports für Firestore
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
  import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";


  const firebaseConfig = {
    apiKey: "AIzaSyCrFFSDvDjZpe2g5xW6toMfRM88HyAsBng",
    authDomain: "website01-1b00d.firebaseapp.com",
    databaseURL: "https://website01-1b00d-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "website01-1b00d",
    storageBucket: "website01-1b00d.appspot.com",
    messagingSenderId: "80969955239",
    appId: "1:80969955239:web:6f82381b817b4138b6e882",
    measurementId: "G-M0JNFXWKVQ"
  };

  // Firebase initialisieren
  const app = initializeApp(firebaseConfig);
  // Firestore durch Realtime Database ersetzen
  const db = getDatabase(app);  // Realtime Database initialisieren


  // Modal-Sachen
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const hinzufügenBtn = document.getElementById('hinzufügenBtn');
  const modal = document.getElementById('modal');
  const overlay = document.getElementById('overlay');
  const tabelleBody = document.getElementById('tabelleBody');

  let aktuelleAuftragId = 1;

  // Modal öffnen
  openModalBtn.addEventListener('click', function() {
    modal.classList.add('active');
    overlay.classList.add('active');
  });

  // Modal schließen
  closeModalBtn.addEventListener('click', function() {
    modal.classList.remove('active');
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', function() {
    modal.classList.remove('active');
    overlay.classList.remove('active');
  });

  // Hinzufügen-Button klicken
  hinzufügenBtn.addEventListener('click', async function() {
    // Werte aus den Feldern holen
    const auftragId = aktuelleAuftragId;
    const abholzeit = document.getElementById('abholzeit-field').value;
    const startort = document.getElementById('startort-field').value;
    const abgabezeit = document.getElementById('abgabezeit-field').value;
    const abgabeort = document.getElementById('abgabeort-field').value;
    const strecke = document.getElementById('strecke-field').value;
    const auftraggeber = document.getElementById('auftraggeber-field').value;
    const preis = document.getElementById('preis-field').value;

    // Prüfen, ob alle Felder ausgefüllt sind
    if (abholzeit && startort && abgabezeit && abgabeort && strecke && auftraggeber && preis) {
      console.log("Alle Felder ausgefüllt. Versuche, Daten in Firestore zu speichern...");

      // Versuche, die Daten in Firestore zu speichern
      try {
        await speichereFahrtauftrag(auftragId, abholzeit, startort, abgabezeit, abgabeort, strecke, auftraggeber, preis);
        console.log("Fahrtauftrag erfolgreich gespeichert.");

        aktuelleAuftragId ++;

        // Modal schließen
        modal.classList.remove('active');
        overlay.classList.remove('active');

        // Formularfelder leeren
        document.getElementById('abholzeit-field').value = '';
        document.getElementById('startort-field').value = '';
        document.getElementById('abgabezeit-field').value = '';
        document.getElementById('abgabeort-field').value = '';
        document.getElementById('strecke-field').value = '';
        document.getElementById('auftraggeber-field').value = '';
        document.getElementById('preis-field').value = '';
      } catch (error) {
        console.error("Fehler beim Speichern des Fahrtauftrags: ", error);
        alert("Fehler beim Speichern des Fahrtauftrags. Bitte überprüfe die Konsole für weitere Details.");
      }

    } else {
      alert("Bitte fülle alle Felder aus.");
    }
  });

  function speichereFahrtauftrag(auftragId, abholzeit, startort, abgabezeit, abgabeort, strecke, auftraggeber, preis) {
    try {
      const fahrtauftrag = {
        auftragId: auftragId,
        abholzeit: abholzeit,
        startort: startort,
        abgabezeit: abgabezeit,
        abgabeort: abgabeort,
        strecke: strecke,
        auftraggeber: auftraggeber,
        preis: preis
      };
  
      // Realtime Database Referenz zur "fahrtaufträge"-Pfad
      const fahrtaufträgeRef = ref(db, "fahrtaufträge");
  
      // Daten in die Realtime Database speichern
      const newFahrtauftragRef = push(fahrtaufträgeRef);
      set(newFahrtauftragRef, fahrtauftrag)
        .then(() => {
          console.log('Neuer Fahrtauftrag wurde erfolgreich gespeichert.');
        })
        .catch((error) => {
          console.error('Fehler beim Speichern des Fahrtauftrags: ', error);
        });
    } catch (error) {
      console.error("Fehler beim Speichern: ", error);
    }
  }
  



// Abrufen und Anzeigen der Fahrtaufträge aus der Realtime Database
function ladeFahrtaufträge() {
  const fahrtaufträgeRef = ref(db, 'fahrtaufträge');

  // Abrufen der Daten in Echtzeit
  onValue(fahrtaufträgeRef, (snapshot) => {
    tabelleBody.innerHTML = ''; // Tabelle leeren, bevor neue Daten hinzugefügt werden
    snapshot.forEach((childSnapshot) => {
      const fahrtauftrag = childSnapshot.val();

      // Neue Zeile in die Tabelle einfügen
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${fahrtauftrag.auftragId}</td>
        <td>${fahrtauftrag.abholzeit}</td>
        <td>${fahrtauftrag.startort}</td>
        <td>${fahrtauftrag.abgabezeit}</td>
        <td>${fahrtauftrag.abgabeort}</td>
        <td>${fahrtauftrag.strecke} km</td>
        <td>${fahrtauftrag.auftraggeber}</td>
        <td>${fahrtauftrag.preis} €</td>
      `;
      tabelleBody.appendChild(newRow);
    });
    console.log("Fahrtaufträge erfolgreich geladen.");
  }, (error) => {
    console.error("Fehler beim Abrufen der Fahrtaufträge: ", error);
  });
}


// Rufe die Funktion auf, um beim Laden der Seite die Fahrtaufträge zu laden
ladeFahrtaufträge();

