<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-container">
        <h1>Meine Trainingsseite</h1>
        <ul class="navbar-nav">
        </ul>
      </div>
    </nav>
    <div class="content">
      <div class="newtrainingsentry">
        <h2>Neuer Trainingseintrag</h2>
        <span>Geben Sie hier ein in welcher Zeit (in Stunden) Sie das schaffen wollen</span>
        <input v-model="zielZeit" type="text" placeholder="Ziel-Zeit">
        <span>Geben Sie hier ein wie viele Kilometer Ihr Ziel ist</span>
        <input v-model="zielKilometer" type="text" placeholder="Ziel-Kilometer">
        <span>Geben Sie hier ein wie viel Kilometer Sie gelaufen sind</span>
        <input v-model="gelaufeneKilometer" type="text" placeholder="Gelaufene Kilometer">
        <span>Geben Sie hier ein in welcher Zeit (in Stunden) Sie die Kilometer gelaufen sind</span>
        <input v-model="gelaufeneZeit" type="text" placeholder="Gelaufene Zeit">
        <button v-if="!editMode" @click="submitEntry">Senden</button>
        <button v-if="editMode" @click="updateEntry">Änderungen speichern</button>
      </div>
      <div class="training-entries">
        <h2>Trainingsübersicht</h2>
        <div class="filter">
          <div class="filter-row">
            <label for="filterGoal">Ziel erreicht filtern:</label>
            <select v-model="filterGoalReached" @change="fetchEntries">
              <option value="all">Alle</option>
              <option value="true">Ja</option>
              <option value="false">Nein</option>
            </select>
          </div>
          <div class="filter-row">
            <label for="sortDate">Sortieren nach Datum:</label>
            <select v-model="sortDate" @change="sortEntries">
              <option value="desc">Absteigend</option>
              <option value="asc">Aufsteigend</option>
            </select>
          </div>
        </div>
        <ul v-if="sortedEntries.length > 0">
          <li v-for="entry in sortedEntries" :key="entry.id">
            <div class="entry">
              <h3>{{ entry.date }}</h3>
              <p>Ziel-Zeit: <span class="bold-text">{{ entry.targetTime }} h</span></p>
              <p>Ziel-Kilometer: <span class="bold-text">{{ entry.targetKilometre }} km</span></p>
              <p>Gelaufene Kilometer: <span class="bold-text">{{ entry.kilometreRan }} km</span></p>
              <p>Benötigte Zeit: <span class="bold-text">{{ entry.timeRan }} h</span></p>
              <p>Ziel erreicht: <span class="bold-text">{{ entry.goalReached ? 'Ja' : 'Nein' }}</span></p>
              <div class="button-container">
                <button class="edit" @click="editEntry(entry)">Bearbeiten</button>
                <button class="delete" @click="deleteEntry(entry.id)">Löschen</button>
              </div>
            </div>
          </li>
        </ul>
        <p v-else class="no-entries">Keine Einträge vorhanden.</p>
      </div>
      <div class="statistics">
        <h2>Ihre Statistik</h2>
        <p>Durchschnittliche Laufzeit:  <span class="bold-text">{{ totalTime }} h</span></p>
        <p>Gesamte gelaufene Distanz:  <span class="bold-text">{{ totalDistance }} km</span></p>
        <p>Gesamtanzahl der Trainingseinheiten:  <span class="bold-text">{{ totalEntries }}</span></p>
        <p>Prozentualer Anteil der erreichten Ziele:  <span class="bold-text">{{ goalAchievementRate }}%</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TrainingEntries',
  data() {
    return {
      zielZeit: '',
      zielKilometer: '',
      gelaufeneKilometer: '',
      gelaufeneZeit: '',
      trainingEntries: [],
      editMode: false,
      currentEntryId: null,
      currentEntryDate: null,
      filterGoalReached: 'all',
      sortDate: 'desc'
    }
  },
  created() {
    this.fetchEntries();
  },
  methods: {
    async fetchEntries() {
      try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/entries');
        this.trainingEntries = response.data;
        this.sortEntries();  // Einträge nach Abruf sortieren
      } catch (error) {
        console.error(error);
      }
    },
    goalReached(targetTime, targetKilometer, timeRan, kilometreRan) {
      return (timeRan <= targetTime && kilometreRan >= targetKilometer);
    },
    getCurrentDate() {
      const date = new Date();
      return date.toISOString().slice(0, 10);
    },
    async submitEntry() {
      const newEntry = {
        date: this.getCurrentDate(),
        targetTime: parseFloat(this.zielZeit),
        targetKilometre: parseFloat(this.zielKilometer),
        kilometreRan: parseFloat(this.gelaufeneKilometer),
        timeRan: parseFloat(this.gelaufeneZeit),
        goalReached: this.goalReached(parseFloat(this.zielZeit), parseFloat(this.zielKilometer), parseFloat(this.gelaufeneZeit), parseFloat(this.gelaufeneKilometer))
      };

      try {
        await axios.post(import.meta.env.VITE_BACKEND_URL + '/entries', newEntry);
        this.zielZeit = '';
        this.zielKilometer = '';
        this.gelaufeneKilometer = '';
        this.gelaufeneZeit = '';
        this.fetchEntries();
      } catch (error) {
        console.error('Error adding entry:', error);
      }
    },
    async editEntry(entry) {
      this.editMode = true;
      this.currentEntryId = entry.id;
      this.currentEntryDate = entry.date;
      this.zielZeit = entry.targetTime;
      this.zielKilometer = entry.targetKilometre;
      this.gelaufeneKilometer = entry.kilometreRan;
      this.gelaufeneZeit = entry.timeRan;
    },
    async updateEntry() {
      const updatedEntry = {
        date: this.currentEntryDate,
        targetTime: parseFloat(this.zielZeit),
        targetKilometre: parseFloat(this.zielKilometer),
        kilometreRan: parseFloat(this.gelaufeneKilometer),
        timeRan: parseFloat(this.gelaufeneZeit),
        goalReached: this.goalReached(parseFloat(this.zielZeit), parseFloat(this.zielKilometer), parseFloat(this.gelaufeneZeit), parseFloat(this.gelaufeneKilometer))
      };

      try {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/entries/${this.currentEntryId}`, updatedEntry);
        this.zielZeit = '';
        this.zielKilometer = '';
        this.gelaufeneKilometer = '';
        this.gelaufeneZeit = '';
        this.editMode = false;
        this.fetchEntries();
      } catch (error) {
        console.error('Error updating entry:', error);
      }
    },
    async deleteEntry(entryId) {
      try {
        await axios.delete(import.meta.env.VITE_BACKEND_URL + '/entries/' + entryId);
        this.fetchEntries();
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    },
    sortEntries() {
      this.trainingEntries.sort((a, b) => {
        if (this.sortDate === 'asc') {
          return new Date(a.date) - new Date(b.date);
        } else {
          return new Date(b.date) - new Date(a.date);
        }
      });
    }
  },
  computed: {
    filteredEntries() {
      if (this.filterGoalReached === 'all') {
        return this.trainingEntries;
      }
      const goalReached = this.filterGoalReached === 'true';
      return this.trainingEntries.filter(entry => entry.goalReached === goalReached);
    },
    sortedEntries() {
      return this.filteredEntries;
    },
    totalTime() {
      return this.trainingEntries.reduce((sum, entry) => sum + entry.timeRan, 0).toFixed(2);
    },
    totalDistance() {
      return this.trainingEntries.reduce((sum, entry) => sum + entry.kilometreRan, 0).toFixed(2);
    },
    totalEntries() {
      return this.trainingEntries.length;
    },
    goalAchievementRate() {
      if (this.trainingEntries.length === 0) return 0;
      const achieved = this.trainingEntries.filter(entry => entry.goalReached).length;
      return ((achieved / this.trainingEntries.length) * 100).toFixed(2);
    }
  }
}
</script>

<style src="src/assets/trainingEntries.css"></style>
