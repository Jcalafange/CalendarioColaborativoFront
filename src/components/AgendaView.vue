<template>
  <v-app id="app">
    <button @click="showModal = true" class="Addbutton">Add Event</button>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Add Event</h2>
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="newEventTitle"><br><br>

        <label for="start-date">Start Date:</label>
        <input type="date" id="start-date" v-model="newEventStartDate"><br><br>

        <label for="end-date">End Date:</label>
        <input type="date" id="end-date" v-model="newEventEndDate"><br><br>

        <label for="color">Color:</label>
        <input type="color" id="color" v-model="newEventColor"><br><br>

        <label for="description">Description:</label><br>
        <textarea id="description" v-model="newEventDescription"></textarea><br><br>

        <button @click="addEvent">Add</button>
        <button @click="showModal = false">Cancel</button>
      </div>
    </div>
    <FullCalendar
      :options="calendarOptions"
      @dateClick="handleDateClick"
      @eventClick="handleEventClick"
      class="calendar"
    ></FullCalendar>
    
  </v-app>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      newEventTitle: '',
      newEventDate: '',
      showModal: false,         // Controls modal visibility
      newEventStartDate: '',    // New field for start date
      newEventEndDate: '',      // New field for end date
      newEventColor: '#3788d8', // Default color (blue)
      newEventDescription: '',  // New field for description
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
        initialView: 'dayGridMonth',
        exclusiveEndDates: true,
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        weekends: true,
        events: [
          // {
          //   title: 'The calendar can display background events',
          //   start: '2024-06-16T10:00:00',
          //   color: 'red'
          // },
          {
            title: 'All-day events can be displayed at the top',
            start: '2024-06-17',
            end: '2024-06-19',
            display: 'background',
            color: 'purple'
          },
          // {
          //   title: 'An event may span to another day',
          //   start: '2024-06-17T16:00:00',
          //   end: '2024-06-18T03:00:00',
          //   color: 'blue'
          // },
          // {
          //   title: 'Events can be assigned to resources',
          //   start: '2024-06-18T09:00:00',
          //   color: 'cyan'
          // },
          // {
          //   title: 'Overlapping events are positioned automatically',
          //   start: '2024-06-19T15:00:00',
          //   end: '2024-06-19T17:00:00',
          //   color: 'green'
          // },
          // {
          //   title: 'You have complete control over the events',
          //   start: '2024-06-20T10:00:00',
          //   end: '2024-06-20T11:30:00',
          //   color: 'orange'
          // },
          // {
          //   title: '...and you can drag and drop the events',
          //   start: '2024-06-20T14:00:00',
          //   end: '2024-06-20T15:00:00',
          //   color: 'red'
          // },
          // {
          //   title: 'Another event',
          //   start: '2024-06-20T18:00:00',
          //   end: '2024-06-20T19:00:00',
          //   color: 'purple'
          // }
        ]
      }
    }
  },
  methods: {
    handleDateClick(info) {
      const title = prompt('Enter event title:')
      if (title) {
        this.calendarOptions = {
          ...this.calendarOptions,
          events: [
            ...this.calendarOptions.events,
            {
              title: title,
              start: info.dateStr
            }
          ]
        }
      }
    },
    handleEventClick(info) {
      alert(`Event: ${info.event.title}\nStart: ${info.event.start}\nEnd: ${info.event.end}`)
    },
    addEvent() {
      if (this.newEventTitle && this.newEventStartDate) { // Start date is mandatory
        this.calendarOptions = {
          ...this.calendarOptions,
          events: [
            ...this.calendarOptions.events,
            {
              title: this.newEventTitle,
              start: this.newEventStartDate,
              end: this.newEventEndDate || this.newEventStartDate, // End date is optional
              color: this.newEventColor,
              description: this.newEventDescription // Include the description
            }
          ]
        };
        this.showModal = false; // Hide the modal after adding
        // ... (reset input fields)
        
      } else {
        alert('Please enter at least a title and start date for the event.');
      }
    }
  },
  mounted() {
  console.log(this.calendarOptions.events); // Imprime a lista de eventos após o componente ser montado
  }
}
</script>

<style>

.Addbutton {
  background-color: black; /* Gray background */
  color: white;
  padding: 8px 16px; /* Adjust padding as needed */
  border: none;
  border-radius: 4px; /* Slightly rounded corners */
  font-weight: bold;
  cursor: pointer;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); /* Subtle shadow */
}

.Addbutton:hover {
  background-color: #757575; /* Darker gray on hover */
}
.modal {
  background-color: rgb(147, 147, 245);
  padding: 20px;
  border-radius: 5px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
#app {
  max-width: 85%;
  margin: 0 auto;
}
.calendar {
  margin-top: 20px;
}
.event-form {
  margin-top: 20px;
}
.event-form input {
  margin-right: 10px;
}
</style>
