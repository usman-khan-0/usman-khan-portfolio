// Daily Schedule App - Vanilla JavaScript

// Application State
let tasks = [];
let currentEditId = null;

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const startTimeInput = document.getElementById('start-time');
const endTimeInput = document.getElementById('end-time');
const taskStatusSelect = document.getElementById('task-status');
const tasksContainer = document.getElementById('tasks-container');
const noTasksElement = document.getElementById('no-tasks');
const timelineElement = document.getElementById('timeline');
const currentDateElement = document.getElementById('current-date');
const currentTimeElement = document.getElementById('current-time');
const currentTimeDisplay = document.getElementById('current-time-display');
const clearAllButton = document.getElementById('clear-all');
const clearFormButton = document.getElementById('clear-form');
const errorMessageElement = document.getElementById('error-message');
const editModal = document.getElementById('edit-modal');
const closeModalButton = document.getElementById('close-modal');
const cancelEditButton = document.getElementById('cancel-edit');
const editTaskForm = document.getElementById('edit-task-form');
const editTaskTitleInput = document.getElementById('edit-task-title');
const editStartTimeInput = document.getElementById('edit-start-time');
const editEndTimeInput = document.getElementById('edit-end-time');
const editTaskStatusSelect = document.getElementById('edit-task-status');
const exportScheduleButton = document.getElementById('export-schedule');
const storageStatusElement = document.getElementById('storage-status');
const currentYearElement = document.getElementById('current-year');

// Initialize the application
function init() {
    // Set current year in footer
    currentYearElement.textContent = new Date().getFullYear();
    
    // Load tasks from localStorage
    loadTasksFromStorage();
    
    // Update current date and time
    updateDateTime();
    
    // Generate timeline hours
    generateTimeline();
    
    // Update current time line every minute
    updateCurrentTimeLine();
    setInterval(updateCurrentTimeLine, 60000);
    
    // Set up event listeners
    setupEventListeners();
    
    // Set default time values
    setDefaultTimes();
    
    // Render tasks
    renderTasks();
}

// Set default times for inputs
function setDefaultTimes() {
    const now = new Date();
    const currentHour = now.getHours();
    const nextHour = currentHour + 1;
    
    // Set start time to current hour
    const startTime = `${currentHour.toString().padStart(2, '0')}:00`;
    // Set end time to next hour
    const endTime = `${nextHour.toString().padStart(2, '0')}:00`;
    
    startTimeInput.value = startTime;
    endTimeInput.value = endTime;
}

// Load tasks from localStorage
function loadTasksFromStorage() {
    const savedTasks = localStorage.getItem('dailyScheduleTasks');
    if (savedTasks) {
        try {
            tasks = JSON.parse(savedTasks);
            storageStatusElement.textContent = 'Data loaded from storage';
            storageStatusElement.style.color = 'var(--success-color)';
        } catch (error) {
            console.error('Error parsing saved tasks:', error);
            tasks = [];
        }
    } else {
        tasks = [];
        storageStatusElement.textContent = 'No saved data found';
        storageStatusElement.style.color = 'var(--gray-color)';
    }
}

// Save tasks to localStorage
function saveTasksToStorage() {
    try {
        localStorage.setItem('dailyScheduleTasks', JSON.stringify(tasks));
        storageStatusElement.textContent = 'Data saved locally';
        storageStatusElement.style.color = 'var(--success-color)';
        
        // Show temporary confirmation
        setTimeout(() => {
            storageStatusElement.textContent = 'Data saved locally';
        }, 2000);
    } catch (error) {
        console.error('Error saving tasks:', error);
        storageStatusElement.textContent = 'Error saving data';
        storageStatusElement.style.color = 'var(--danger-color)';
    }
}

// Update current date and time display
function updateDateTime() {
    const now = new Date();
    
    // Format date: Monday, January 1, 2023
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
    
    // Update time every second
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
}

