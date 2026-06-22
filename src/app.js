// ============================================================
// ===== THANK DRIVER APP - FULL JAVASCRIPT =====
// ============================================================

// ===== STATE =====
let currentUser = null;
let currentDriver = null;
let isAdmin = false;

// ===== AUTH FUNCTIONS =====
function showAuthModal() {
  document.getElementById('authModal').classList.add('active');
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('authTitle').textContent = 'Sign In';
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('active');
}

function showRegister() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('authTitle').textContent = 'Register as Driver';
}

function showLogin() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('authTitle').textContent = 'Sign In';
}

// ===== HANDLE LOGIN =====
function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !password) {
    showToast('❌ Please enter email and password');
    return;
  }
  
  // Simulate login (replace with actual Amplify auth later)
  currentUser = { email, name: 'Test User' };
  updateAuthUI(true);
  closeAuthModal();
  showToast('✅ Welcome back, ' + email + '!');
}

// ===== HANDLE REGISTER =====
function handleRegister() {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const company = document.getElementById('regCompany').value;
  const busNumber = document.getElementById('regBusNumber').value;
  const phone = document.getElementById('regPhone').value;
  const bio = document.getElementById('regBio').value;
  const years = parseInt(document.getElementById('regYears').value) || 0;
  
  // Get wishlist items
  const wishlistItems = [];
  document.querySelectorAll('.wishlist-input').forEach(container => {
    const nameInput = container.querySelector('.wishlist-name');
    const pointsInput = container.querySelector('.wishlist-points');
    if (nameInput && pointsInput && nameInput.value) {
      wishlistItems.push({
        name: nameInput.value,
        points: parseInt(pointsInput.value) || 0,
        icon: 'fa-gift'
      });
    }
  });
  
  if (!name || !email || !password) {
    showToast('❌ Please fill in all required fields');
    return;
  }
  
  // Simulate registration
  showToast('✅ Registration submitted! Waiting for admin approval.');
  closeAuthModal();
  
  // Auto login
  currentUser = { email, name };
  updateAuthUI(true);
}

// ===== UPDATE UI =====
function updateAuthUI(loggedIn) {
  const btn = document.getElementById('authBtn');
  if (loggedIn && currentUser) {
    btn.innerHTML = `<i class="fas fa-user-check"></i> ${currentUser.name || currentUser.email}`;
    btn.onclick = () => {
      currentUser = null;
      updateAuthUI(false);
      showToast('👋 Signed out');
    };
  } else {
    btn.innerHTML = `<i class="fas fa-user"></i> Sign In`;
    btn.onclick = showAuthModal;
  }
}

// ===== WISHLIST =====
function addWishlistItem() {
  const container = document.getElementById('wishlistContainer');
  const div = document.createElement('div');
  div.className = 'wishlist-input';
  div.style.cssText = 'display:flex; gap:8px; margin-top:8px;';
  div.innerHTML = `
    <input type="text" placeholder="Item name" class="wishlist-name" style="flex:1; padding:8px 12px; border-radius:8px; border:1px solid #ddd;">
    <input type="number" placeholder="Points" class="wishlist-points" style="width:80px; padding:8px 12px; border-radius:8px; border:1px solid #ddd;">
    <button onclick="this.parentElement.remove()" class="btn-sm btn-red" style="padding:4px 12px;">
      <i class="fas fa-times"></i>
    </button>
  `;
  container.appendChild(div);
}

