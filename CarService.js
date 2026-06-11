// API Configuration
const API_BASE_URL = 'https://localhost:7196/api';
const API_ENDPOINTS = {
    CARS: `${API_BASE_URL}/cars`,
    DRIVERS: `${API_BASE_URL}/driver`,
    SERVICE_ENTRIES: `${API_BASE_URL}/serviceentry`,
    DRIVER_ALERTS: `${API_BASE_URL}/driveralerts`,
    DRIVER_ALERT_TYPES: `${API_BASE_URL}/DriverAlertTypes`,
    SERVICE_USERS: `${API_BASE_URL}/ServiceUsers`
};

const SERVICE_USER_STORAGE_KEY = 'carService.currentServiceUser';

let currentEditType = null;
let currentEditId = null;
let driverAlertTypesCache = [];
let currentServiceUser = null;
let currentEditDriverServiceUserId = null;

// ===============================
// TAB NAVIGATION
// ===============================
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        switchTab(tabName);
    });
});

function switchTab(tabName) {
    if (!currentServiceUser) {
        return;
    }

    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const tabElement = document.getElementById(tabName + '-tab');
    if (tabElement) {
        tabElement.classList.add('active');
        const btn = document.querySelector('.tab-button[data-tab="' + tabName + '"]');
        if (btn) btn.classList.add('active');
    }

    // Load data when switching tabs
    if (tabName === 'cars') loadAllCars();
    else if (tabName === 'drivers') loadAllDrivers();
    else if (tabName === 'service-entries') loadAllServiceEntries();
    else if (tabName === 'driver-alerts') {
        loadDriverAlertTypes();
        loadAllAlerts();
    }
}

// ===============================
// NOTIFICATION SYSTEM
// ===============================
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