// Update current time display
function updateCurrentTime() {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    currentTimeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
    currentTimeDisplay.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Generate timeline hours (8 AM to 10 PM)
function generateTimeline() {
    timelineElement.innerHTML = '';
    
    for (let hour = 8; hour <= 22; hour++) {
        const hourElement = document.createElement('div');
        hourElement.className = 'timeline-hour';
        
        // Format hour for display
        const displayHour = hour % 12 || 12;
        const ampm = hour < 12 ? 'AM' : 'PM';
        hourElement.textContent = `${displayHour} ${ampm}`;
        
        // Check if this is the current hour
        const currentHour = new Date().getHours();
        if (hour === currentHour) {
            hourElement.classList.add('current');
        }
        
        timelineElement.appendChild(hourElement);
    }
}

// Update current time line position
function updateCurrentTimeLine() {
    // Remove existing time line
    const existingLine = document.querySelector('.current-time-line');
    if (existingLine) {
        existingLine.remove();
    }
    
    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Only show if current hour is between 8 AM and 10 PM
    if (currentHour >= 8 && currentHour <= 22) {
        // Calculate position based on time
        const totalMinutes = (currentHour - 8) * 60 + currentMinute;
        const totalDayMinutes = (22 - 8) * 60;
        const percentage = (totalMinutes / totalDayMinutes) * 100;
        
        // Create and position the line
        const timeLine = document.createElement('div');
        timeLine.className = 'current-time-line';
        timeLine.style.left = `${percentage}%`;
        timeLine.style.top = '0';
        
        tasksContainer.appendChild(timeLine);
    }
    
    // Update task statuses based on current time
    updateTaskStatuses();
}

// Update task statuses based on current time
function updateTaskStatuses() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    tasks.forEach(task => {
        const startTimeInMinutes = timeToMinutes(task.startTime);
        const endTimeInMinutes = timeToMinutes(task.endTime);
        
        if (currentTime >= startTimeInMinutes && currentTime < endTimeInMinutes) {
            task.status = 'ongoing';
        } else if (currentTime >= endTimeInMinutes && task.status !== 'completed') {
            task.status = 'upcoming';
        }
    });
    
    // Save changes and re-render
    saveTasksToStorage();
    renderTasks();
}

// Convert time string (HH:MM) to minutes
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// Set up event listeners
function setupEventListeners() {
    // Add task form submission
    taskForm.addEventListener('submit', handleAddTask);
    
    // Clear form button
    clearFormButton.addEventListener('click', clearForm);
    
    // Clear all tasks button
    clearAllButton.addEventListener('click', clearAllTasks);
    
    // Export schedule button
    exportScheduleButton.addEventListener('click', exportSchedule);
    
    // Modal close buttons
    closeModalButton.addEventListener('click', closeEditModal);
    cancelEditButton.addEventListener('click', closeEditModal);
    
    // Edit task form submission
    editTaskForm.addEventListener('submit', handleEditTask);
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            closeEditModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    
    // Get form values
    const title = taskTitleInput.value.trim();
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    const status = taskStatusSelect.value;
    
    // Validate inputs
    if (!validateTaskInputs(title, startTime, endTime)) {
        return;
    }
    
    // Create new task object
    const newTask = {
        id: Date.now().toString(), // Simple unique ID
        title,
        startTime,
        endTime,
        status,
        createdAt: new Date().toISOString()
    };
    
    // Check for overlapping tasks
    if (hasOverlappingTask(newTask)) {
        showError('This task overlaps with an existing task. Please choose a different time slot.');
        return;
    }
    
    // Add task to array
    tasks.push(newTask);
    
    // Save to localStorage
    saveTasksToStorage();
    
    // Clear form
    clearForm();
    
    // Hide error message if shown
    hideError();
    
    // Render tasks
    renderTasks();
}

// Validate task inputs
function validateTaskInputs(title, startTime, endTime) {
    // Check for empty title
    if (!title) {
        showError('Please enter a task title.');
        taskTitleInput.focus();
        return false;
    }
    
    // Check if start time is before end time
    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
        showError('End time must be after start time.');
        endTimeInput.focus();
        return false;
    }
    
    // Check if times are within reasonable bounds (8 AM to 10 PM)
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    
    if (startMinutes < 8 * 60 || endMinutes > 22 * 60) {
        showError('Tasks can only be scheduled between 8:00 AM and 10:00 PM.');
        return false;
    }
    
    return true;
}

// Check for overlapping tasks
function hasOverlappingTask(newTask) {
    const newStart = timeToMinutes(newTask.startTime);
    const newEnd = timeToMinutes(newTask.endTime);
    
    // Check against all existing tasks (except the one being edited if applicable)
    return tasks.some(task => {
        // Skip the task being edited if we're in edit mode
        if (currentEditId && task.id === currentEditId) {
            return false;
        }
        
        const existingStart = timeToMinutes(task.startTime);
        const existingEnd = timeToMinutes(task.endTime);
        
        // Check for overlap: new task starts during existing task OR existing task starts during new task
        return (newStart < existingEnd && newEnd > existingStart);
    });
}

