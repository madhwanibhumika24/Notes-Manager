let notes = [
    {
        id: 1,
        title: "Welcome to Notes Manager",
        content: "This is your first note. Start organizing your thoughts and ideas here.",
        date: Date.now(),
        important: false
    }
];

let editingId = null;

const notesContainer = document.getElementById("notesContainer");
const noteCount = document.getElementById("noteCount");
const addNoteBtn = document.getElementById("addNoteBtn");
const noteModal = document.getElementById("noteModal");
const modalTitle = document.getElementById("modalTitle");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

const starIcon = '<svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M7.5 1L9.4 5.2L14 5.8L10.6 8.9L11.5 13.5L7.5 11.2L3.5 13.5L4.4 8.9L1 5.8L5.6 5.2L7.5 1Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>';
const editIcon = '<svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M9.5 2L13 5.5L5 13.5H1.5V10L9.5 2Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>';
const deleteIcon = '<svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M2.5 4H12.5M5.5 4V2.5H9.5V4M6 6.5V11M9 6.5V11M3.5 4L4 13H11L11.5 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function openModal() {
    noteModal.classList.add("active");
    noteTitle.focus();
}

function hideModal() {
    noteModal.classList.remove("active");
    noteTitle.value = "";
    noteContent.value = "";
    editingId = null;
    modalTitle.textContent = "Add new note";
    saveNoteBtn.textContent = "Save note";
}

function openAddModal() {
    editingId = null;
    modalTitle.textContent = "Add new note";
    saveNoteBtn.textContent = "Save note";
    openModal();
}

function openEditModal(note) {
    editingId = note.id;
    modalTitle.textContent = "Edit note";
    saveNoteBtn.textContent = "Update note";
    noteTitle.value = note.title;
    noteContent.value = note.content;
    openModal();
}

function formatDate(timestamp) {
    const today = new Date();
    const noteDate = new Date(timestamp);
    if (noteDate.toDateString() === today.toDateString()) {
        return "Today";
    }
    return noteDate.toLocaleDateString();
}

function clearNotesContainer() {
    while (notesContainer.firstChild) {
        notesContainer.firstChild.remove();
    }
}

function createNoteCard(note, accentIndex) {
    const card = document.createElement("article");
    card.className = "note-card" + (note.important ? " important" : "");

    const top = document.createElement("div");
    top.className = "note-card-top";

    const dot = document.createElement("span");
    dot.className = "tag-dot accent-" + accentIndex;

    const dateLabel = document.createElement("span");
    dateLabel.className = "note-date";
    dateLabel.style.marginTop = "0";
    dateLabel.textContent = formatDate(note.date);

    top.appendChild(dot);
    top.appendChild(dateLabel);

    const header = document.createElement("div");
    header.className = "note-card-header";

    const title = document.createElement("h3");
    title.textContent = note.title;

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const starBtn = document.createElement("button");
    starBtn.className = "icon-btn star-btn" + (note.important ? " active" : "");
    starBtn.innerHTML = starIcon;
    starBtn.title = "Mark as important";
    starBtn.addEventListener("click", function () {
        note.important = !note.important;
        renderNotes();
    });

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn edit-btn";
    editBtn.innerHTML = editIcon;
    editBtn.title = "Edit note";
    editBtn.addEventListener("click", function () {
        openEditModal(note);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn delete-btn";
    deleteBtn.innerHTML = deleteIcon;
    deleteBtn.title = "Delete note";
    deleteBtn.addEventListener("click", function () {
        notes = notes.filter(function (n) {
            return n.id !== note.id;
        });
        card.remove();
        updateNoteCount();
        renderNotes();
    });

    actions.appendChild(starBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    header.appendChild(title);
    header.appendChild(actions);

    const content = document.createElement("p");
    content.textContent = note.content;

    card.appendChild(top);
    card.appendChild(header);
    card.appendChild(content);

    return card;
}

function updateNoteCount() {
    noteCount.textContent = notes.length + (notes.length === 1 ? " note" : " notes");
}

function renderNotes() {
    const searchText = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;

    let filteredNotes = notes.filter(function (note) {
        return note.title.toLowerCase().includes(searchText) ||
            note.content.toLowerCase().includes(searchText);
    });

    if (filterValue === "recent") {
        filteredNotes = filteredNotes.slice().sort(function (a, b) {
            return b.date - a.date;
        });
    } else if (filterValue === "important") {
        filteredNotes = filteredNotes.filter(function (note) {
            return note.important;
        });
    }

    clearNotesContainer();
    updateNoteCount();

    if (filteredNotes.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M6 2H14L19 7V22H6V2Z" stroke="currentColor" stroke-width="1.3"/><path d="M14 2V7H19" stroke="currentColor" stroke-width="1.3"/></svg>';
        const emptyText = document.createElement("p");
        emptyText.textContent = "No notes found.";
        emptyState.appendChild(emptyText);
        notesContainer.appendChild(emptyState);
        return;
    }

    filteredNotes.forEach(function (note, index) {
        const card = createNoteCard(note, (index % 3) + 1);
        notesContainer.appendChild(card);
    });
}

function saveNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (title === "" || content === "") {
        alert("Please fill in both title and note.");
        return;
    }

    if (editingId !== null) {
        const existingNote = notes.find(function (n) {
            return n.id === editingId;
        });
        existingNote.title = title;
        existingNote.content = content;
    } else {
        notes.unshift({
            id: Date.now(),
            title: title,
            content: content,
            date: Date.now(),
            important: false
        });
    }

    hideModal();
    renderNotes();
}

addNoteBtn.addEventListener("click", openAddModal);
closeModal.addEventListener("click", hideModal);
cancelBtn.addEventListener("click", hideModal);
saveNoteBtn.addEventListener("click", saveNote);
searchInput.addEventListener("input", renderNotes);
filterSelect.addEventListener("change", renderNotes);

renderNotes();