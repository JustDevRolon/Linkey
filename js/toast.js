/***************************************************************************************/
// Toast Logic
// notification Toast
const notification = document.getElementById('notification');

// notification icon
const notificationIcon = document.getElementById('notificationIcon');

// notification status
const notificationStatus = document.getElementById('notificationStatus');

// notification message
const notificationMessage = document.getElementById('notificationMessage')

// timeoutId to reset hide notification
let timeoutId;

// set icon lucide dynamically
function addNotificationElements(notificationType, status, message) {
    
    if (document.getElementById('notificationIcon').lastElementChild) {
        notificationIcon.lastElementChild.remove();
    }

    if (notificationType) {

        // remove styles
        notificationIcon.classList.remove('bg-red-500')
        notificationStatus.classList.remove('text-red-500')

        // add icon
        notificationIcon.classList.add('bg-green-500')
        notificationIcon.insertAdjacentHTML('beforeend', '<i data-lucide="check" class="w-5 h-5"></i>');

        // add status message
        notificationStatus.classList.add('text-green-500')
        notificationStatus.textContent = status;
        notificationMessage.textContent = message;
    } else {

        // remove styles
        notificationIcon.classList.remove('bg-green-500')
        notificationStatus.classList.remove('text-green-500')

        // add icon
        notificationIcon.classList.add('bg-red-500')
        notificationIcon.insertAdjacentHTML('beforeend', '<i data-lucide="x" class="w-5 h-5"></i>');

        // add status message
        notificationStatus.classList.add('text-red-500')
        notificationStatus.textContent = status;
        notificationMessage.textContent = message;
    }

    if (window.lucide) {
        lucide.createIcons();
    }
}

// hide Toast
function hideToast() {
    // notification icon
    const notificationIcon = document.getElementById('notificationIcon');

    // notification status
    const notificationStatus = document.getElementById('notificationStatus');

    // notification message
    const notificationMessage = document.getElementById('notificationMessage')
    notification.classList.remove('translate-x-0', 'opacity-100');
    notification.classList.add('translate-x-[150%]', 'opacity-0');
    notificationIcon.lastElementChild.remove();
    notificationIcon.classList.remove('bg-green-500')
    notificationStatus.classList.remove('text-green-500')
    notificationIcon.classList.remove('bg-red-500')
    notificationStatus.classList.remove('text-red-500')
}

// showToast Notification
function showToast(toastType, status, message) {
    addNotificationElements(toastType, status, message)
    // Remove hidden state
    notification.classList.remove('translate-x-[150%]', 'opacity-0');
    // Add visible state
    notification.classList.add('translate-x-0', 'opacity-100');

    // Clear existing timeout
    if (timeoutId) clearTimeout(timeoutId);

    // Auto-hide
    timeoutId = setTimeout(() => {
        hideToast()
    }, 4000);
}

/***************************************************************************************/
// Close toast logic
// notification close button
const closeBtn = document.getElementById('closeBtn');

closeBtn.addEventListener('click', () => hideToast())