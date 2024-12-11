document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  const myModal = new bootstrap.Modal(document.getElementById("form"));
  const deleteModal = new bootstrap.Modal(document.getElementById("delete-modal"));
  const form = document.getElementById("myForm");
  const dangerAlert = document.getElementById("danger-alert");
  const deleteEventName = document.getElementById("delete-event-name");
  let currentEvent = null;

  // Load events from localStorage or use an empty array
  const storedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];

  const calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,dayGridWeek,dayGridDay",
    },
    initialView: "dayGridMonth",
    selectable: true,
    editable: true,
    events: storedEvents, // Load stored events
    aspectRatio: 2.2, // Default aspect ratio
    height: "auto", // Automatically adjust the calendar height to fit all content
    displayEventTime: false, // Remove time from event display
    contentHeight: "auto", // Ensure all days fit without scrolling
    dayHeaders: true, // Ensure day headers are displayed

    windowResize: function () {
      if (window.innerWidth < 768) {
        calendar.setOption("aspectRatio", 1); // Taller layout for small screens
      } else {
        calendar.setOption("aspectRatio", 2.2); // Wider layout for large screens
      }
    },
    eventClick: function (info) {
      currentEvent = info.event;
      deleteEventName.textContent = currentEvent.title;
      deleteModal.show();
    },
  });

  calendar.render();

  // Save events to localStorage
  const saveEvents = () => {
    const events = calendar.getEvents().map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start.toISOString(),
      end: event.end ? event.end.toISOString() : null,
      color: event.backgroundColor,
    }));
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  };

  // Add event form submission logic
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("event-title").value;
    const start = document.getElementById("start-date").value;
    const end = document.getElementById("end-date").value || null;
    const color = document.getElementById("event-color").value;

    if (end && new Date(end) < new Date(start)) {
      dangerAlert.classList.remove("d-none");
      return;
    }

    dangerAlert.classList.add("d-none");

    calendar.addEvent({
      id: String(Date.now()), // Unique ID
      title: title,
      start: start,
      end: end,
      backgroundColor: color,
    });

    // Save to localStorage
    saveEvents();

    form.reset();
    myModal.hide();
  });

  // Delete event logic
  document.getElementById("delete-button").addEventListener("click", function () {
    if (currentEvent) {
      currentEvent.remove(); // Remove from calendar
      saveEvents(); // Update localStorage
      deleteModal.hide();
    }
  });
});