// ===== SEARCH DRIVERS =====
function searchDrivers() {
  const input = document.getElementById('searchInput');
  const term = input.value.trim().toLowerCase();
  const resultsContainer = document.getElementById('searchResults');
  
  if (!term) {
    resultsContainer.innerHTML = '';
    return;
  }
  
  // Mock driver data
  const drivers = [
    { id: '1', name: 'Michael Rivera', company: 'First Student', busNumber: '#12', rating: 4.8, status: 'approved' },
    { id: '2', name: 'Lisa Park', company: 'Durham Services', busNumber: '#7', rating: 4.9, status: 'approved' },
    { id: '3', name: 'James Carter', company: 'First Student', busNumber: '#5', rating: 4.7, status: 'approved' },
    { id: '4', name: 'Sarah Johnson', company: 'Independent', busNumber: '#3', rating: 4.5, status: 'approved' },
  ];
  
  const results = drivers.filter(driver => 
    driver.name.toLowerCase().includes(term) || 
    driver.company.toLowerCase().includes(term) ||
    driver.busNumber.includes(term)
  );
  
  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <div style="text-align:center; padding:20px; color:#999;">
        <i class="fas fa-search" style="display:block; font-size:2rem; margin-bottom:8px;"></i>
        No drivers found. Try a different search.
      </div>
    `;
    return;
  }
  
  resultsContainer.innerHTML = results.map(driver => `
    <div class="search-result" onclick="loadDriverProfile('${driver.id}')">
      <div>
        <strong>${driver.name}</strong>
        <div style="font-size:0.85rem; color:#666;">
          ${driver.company} · Bus ${driver.busNumber}
        </div>
      </div>
      <div>
        ${driver.rating ? `⭐ ${driver.rating}` : ''}
      </div>
    </div>
  `).join('');
}

// ===== LOAD DRIVER PROFILE =====
function loadDriverProfile(driverId) {
  // Mock driver data
  const drivers = {
    '1': { id: '1', name: 'Michael Rivera', company: 'First Student', busNumber: '#12', rating: 4.8, bio: '20 years experience', wishlist: [{ name: 'Coffee Gift Card', points: 5, icon: 'fa-mug-hot' }, { name: 'Book', points: 10, icon: 'fa-book' }], thanks: [{ message: 'Great driver!', points: 10, senderName: 'Sarah', createdAt: '2026-06-22' }] },
    '2': { id: '2', name: 'Lisa Park', company: 'Durham Services', busNumber: '#7', rating: 4.9, bio: '15 years experience', wishlist: [{ name: 'Starbucks Card', points: 5, icon: 'fa-coffee' }], thanks: [] },
    '3': { id: '3', name: 'James Carter', company: 'First Student', busNumber: '#5', rating: 4.7, bio: '10 years experience', wishlist: [], thanks: [] },
    '4': { id: '4', name: 'Sarah Johnson', company: 'Independent', busNumber: '#3', rating: 4.5, bio: '8 years experience', wishlist: [], thanks: [] },
  };
  
  const driver = drivers[driverId];
  if (!driver) {
    showToast('❌ Driver not found');
    return;
  }
  
  currentDriver = driver;
  displayDriverProfile(driver);
}

// ===== DISPLAY DRIVER PROFILE =====
function displayDriverProfile(driver) {
  const container = document.getElementById('driverProfile');
  const content = document.getElementById('driverProfileContent');
  
  container.style.display = 'block';
  document.getElementById('searchResults').innerHTML = '';
  
  const wishlistHtml = (driver.wishlist || []).map(item => `
    <div style="display:flex; align-items:center; gap:12px; padding:10px 14px; background:#f5efe2; border-radius:12px; margin:8px 0;">
      <span style="font-size:24px;"><i class="fas ${item.icon || 'fa-gift'}"></i></span>
      <div style="flex:1;">
        <strong>${item.name}</strong>
      </div>
      <span style="color:#d9a50b; font-weight:600;">⭐ ${item.points} pts</span>
    </div>
  `).join('');
  
  const thanksHtml = (driver.thanks || []).map(thank => `
    <div style="background:#f5efe2; padding:12px 16px; border-radius:12px; margin:8px 0;">
      <div style="display:flex; justify-content:space-between;">
        <strong>${thank.senderName || 'Anonymous'}</strong>
        <span style="color:#d9a50b;">⭐ ${thank.points} pts</span>
      </div>
      <p style="margin-top:4px;">${thank.message || 'Thank you for your service!'}</p>
      <div style="font-size:0.75rem; color:#999;">${new Date(thank.createdAt).toLocaleDateString()}</div>
    </div>
  `).join('');
  
  content.innerHTML = `
    <div class="driver-profile-card">
      <div class="header">
        <div class="avatar"><i class="fas fa-user-circle"></i></div>
        <div>
          <h2>${driver.name}</h2>
          <div style="color:#666;">${driver.company} · Bus ${driver.busNumber}</div>
          ${driver.bio ? `<div style="margin-top:4px; color:#666;">${driver.bio}</div>` : ''}
        </div>
        <span style="margin-left:auto;">⭐ ${driver.rating}</span>
      </div>
      
      <div style="margin:16px 0;">
        <strong><i class="fas fa-gift"></i> Wishlist</strong>
        ${wishlistHtml || '<div style="color:#999;">No wishlist items yet</div>'}
      </div>
      
      <div style="margin:16px 0;">
        <strong><i class="fas fa-heart"></i> Thank Yous (${(driver.thanks || []).length})</strong>
        ${thanksHtml || '<div style="color:#999; margin-top:8px;">No thank yous yet. Be the first!</div>'}
      </div>
      
      <div style="background:#f5efe2; padding:16px; border-radius:12px; margin-top:16px;">
        <h4><i class="fas fa-paper-plane"></i> Send a Thank You</h4>
        <div style="margin-top:12px;">
          <textarea id="thankYouMessage" placeholder="Write your message of appreciation..." style="width:100%; padding:12px; border-radius:12px; border:1px solid #ddd; min-height:80px; font-family:inherit;"></textarea>
          <div style="display:flex; gap:12px; margin-top:12px; flex-wrap:wrap;">
            <input type="text" id="thankYouSender" placeholder="Your name (optional)" style="flex:1; padding:10px 16px; border-radius:12px; border:1px solid #ddd;">
            <select id="thankYouPoints" style="padding:10px 16px; border-radius:12px; border:1px solid #ddd;">
              <option value="5">⭐ 5 points</option>
              <option value="10" selected>⭐ 10 points</option>
              <option value="20">⭐ 20 points</option>
              <option value="50">⭐ 50 points</option>
            </select>
          </div>
          <div style="display:flex; gap:12px; margin-top:12px;">
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" id="thankYouAnonymous"> Send anonymously
            </label>
          </div>
          <button class="btn btn-primary" onclick="sendThankYou('${driver.id}')" style="margin-top:12px; width:100%;">
            <i class="fas fa-paper-plane"></i> Send Thank You
          </button>
        </div>
      </div>
      
      <button onclick="closeDriverProfile()" style="margin-top:16px; background:none; border:none; color:#666; cursor:pointer;">
        ← Back to Search
      </button>
    </div>
  `;
  
  container.scrollIntoView({ behavior: 'smooth' });
}

// ===== CLOSE DRIVER PROFILE =====
function closeDriverProfile() {
  document.getElementById('driverProfile').style.display = 'none';
}

// ===== SEND THANK YOU =====
function sendThankYou(driverId) {
  const message = document.getElementById('thankYouMessage').value;
  const senderName = document.getElementById('thankYouSender').value;
  const points = parseInt(document.getElementById('thankYouPoints').value) || 10;
  const anonymous = document.getElementById('thankYouAnonymous').checked;
  
  if (!message) {
    showToast('❌ Please write a message');
    return;
  }
  
  // Simulate sending
  showToast('✅ Thank you sent successfully!');
  
  // Reload driver profile
  setTimeout(() => {
    loadDriverProfile(driverId);
  }, 500);
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚌 Thank Driver App initialized!');
  
  // Show some initial drivers
  loadDriverProfile('1');
});