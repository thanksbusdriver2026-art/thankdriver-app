// ===== STATE =====
let currentUser = null;
let drivers = [
  { id: '1', name: 'Michael Rivera', company: 'First Student', bus: '#12', rating: 4.8, approved: true },
  { id: '2', name: 'Lisa Park', company: 'Durham Services', bus: '#7', rating: 4.9, approved: true },
  { id: '3', name: 'James Carter', company: 'First Student', bus: '#5', rating: 4.7, approved: true },
  { id: '4', name: 'Sarah Johnson', company: 'Independent', bus: '#3', rating: 4.5, approved: true },
];

// ===== SEARCH =====
function searchDrivers() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const list = document.getElementById('driverList');
  
  const filtered = drivers.filter(d => 
    d.approved && 
    (d.name.toLowerCase().includes(query) || 
     d.company.toLowerCase().includes(query) ||
     d.bus.includes(query))
  );
  
  if (filtered.length === 0) {
    list.innerHTML = '<p style="color:#999;">No drivers found</p>';
    return;
  }
  
  list.innerHTML = filtered.map(d => `
    <div class="driver-card" onclick="showDriver('${d.id}')">
      <strong>${d.name}</strong> ⭐ ${d.rating}
      <div style="color:#666;font-size:0.9rem;">${d.company} · Bus ${d.bus}</div>
    </div>
  `).join('');
}

// ===== SHOW DRIVER PROFILE =====
function showDriver(id) {
  const driver = drivers.find(d => d.id === id);
  if (!driver) return;
  
  const profile = document.getElementById('driverProfile');
  profile.style.display = 'block';
  profile.innerHTML = `
    <h2>${driver.name} ⭐ ${driver.rating}</h2>
    <p>${driver.company} · Bus ${driver.bus}</p>
    <textarea id="thankYouMessage" placeholder="Write your message..." style="width:100%;padding:12px;border-radius:12px;border:1px solid #ddd;min-height:80px;margin:16px 0;"></textarea>
    <button onclick="sendThankYou('${driver.id}')" class="btn btn-primary">Send Thank You</button>
    <button onclick="document.getElementById('driverProfile').style.display='none'" style="margin-top:12px;background:none;border:none;color:#666;cursor:pointer;">Close</button>
  `;
}

// ===== SEND THANK YOU =====
function sendThankYou(id) {
  const message = document.getElementById('thankYouMessage').value;
  if (!message) { showToast('Please write a message'); return; }
  showToast('✅ Thank you sent!');
  document.getElementById('driverProfile').style.display = 'none';
}

// ===== AUTH =====
function showAuth() {
  document.getElementById('authModal').style.display = 'flex';
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('authTitle').textContent = 'Sign In';
}

function closeAuth() {
  document.getElementById('authModal').style.display = 'none';
}

function showRegister() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('authTitle').textContent = 'Register';
}

function showLogin() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('authTitle').textContent = 'Sign In';
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  if (!email) { showToast('Please enter email'); return; }
  currentUser = { email };
  closeAuth();
  document.getElementById('authStatus').innerHTML = `<button onclick="handleLogout()" class="btn btn-primary">Logout</button>`;
  showToast('✅ Welcome back!');
}

function handleRegister() {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  if (!name || !email) { showToast('Please fill all fields'); return; }
  currentUser = { name, email };
  closeAuth();
  document.getElementById('authStatus').innerHTML = `<button onclick="handleLogout()" class="btn btn-primary">Logout</button>`;
  showToast('✅ Registration successful!');
}

function handleLogout() {
  currentUser = null;
  document.getElementById('authStatus').innerHTML = `<button onclick="showAuth()" class="btn btn-primary">Sign In</button>`;
  showToast('👋 Logged out');
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.style.display = 'none', 3000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', searchDrivers);
console.log('🚌 Thank Driver App loaded!');