function getStoredServiceUser() {
    try {
        const stored = localStorage.getItem(SERVICE_USER_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        return null;
    }
}

function storeServiceUser(user) {
    localStorage.setItem(SERVICE_USER_STORAGE_KEY, JSON.stringify({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        isAdmin: Boolean(user.isAdmin)
    }));
}

function clearStoredServiceUser() {
    localStorage.removeItem(SERVICE_USER_STORAGE_KEY);
}

function isCurrentServiceUserAdmin() {
    return Boolean(currentServiceUser && currentServiceUser.isAdmin);
}

function setSessionControlsVisibility(isLoggedIn) {
    const authScreen = document.getElementById('authScreen');
    const appShell = document.getElementById('appShell');
    const sessionBadge = document.getElementById('sessionBadge');
    const sessionInline = document.getElementById('sessionInline');

    if (authScreen) authScreen.classList.toggle('hidden', isLoggedIn);
    if (appShell) appShell.classList.toggle('hidden', !isLoggedIn);
    if (sessionBadge) sessionBadge.classList.toggle('hidden', !isLoggedIn);
    if (sessionInline) sessionInline.classList.toggle('hidden', !isLoggedIn);
}

function updateSessionUi() {
    const sessionText = currentServiceUser
        ? `${currentServiceUser.userName} | ServiceUserID: ${currentServiceUser.id}${currentServiceUser.isAdmin ? ' | Admin' : ''}`
        : '';

    const sessionBadge = document.getElementById('sessionBadge');
    const sessionInline = document.getElementById('sessionInline');

    if (sessionBadge) {
        sessionBadge.textContent = sessionText;
    }

    if (sessionInline) {
        sessionInline.textContent = sessionText;
    }
}

function applyCurrentServiceUserToDriverForm() {
    const serviceUserField = document.getElementById('driverServiceUserID');
    if (serviceUserField) {
        serviceUserField.value = currentServiceUser ? currentServiceUser.id : '';
    }
}

async function loadServiceUsers() {
    const response = await fetch(API_ENDPOINTS.SERVICE_USERS);
    const serviceUsers = await response.json();
    return Array.isArray(serviceUsers) ? serviceUsers : [];
}

async function restoreSession() {
    const storedUser = getStoredServiceUser();
    if (!storedUser?.id) {
        currentServiceUser = null;
        setSessionControlsVisibility(false);
        updateSessionUi();
        return false;
    }

    try {
        const response = await fetch(`${API_ENDPOINTS.SERVICE_USERS}/${storedUser.id}`);
        if (!response.ok) {
            throw new Error('Session user not found');
        }

        const serviceUser = await response.json();
        currentServiceUser = {
            id: serviceUser.id,
            firstName: serviceUser.firstName,
            lastName: serviceUser.lastName,
            userName: serviceUser.userName,
            isAdmin: Boolean(serviceUser.isAdmin)
        };

        setSessionControlsVisibility(true);
        updateSessionUi();
        applyCurrentServiceUserToDriverForm();
        applyRoleVisibility();
        return true;
    } catch (error) {
        clearStoredServiceUser();
        currentServiceUser = null;
        setSessionControlsVisibility(false);
        updateSessionUi();
        applyRoleVisibility();
        return false;
    }
}

async function loginServiceUser(userName, password) {
    const serviceUsers = await loadServiceUsers();
    const normalizedUserName = userName.trim().toLowerCase();
    const matchedUser = serviceUsers.find(serviceUser =>
        String(serviceUser.userName ?? '').trim().toLowerCase() === normalizedUserName &&
        String(serviceUser.password ?? '') === password
    );

    if (!matchedUser) {
        throw new Error('Invalid username or password');
    }

    currentServiceUser = {
        id: matchedUser.id,
        firstName: matchedUser.firstName,
        lastName: matchedUser.lastName,
        userName: matchedUser.userName,
        isAdmin: Boolean(matchedUser.isAdmin)
    };

    storeServiceUser(currentServiceUser);
    setSessionControlsVisibility(true);
    updateSessionUi();
    applyCurrentServiceUserToDriverForm();
    applyRoleVisibility();
    switchTab('cars');
}

async function registerServiceUser() {
    const firstName = document.getElementById('registerFirstName').value.trim();
    const lastName = document.getElementById('registerLastName').value.trim();
    const userName = document.getElementById('registerUserName').value.trim();
    const password = document.getElementById('registerPassword').value;
    const isAdmin = document.getElementById('registerIsAdmin').checked;

    const serviceUsers = await loadServiceUsers();
    const alreadyExists = serviceUsers.some(serviceUser =>
        String(serviceUser.userName ?? '').trim().toLowerCase() === userName.toLowerCase()
    );

    if (alreadyExists) {
        throw new Error('That username already exists');
    }

    const newServiceUser = {
        id: generateGuid(),
        firstName,
        lastName,
        userName,
        password,
        isAdmin
    };

    const response = await fetch(API_ENDPOINTS.SERVICE_USERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newServiceUser)
    });

    if (!response.ok) {
        throw new Error('Error creating ServiceUser account');
    }

    currentServiceUser = {
        id: newServiceUser.id,
        firstName: newServiceUser.firstName,
        lastName: newServiceUser.lastName,
        userName: newServiceUser.userName,
        isAdmin: newServiceUser.isAdmin
    };

    storeServiceUser(currentServiceUser);
    setSessionControlsVisibility(true);
    updateSessionUi();
    applyCurrentServiceUserToDriverForm();
    applyRoleVisibility();
    switchTab('cars');
}

function logoutServiceUser() {
    clearStoredServiceUser();
    currentServiceUser = null;
    currentEditDriverServiceUserId = null;
    setSessionControlsVisibility(false);
    updateSessionUi();
    applyCurrentServiceUserToDriverForm();
    applyRoleVisibility();
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();
}

function getVisibleDrivers(drivers) {
    if (!currentServiceUser) {
        return [];
    }

    if (isCurrentServiceUserAdmin()) {
        return drivers;
    }

    return drivers.filter(driver => String(driver.serviceUserID ?? '') === String(currentServiceUser.id));
}

