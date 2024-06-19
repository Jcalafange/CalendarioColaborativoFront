<template>
  <v-app id="app">
    <button @click="showModal = true" class="Addbutton">Add Event</button>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>{{ isEditMode ? 'Edit Event' : 'Add Event' }}</h2>
        <form @submit.prevent="validateAndSaveEvent">
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

          <button type="submit">{{ isEditMode ? 'Save' : 'Add' }}</button>
          <button @click="closeModal">Cancel</button>
        </form>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
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
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

export default {
  components: {
    FullCalendar
  },
  setup() {
    const showModal = ref(false)
    const newEventTitle = ref('')
    const newEventStartDate = ref('')
    const newEventEndDate = ref('')
    const newEventColor = ref('#3788d8')
    const newEventDescription = ref('')
    const errorMessage = ref('')
    const isEditMode = ref(false)
    const eventToEdit = ref(null)

    // Configurações do calendário
    const calendarOptions = ref({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      weekends: true,
      events: [
        {
          title: 'All-day events can be displayed at the top',
          start: '2024-06-17',
          end: '2024-06-19',
          color: 'purple'
        }
      ],
      dateClick: handleDateClick,
      eventClick: handleEventClick
    })

    // Função para lidar com cliques em datas
    function handleDateClick(info) {
      resetForm()
      newEventStartDate.value = info.dateStr
      showModal.value = true
    }

    // Função para lidar com cliques em eventos
    function handleEventClick(info) {
      console.log('Event clicked:', info) // Verifique se este log aparece no console
      const action = confirm('Do you want to edit or delete this event? Click OK to edit, Cancel to delete.')
      if (action) {
        isEditMode.value = true
        eventToEdit.value = info.event
        newEventTitle.value = info.event.title
        newEventStartDate.value = info.event.startStr
        newEventEndDate.value = info.event.endStr ? info.event.endStr.slice(0, 10) : info.event.startStr
        newEventColor.value = info.event.backgroundColor
        newEventDescription.value = info.event.extendedProps.description
        showModal.value = true
      } else {
        const deleteConfirm = confirm('Are you sure you want to delete this event?')
        if (deleteConfirm) {
          deleteEvent(info.event)
        }
      }
    }

    // Validação e salvamento de eventos
    function validateAndSaveEvent() {
      if (!newEventTitle.value) {
        errorMessage.value = 'Title is required.'
        return
      }
      if (!newEventStartDate.value) {
        errorMessage.value = 'Start date is required.'
        return
      }
      isEditMode.value ? saveEvent() : addEvent()
    }

    // Adição de novos eventos
    function addEvent() {
      calendarOptions.value = {
        ...calendarOptions.value,
        events: [
          ...calendarOptions.value.events,
          {
            title: newEventTitle.value,
            start: newEventStartDate.value,
            end: newEventEndDate.value || newEventStartDate.value,
            color: newEventColor.value,
            description: newEventDescription.value
          }
        ]
      }
      closeModal()
    }

    // Salvamento de eventos existentes
    function saveEvent() {
      eventToEdit.value.setProp('title', newEventTitle.value)
      eventToEdit.value.setStart(newEventStartDate.value)
      eventToEdit.value.setEnd(newEventEndDate.value || newEventStartDate.value)
      eventToEdit.value.setProp('backgroundColor', newEventColor.value)
      eventToEdit.value.setExtendedProp('description', newEventDescription.value)
      closeModal()
    }

    // Exclusão de eventos
    function deleteEvent(event) {
      event.remove()
    }

    // Fechamento do modal
    function closeModal() {
      resetForm()
      showModal.value = false
    }

    // Reset do formulário
    function resetForm() {
      newEventTitle.value = ''
      newEventStartDate.value = ''
      newEventEndDate.value = ''
      newEventColor.value = '#3788d8'
      newEventDescription.value = ''
      errorMessage.value = ''
      isEditMode.value = false
      eventToEdit.value = null
    }

    return {
      showModal,
      newEventTitle,
      newEventStartDate,
      newEventEndDate,
      newEventColor,
      newEventDescription,
      errorMessage,
      isEditMode,
      eventToEdit,
      calendarOptions,
      handleDateClick,
      handleEventClick,
      validateAndSaveEvent,
      addEvent,
      saveEvent,
      deleteEvent,
      closeModal,
      resetForm
    }
  }
}
</script>

<style>
.Addbutton {
  background-color: black;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.Addbutton:hover {
  background-color: #757575;
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
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