// Show error message
function showError(message) {
    errorMessageElement.textContent = message;
    errorMessageElement.classList.add('show');
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

// Hide error message
function hideError() {
    errorMessageElement.classList.remove('show');
}

// Clear the add task form
function clearForm() {
    taskForm.reset();
    setDefaultTimes();
    taskTitleInput.focus();
    hideError();
}

// Clear all tasks
function clearAllTasks() {
    if (tasks.length === 0) return;
    
    if (confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
        tasks = [];
        saveTasksToStorage();
        renderTasks();
    }
}

// Export schedule as JSON file
function exportSchedule() {
    if (tasks.length === 0) {
        showError('No tasks to export.');
        return;
    }
    
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `daily-schedule-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Render all tasks
function renderTasks() {
    // Clear current tasks
    tasksContainer.innerHTML = '';
    
    // Remove current time line (will be re-added by updateCurrentTimeLine)
    const existingLine = document.querySelector('.current-time-line');
    if (existingLine) {
        existingLine.remove();
    }
    
    // Show/hide "no tasks" message
    if (tasks.length === 0) {
        noTasksElement.style.display = 'block';
        return;
    } else {
        noTasksElement.style.display = 'none';
    }
    
    // Sort tasks by start time
    const sortedTasks = [...tasks].sort((a, b) => {
        return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });
    
    // Create task elements
    sortedTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });
    
    // Update current time line
    updateCurrentTimeLine();
}

// Create a task element
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${task.status}`;
    taskElement.dataset.id = task.id;
    
    // Format time for display
    const formatTimeForDisplay = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const displayHour = hours % 12 || 12;
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };
    
    const startTimeDisplay = formatTimeForDisplay(task.startTime);
    const endTimeDisplay = formatTimeForDisplay(task.endTime);
    
    taskElement.innerHTML = `
        <div class="task-time">${startTimeDisplay} - ${endTimeDisplay}</div>
        <div class="task-title">${task.title}</div>
        <div class="task-status ${task.status}">${task.status}</div>
        <div class="task-actions">
            <button class="edit-btn" title="Edit task" aria-label="Edit task">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" title="Delete task" aria-label="Delete task">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Add event listeners to buttons
    const editButton = taskElement.querySelector('.edit-btn');
    const deleteButton = taskElement.querySelector('.delete-btn');
    
    editButton.addEventListener('click', () => openEditModal(task));
    deleteButton.addEventListener('click', () => deleteTask(task.id));
    
    return taskElement;
}

// Open edit modal with task data
function openEditModal(task) {
    currentEditId = task.id;
    
    // Populate form with task data
    editTaskTitleInput.value = task.title;
    editStartTimeInput.value = task.startTime;
    editEndTimeInput.value = task.endTime;
    editTaskStatusSelect.value = task.status;
    
    // Show modal
    editModal.classList.add('show');
    editTaskTitleInput.focus();
}

// Close edit modal
function closeEditModal() {
    editModal.classList.remove('show');
    currentEditId = null;
    editTaskForm.reset();
}

// Handle editing a task
function handleEditTask(event) {
    event.preventDefault();
    
    if (!currentEditId) return;
    
    // Get form values
    const title = editTaskTitleInput.value.trim();
    const startTime = editStartTimeInput.value;
    const endTime = editEndTimeInput.value;
    const status = editTaskStatusSelect.value;
    
    // Validate inputs
    if (!validateTaskInputs(title, startTime, endTime)) {
        return;
    }
    
    // Find task index
    const taskIndex = tasks.findIndex(task => task.id === currentEditId);
    if (taskIndex === -1) return;
    
    // Create updated task object
    const updatedTask = {
        ...tasks[taskIndex],
        title,
        startTime,
        endTime,
        status,
        updatedAt: new Date().toISOString()
    };
    
    // Check for overlapping tasks (excluding the task being edited)
    if (hasOverlappingTask(updatedTask)) {
        showError('This task overlaps with another task. Please choose a different time slot.');
        return;
    }
    
    // Update task in array
    tasks[taskIndex] = updatedTask;
    
    // Save to localStorage
    saveTasksToStorage();
    
    // Close modal
    closeEditModal();
    
    // Render tasks
    renderTasks();
}

// Delete a task
function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    // Remove task from array
    tasks = tasks.filter(task => task.id !== taskId);
    
    // Save to localStorage
    saveTasksToStorage();
    
    // Render tasks
    renderTasks();
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + E to focus on task title input
    if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        taskTitleInput.focus();
    }
    
    // Escape key to close modal
    if (event.key === 'Escape' && editModal.classList.contains('show')) {
        closeEditModal();
    }
    
    // Ctrl/Cmd + S to submit form when focused on inputs
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        
        if (document.activeElement === taskTitleInput || 
            document.activeElement === startTimeInput ||
            document.activeElement === endTimeInput) {
            taskForm.requestSubmit();
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);