async function getOwnDriverIds() {
    try {
        const response = await fetch(API_ENDPOINTS.DRIVERS);
        const drivers = await response.json();
        const own = getVisibleDrivers(Array.isArray(drivers) ? drivers : []);
        return new Set(own.map(d => String(d.id)));
    } catch {
        return new Set();
    }
}

function hasDriverAccess(driver) {
    if (!currentServiceUser) {
        return false;
    }

    return isCurrentServiceUserAdmin() || String(driver.serviceUserID ?? '') === String(currentServiceUser.id);
}

function applyRoleVisibility() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('hidden');
    });
    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.remove('hidden');
    });
}

async function copyTextToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }

        showNotification('ID copied to clipboard!');
    } catch (error) {
        showNotification('Error copying ID', 'error');
    }
}

// ===============================
// CARS MANAGEMENT
// ===============================
document.getElementById('addCarForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const car = {
        id: generateGuid(),
        model: document.getElementById('carModel').value,
        year: parseInt(document.getElementById('carYear').value),
        type: document.getElementById('carType').value,
        engine: document.getElementById('carEngine').value,
        licencePlate: document.getElementById('carLicencePlate').value,
        firstRegistration: parseInt(document.getElementById('carFirstReg').value),
        makeId: null
    };

    try {
        const response = await fetch(API_ENDPOINTS.CARS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(car)
        });

        if (response.ok) {
            showNotification('Car added successfully!');
            this.reset();
            loadAllCars();
        } else {
            showNotification('Error adding car', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error: ' + error.message, 'error');
    }
});

async function loadAllCars() {
    try {
        const response = await fetch(API_ENDPOINTS.CARS);
        const cars = await response.json();

        const tbody = document.querySelector('#carsTable tbody');
        
        if (!cars || cars.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No cars found</td></tr>';
            return;
        }

        tbody.innerHTML = cars.map(car => `
            <tr>
                <td>${car.model}</td>
                <td>${car.year}</td>
                <td>${car.type}</td>
                <td>${car.engine}</td>
                <td>${car.licencePlate}</td>
                <td>${car.firstRegistration}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="copyTextToClipboard('${car.id}')">Copy ID</button>
                    <button class="btn btn-sm btn-edit" onclick="editCar('${car.id}')">Edit</button>
                    <button class="btn btn-sm btn-delete" onclick="deleteCar('${car.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading cars:', error);
        showNotification('Error loading cars', 'error');
    }
}

async function searchCarsByPlate() {
    const plate = document.getElementById('carSearchPlate').value;
    if (!plate) {
        loadAllCars();
        return;
    }

    try {
        const response = await fetch(`${API_ENDPOINTS.CARS}/search/licence-plate?licencePlate=${encodeURIComponent(plate)}`);
        const cars = await response.json();

        const tbody = document.querySelector('#carsTable tbody');
        if (!cars || cars.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No cars found</td></tr>';
            return;
        }

        tbody.innerHTML = cars.map(car => `
            <tr>
                <td>${car.model}</td>
                <td>${car.year}</td>
                <td>${car.type}</td>
                <td>${car.engine}</td>
                <td>${car.licencePlate}</td>
                <td>${car.firstRegistration}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="copyTextToClipboard('${car.id}')">Copy ID</button>
                    <button class="btn btn-sm btn-edit" onclick="editCar('${car.id}')">Edit</button>
                    <button class="btn btn-sm btn-delete" onclick="deleteCar('${car.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error searching cars:', error);
        showNotification('Error searching cars', 'error');
    }
}

async function editCar(carId) {
    try {
        const response = await fetch(`${API_ENDPOINTS.CARS}/${carId}`);
        const car = await response.json();

        currentEditType = 'car';
        currentEditId = carId;

        const editForm = document.getElementById('editForm');
        editForm.innerHTML = `
            <div class="form-group">
                <label for="editCarModel">Model:</label>
                <input type="text" id="editCarModel" value="${car.model}" required>
            </div>
            <div class="form-group">
                <label for="editCarYear">Year:</label>
                <input type="number" id="editCarYear" value="${car.year}" required>
            </div>
            <div class="form-group">
                <label for="editCarType">Type:</label>
                <input type="text" id="editCarType" value="${car.type}" required>
            </div>
            <div class="form-group">
                <label for="editCarEngine">Engine:</label>
                <input type="text" id="editCarEngine" value="${car.engine}" required>
            </div>
            <div class="form-group">
                <label for="editCarPlate">Licence Plate:</label>
                <input type="text" id="editCarPlate" value="${car.licencePlate}" required>
            </div>
            <div class="form-group">
                <label for="editCarFirstReg">First Registration:</label>
                <input type="number" id="editCarFirstReg" value="${car.firstRegistration}" required>
            </div>
            <button type="button" class="btn btn-primary" onclick="saveEditedCar()">Save Changes</button>
        `;

        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        showNotification('Error loading car details', 'error');
    }
}

async function saveEditedCar() {
    const car = {
        model: document.getElementById('editCarModel').value,
        year: parseInt(document.getElementById('editCarYear').value),
        type: document.getElementById('editCarType').value,
        engine: document.getElementById('editCarEngine').value,
        licencePlate: document.getElementById('editCarPlate').value,
        firstRegistration: parseInt(document.getElementById('editCarFirstReg').value),
        makeId: null
    };

    try {
        const response = await fetch(`${API_ENDPOINTS.CARS}/${currentEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(car)
        });

        if (response.ok) {
            showNotification('Car updated successfully!');
            closeEditModal();
            loadAllCars();
        } else {
            showNotification('Error updating car', 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function deleteCar(carId) {
    if (confirm('Are you sure you want to delete this car?')) {
        try {
            const response = await fetch(`${API_ENDPOINTS.CARS}/${carId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showNotification('Car deleted successfully!');
                loadAllCars();
            } else {
                showNotification('Error deleting car', 'error');
            }
        } catch (error) {
            showNotification('Error: ' + error.message, 'error');
        }
    }
}

// ===============================
// DRIVERS MANAGEMENT
// ===============================
document.getElementById('addDriverForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    if (!currentServiceUser) {
        showNotification('Please log in first', 'error');
        return;
    }

    const driver = {
        id: generateGuid(),
        firstName: document.getElementById('driverFirstName').value,
        lastName: document.getElementById('driverLastName').value,
        emailAddress: document.getElementById('driverEmail').value,
        phoneNo: document.getElementById('driverPhone').value,
        address: document.getElementById('driverAddress').value,
        city: document.getElementById('driverCity').value,
        zipCode: document.getElementById('driverZip').value,
        licenceExpiration: document.getElementById('driverLicenceExp').value,
        serviceUserID: currentServiceUser.id
    };

    try {
        const response = await fetch(API_ENDPOINTS.DRIVERS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(driver)
        });

        if (response.ok) {
            showNotification('Driver added successfully!');
            this.reset();
            loadAllDrivers();
        } else {
            showNotification('Error adding driver', 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
});

async function loadAllDrivers() {
    if (!currentServiceUser) {
        return;
    }

    try {
        const response = await fetch(API_ENDPOINTS.DRIVERS);
        const drivers = await response.json();
        const visibleDrivers = getVisibleDrivers(Array.isArray(drivers) ? drivers : []);

        const tbody = document.querySelector('#driversTable tbody');
        
        if (!visibleDrivers || visibleDrivers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No drivers found</td></tr>';
            return;
        }

        tbody.innerHTML = visibleDrivers.map(driver => `
            <tr>
                <td>${driver.firstName}</td>
                <td>${driver.lastName}</td>
                <td>${driver.emailAddress}</td>
                <td>${driver.phoneNo}</td>
                <td>${driver.city}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="copyTextToClipboard('${driver.id}')">Copy ID</button>
                    <button class="btn btn-sm btn-edit" onclick="editDriver('${driver.id}')">Edit</button>
                    <button class="btn btn-sm btn-delete" onclick="deleteDriver('${driver.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading drivers:', error);
        showNotification('Error loading drivers', 'error');
    }
}

async function searchDrivers() {
    if (!currentServiceUser) {
        return;
    }

    const firstName = document.getElementById('driverSearchFirst').value;
    const lastName = document.getElementById('driverSearchLast').value;
    const email = document.getElementById('driverSearchEmail').value;
    const phone = document.getElementById('driverSearchPhone').value;

    const params = new URLSearchParams();
    if (firstName) params.append('firstName', firstName);
    if (lastName) params.append('lastName', lastName);
    if (email) params.append('emailAddress', email);
    if (phone) params.append('phoneNo', phone);

    if (!firstName && !lastName && !email && !phone) {
        loadAllDrivers();
        return;
    }

    try {
        const response = await fetch(`${API_ENDPOINTS.DRIVERS}/search?${params.toString()}`);
        const drivers = await response.json();
        const visibleDrivers = getVisibleDrivers(Array.isArray(drivers) ? drivers : []);

        const tbody = document.querySelector('#driversTable tbody');
        if (!visibleDrivers || visibleDrivers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No drivers found</td></tr>';
            return;
        }

        tbody.innerHTML = visibleDrivers.map(driver => `
            <tr>
                <td>${driver.firstName}</td>
                <td>${driver.lastName}</td>
                <td>${driver.emailAddress}</td>
                <td>${driver.phoneNo}</td>
                <td>${driver.city}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-secondary" onclick="copyTextToClipboard('${driver.id}')">Copy ID</button>
                    <button class="btn btn-sm btn-edit" onclick="editDriver('${driver.id}')">Edit</button>
                    <button class="btn btn-sm btn-delete" onclick="deleteDriver('${driver.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        showNotification('Error searching drivers', 'error');
    }
}

async function editDriver(driverId) {
    try {
        const response = await fetch(`${API_ENDPOINTS.DRIVERS}/${driverId}`);
        const driver = await response.json();

        if (!hasDriverAccess(driver)) {
            showNotification('You do not have access to this driver', 'error');
            return;
        }

        currentEditType = 'driver';
        currentEditId = driverId;
        currentEditDriverServiceUserId = driver.serviceUserID ?? currentServiceUser?.id ?? null;

        const editForm = document.getElementById('editForm');
        editForm.innerHTML = `
            <div class="form-group">
                <label for="editDriverFirstName">First Name:</label>
                <input type="text" id="editDriverFirstName" value="${driver.firstName}" required>
            </div>
            <div class="form-group">
                <label for="editDriverLastName">Last Name:</label>
                <input type="text" id="editDriverLastName" value="${driver.lastName}" required>
            </div>
            <div class="form-group">
                <label for="editDriverEmail">Email:</label>
                <input type="email" id="editDriverEmail" value="${driver.emailAddress}" required>
            </div>
            <div class="form-group">
                <label for="editDriverPhone">Phone:</label>
                <input type="tel" id="editDriverPhone" value="${driver.phoneNo}" required>
            </div>
            <div class="form-group">
                <label for="editDriverAddress">Address:</label>
                <input type="text" id="editDriverAddress" value="${driver.address}" required>
            </div>
            <div class="form-group">
                <label for="editDriverCity">City:</label>
                <input type="text" id="editDriverCity" value="${driver.city}" required>
            </div>
            <div class="form-group">
                <label for="editDriverZip">Zip Code:</label>
                <input type="text" id="editDriverZip" value="${driver.zipCode}" required>
            </div>
            <div class="form-group">
                <label for="editDriverLicenceExp">Licence Expiration:</label>
                <input type="date" id="editDriverLicenceExp" value="${driver.licenceExpiration.split('T')[0]}" required>
            </div>
            <div class="form-group">
                <label for="editDriverServiceUserID">ServiceUser ID:</label>
                <input type="text" id="editDriverServiceUserID" value="${currentEditDriverServiceUserId ?? ''}" readonly>
            </div>
            <button type="button" class="btn btn-primary" onclick="saveEditedDriver()">Save Changes</button>
        `;

        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        showNotification('Error loading driver details', 'error');
    }
}

async function saveEditedDriver() {
    const driver = {
        firstName: document.getElementById('editDriverFirstName').value,
        lastName: document.getElementById('editDriverLastName').value,
        emailAddress: document.getElementById('editDriverEmail').value,
        phoneNo: document.getElementById('editDriverPhone').value,
        address: document.getElementById('editDriverAddress').value,
        city: document.getElementById('editDriverCity').value,
        zipCode: document.getElementById('editDriverZip').value,
        licenceExpiration: document.getElementById('editDriverLicenceExp').value,
        serviceUserID: currentEditDriverServiceUserId ?? currentServiceUser?.id ?? null
    };

    try {
        const response = await fetch(`${API_ENDPOINTS.DRIVERS}/${currentEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(driver)
        });

        if (response.ok) {
            showNotification('Driver updated successfully!');
            closeEditModal();
            loadAllDrivers();
        } else {
            showNotification('Error updating driver', 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function deleteDriver(driverId) {
    if (confirm('Are you sure you want to delete this driver?')) {
        try {
            const response = await fetch(`${API_ENDPOINTS.DRIVERS}/${driverId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showNotification('Driver deleted successfully!');
                loadAllDrivers();
            } else {
                showNotification('Error deleting driver', 'error');
            }
        } catch (error) {
            showNotification('Error: ' + error.message, 'error');
        }
    }
}

// ===============================
// SERVICE ENTRIES MANAGEMENT
// ===============================
document.getElementById('addServiceEntryForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const entry = {
        id: generateGuid(),
        carId: document.getElementById('entryCarId').value,
        driverId: document.getElementById('entryDriverId').value,
        mileage: parseInt(document.getElementById('entryMileage').value),
        accidentDetails: document.getElementById('entryAccident').value || 'None'
    };

    try {
        const response = await fetch(API_ENDPOINTS.SERVICE_ENTRIES, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
        });

        if (response.ok) {
            showNotification('Service entry added successfully!');
            this.reset();
            loadAllServiceEntries();
        } else {
            showNotification('Error adding service entry', 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
});

async function loadAllServiceEntries() {
    try {
        const response = await fetch(API_ENDPOINTS.SERVICE_ENTRIES);
        let entries = await response.json();
        entries = Array.isArray(entries) ? entries : [];

        if (!isCurrentServiceUserAdmin()) {
            const ownDriverIds = await getOwnDriverIds();
            entries = entries.filter(e => ownDriverIds.has(String(e.driverId)));
        }

        const tbody = document.querySelector('#serviceEntriesTable tbody');

        if (entries.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No service entries found</td></tr>';
            return;
        }

        tbody.innerHTML = entries.map(entry => `
            <tr>
                <td>${entry.id.substring(0, 8)}</td>
                <td>${entry.carId.substring(0, 8)}</td>
                <td>${entry.driverId.substring(0, 8)}</td>
                <td>${entry.mileage}</td>
                <td>${entry.accidentDetails}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-edit" onclick="editServiceEntry('${entry.id}')">Edit</button>
                    <button class="btn btn-sm btn-delete" onclick="deleteServiceEntry('${entry.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading service entries:', error);
        showNotification('Error loading service entries', 'error');
    }
}

async function editServiceEntry(entryId) {
    try {
        const response = await fetch(`${API_ENDPOINTS.SERVICE_ENTRIES}/${entryId}`);
        const entry = await response.json();

        currentEditType = 'serviceEntry';
        currentEditId = entryId;

        const editForm = document.getElementById('editForm');
        editForm.innerHTML = `
            <div class="form-group">
                <label for="editEntryCarId">Car ID:</label>
                <input type="text" id="editEntryCarId" value="${entry.carId}" required>
            </div>
            <div class="form-group">
                <label for="editEntryDriverId">Driver ID:</label>
                <input type="text" id="editEntryDriverId" value="${entry.driverId}" required>
            </div>
            <div class="form-group">
                <label for="editEntryMileage">Mileage:</label>
                <input type="number" id="editEntryMileage" value="${entry.mileage}" required>
            </div>
            <div class="form-group">
                <label for="editEntryAccident">Accident:</label>
                <textarea id="editEntryAccident" rows="3">${entry.accidentDetails}</textarea>
            </div>
            <button type="button" class="btn btn-primary" onclick="saveEditedServiceEntry()">Save Changes</button>
        `;

        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        showNotification('Error loading service entry details', 'error');
    }
}

async function saveEditedServiceEntry() {
    const entry = {
        carId: document.getElementById('editEntryCarId').value,
        driverId: document.getElementById('editEntryDriverId').value,
        mileage: parseInt(document.getElementById('editEntryMileage').value),
        accidentDetails: document.getElementById('editEntryAccident').value || 'None'
    };

    try {
        const response = await fetch(`${API_ENDPOINTS.SERVICE_ENTRIES}/${currentEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
        });

        if (response.ok) {
            showNotification('Service entry updated successfully!');
            closeEditModal();
            loadAllServiceEntries();
        } else {
            showNotification('Error updating service entry', 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function deleteServiceEntry(entryId) {
    if (confirm('Are you sure you want to delete this service entry?')) {
        try {
            const response = await fetch(`${API_ENDPOINTS.SERVICE_ENTRIES}/${entryId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showNotification('Service entry deleted successfully!');
                loadAllServiceEntries();
            } else {
                showNotification('Error deleting service entry', 'error');
            }
        } catch (error) {
            showNotification('Error: ' + error.message, 'error');
        }
    }
}

// ===============================
// DRIVER ALERTS MANAGEMENT
// ===============================
document.getElementById('addAlertForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const alert = {
        id: generateGuid(),
        driverId: document.getElementById('alertDriverId').value,
        typeId: document.getElementById('alertTypeId').value,
        expiration: document.getElementById('alertExpiration').value
    };

    try {
        const response = await fetch(API_ENDPOINTS.DRIVER_ALERTS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alert)
        });

        if (response.ok) {
            showNotification('Alert added successfully!');
            this.reset();
            loadAllAlerts();
        } else {
            showNotification('Error adding alert', 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
});

async function loadAllAlerts() {
    try {
        const response = await fetch(API_ENDPOINTS.DRIVER_ALERTS);
        let alerts = await response.json();
        alerts = Array.isArray(alerts) ? alerts : [];

        if (!isCurrentServiceUserAdmin()) {
            const ownDriverIds = await getOwnDriverIds();
            alerts = alerts.filter(a => ownDriverIds.has(String(a.driverId)));
        }

        const tbody = document.querySelector('#alertsTable tbody');

        if (alerts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="no-data">No alerts found</td></tr>';
            return;
        }

        tbody.innerHTML = alerts.map(alert => `
            <tr>
                <td>${alert.id.substring(0, 8)}</td>
                <td>${alert.driverId.substring(0, 8)}</td>
                <td>${alert.typeId.substring(0, 8)}</td>
                <td>${new Date(alert.expiration).toLocaleDateString()}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-edit" onclick="editAlert('${alert.id}')">Edit</button>
                    <button class="btn btn-sm btn-delete" onclick="deleteAlert('${alert.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading alerts:', error);
        showNotification('Error loading alerts', 'error');
    }
}

async function editAlert(alertId) {
    try {
        const response = await fetch(`${API_ENDPOINTS.DRIVER_ALERTS}/${alertId}`);
        const alert = await response.json();

        currentEditType = 'alert';
        currentEditId = alertId;

        const editForm = document.getElementById('editForm');
        editForm.innerHTML = `
            <div class="form-group">
                <label for="editAlertDriverId">Driver ID:</label>
                <input type="text" id="editAlertDriverId" value="${alert.driverId}" required>
            </div>
            <div class="form-group">
                <label for="editAlertTypeId">Alert Type:</label>
                <select id="editAlertTypeId" required></select>
            </div>
            <div class="form-group">
                <label for="editAlertExpiration">Expiration:</label>
                <input type="date" id="editAlertExpiration" value="${alert.expiration.split('T')[0]}" required>
            </div>
            <button type="button" class="btn btn-primary" onclick="saveEditedAlert()">Save Changes</button>
        `;

        await renderDriverAlertTypeSelect('editAlertTypeId', alert.typeId);

        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        showNotification('Error loading alert details', 'error');
    }
}

async function saveEditedAlert() {
    const alert = {
        driverId: document.getElementById('editAlertDriverId').value,
        typeId: document.getElementById('editAlertTypeId').value,
        expiration: document.getElementById('editAlertExpiration').value
    };

    try {
        const response = await fetch(`${API_ENDPOINTS.DRIVER_ALERTS}/${currentEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alert)
        });

        if (response.ok) {
            showNotification('Alert updated successfully!');
            closeEditModal();
            loadAllAlerts();
        } else {
            showNotification('Error updating alert', 'error');
        }
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function deleteAlert(alertId) {
    if (confirm('Are you sure you want to delete this alert?')) {
        try {
            const response = await fetch(`${API_ENDPOINTS.DRIVER_ALERTS}/${alertId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showNotification('Alert deleted successfully!');
                loadAllAlerts();
            } else {
                showNotification('Error deleting alert', 'error');
            }
        } catch (error) {
            showNotification('Error: ' + error.message, 'error');
        }
    }
}

// ===============================
// UTILITY FUNCTIONS
// ===============================
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('editForm').innerHTML = '';
    currentEditType = null;
    currentEditId = null;
    currentEditDriverServiceUserId = null;
}

async function loadDriverAlertTypes() {
    if (driverAlertTypesCache.length === 0) {
        try {
            const response = await fetch(API_ENDPOINTS.DRIVER_ALERT_TYPES);
            const types = await response.json();
            driverAlertTypesCache = Array.isArray(types) ? types : [];
        } catch (error) {
            driverAlertTypesCache = [];
        }
    }

    await renderDriverAlertTypeSelect('alertTypeId');
    return driverAlertTypesCache;
}

async function renderDriverAlertTypeSelect(selectId, selectedTypeId = '') {
    const select = document.getElementById(selectId);
    if (!select) {
        return;
    }

    if (driverAlertTypesCache.length === 0) {
        try {
            const response = await fetch(API_ENDPOINTS.DRIVER_ALERT_TYPES);
            const types = await response.json();
            driverAlertTypesCache = Array.isArray(types) ? types : [];
        } catch (error) {
            driverAlertTypesCache = [];
        }
    }

    if (driverAlertTypesCache.length === 0) {
        select.innerHTML = '<option value="">No alert types available</option>';
        return;
    }

    select.innerHTML = [
        '<option value="">Select alert type</option>',
        ...driverAlertTypesCache.map(type => {
            const typeId = String(type.id ?? '');
            const typeName = String(type.name ?? '');
            const selected = typeId === String(selectedTypeId) ? 'selected' : '';
            return `<option value="${typeId}" ${selected}>${typeName}</option>`;
        })
    ].join('');
}

function generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
});

// Load data on page load
window.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutButton = document.getElementById('logoutButton');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                await loginServiceUser(
                    document.getElementById('loginUserName').value,
                    document.getElementById('loginPassword').value
                );
                this.reset();
                showNotification('Logged in successfully!');
            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                await registerServiceUser();
                this.reset();
                showNotification('ServiceUser account created successfully!');
            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', logoutServiceUser);
    }

    restoreSession().then(isLoggedIn => {
        applyCurrentServiceUserToDriverForm();
        if (isLoggedIn) {
            switchTab('cars');
            loadDriverAlertTypes();
        }
    });
});