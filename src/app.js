// ============================================================
// THANK DRIVER APP - COMPLETE BACKEND CONNECTION
// ============================================================

// ===== CONFIGURATION =====
const config = {
  region: 'ca-central-1',
  userPoolId: 'ca-central-1_vLD2N4XUu',
  userPoolClientId: '5qjvmh5c8j7aulqdgrbca95lld',
  identityPoolId: 'ca-central-1:eb88e23e-07cc-4f9f-8743-5ee86c0cc937',
  apiUrl: 'https://vhfof2uzgrcibn6fay4pux7rtm.appsync-api.ca-central-1.amazonaws.com/graphql',
  apiKey: 'da2-5vnd5cpnlzhnvd7ljd3dlbtyaq'
};

// ===== GRAPHQL QUERIES & MUTATIONS =====
const queries = {
  listDrivers: `
    query ListDrivers($filter: ModelDriverFilterInput) {
      listDrivers(filter: $filter) {
        items {
          id
          name
          email
          company
          rating
          yearsExperience
          photoUrl
          qrCodeUrl
          status
          createdAt
        }
      }
    }
  `,
  getDriver: `
    query GetDriver($id: ID!) {
      getDriver(id: $id) {
        id
        name
        email
        company
        rating
        yearsExperience
        photoUrl
        qrCodeUrl
        status
      }
    }
  `,
  listThankYous: `
    query ListThankYous($filter: ModelThankYouFilterInput) {
      listThankYous(filter: $filter) {
        items {
          id
          driverId
          senderName
          message
          points
          createdAt
        }
      }
    }
  `
};

const mutations = {
  createDriver: `
    mutation CreateDriver($input: CreateDriverInput!) {
      createDriver(input: $input) {
        id
        name
        email
        status
        createdAt
      }
    }
  `,
  createThankYou: `
    mutation CreateThankYou($input: CreateThankYouInput!) {
      createThankYou(input: $input) {
        id
        driverId
        senderName
        message
        points
        createdAt
      }
    }
  `,
  updateDriver: `
    mutation UpdateDriver($input: UpdateDriverInput!) {
      updateDriver(input: $input) {
        id
        name
        status
        rating
      }
    }
  `
};

// ===== API HELPER =====
async function graphqlRequest(query, variables = {}) {
  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey
      },
      body: JSON.stringify({ query, variables })
    });

    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    return result.data;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ===== SEARCH DRIVERS (APPROVED ONLY) =====
async function searchDrivers() {
  const input = document.getElementById('searchInput');
  const term = input.value.trim().toLowerCase();
  const resultsContainer = document.getElementById('searchResults');

  if (!term) {
    resultsContainer.innerHTML = '';
    return;
  }

  try {
    resultsContainer.innerHTML = '<div style="text-align:center; padding:20px;"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';

    const result = await graphqlRequest(queries.listDrivers, {
      filter: { status: { eq: 'APPROVED' } }
    });

    const allDrivers = result?.listDrivers?.items || [];
    const drivers = allDrivers.filter(driver =>
      driver.name.toLowerCase().includes(term) ||
      (driver.company && driver.company.toLowerCase().includes(term))
    );

    if (drivers.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align:center; padding:20px; color:#999;">
          <i class="fas fa-search" style="display:block; font-size:2rem; margin-bottom:8px;"></i>
          No approved drivers found. Try a different search.
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div style="font-weight:600; margin:8px 0 12px; font-size:0.9rem;">
        Search Results (${drivers.length})
      </div>
      ${drivers.map(driver => `
        <div class="search-result-item" onclick="selectDriver('${driver.id}')" style="background:#f5efe2; padding:14px 18px; border-radius:16px; margin-bottom:10px; cursor:pointer; border:2px solid transparent;">
          <div>
            <span style="font-weight:600; font-size:1rem;">${driver.name}</span>
            <span style="float:right; color:#d9a50b;">⭐ ${driver.rating || 0}</span>
          </div>
          <div style="font-size:0.8rem; color:#5d5346;">${driver.company || ''} ${driver.yearsExperience ? `· ${driver.yearsExperience} years` : ''}</div>
        </div>
      `).join('')}
    `;
  } catch (error) {
    resultsContainer.innerHTML = `
      <div style="text-align:center; padding:20px; color:#ef4444;">
        <i class="fas fa-exclamation-circle" style="display:block; font-size:2rem; margin-bottom:8px;"></i>
        Error: ${error.message}
      </div>
    `;
  }
}

// ===== SELECT DRIVER =====
async function selectDriver(driverId) {
  try {
    const result = await graphqlRequest(queries.getDriver, { id: driverId });
    const driver = result?.getDriver;
    
    if (!driver) {
      showToast('❌ Driver not found');
      return;
    }

    const thanksResult = await graphqlRequest(queries.listThankYous, {
      filter: { driverId: { eq: driverId } }
    });
    const thanks = thanksResult?.listThankYous?.items || [];

    displayDriverProfile(driver, thanks);
  } catch (error) {
    showToast('❌ Error loading driver: ' + error.message);
  }
}

// ===== DISPLAY DRIVER PROFILE =====
function displayDriverProfile(driver, thanks) {
  const container = document.getElementById('selectedDriverContainer');

  const thanksHtml = thanks.map(thank => `
    <div style="background:#f5efe2; padding:12px 16px; border-radius:12px; margin:8px 0;">
      <div style="display:flex; justify-content:space-between;">
        <strong>${thank.senderName || 'Anonymous'}</strong>
        <span style="color:#d9a50b;">⭐ ${thank.points} pts</span>
      </div>
      <p style="margin-top:4px;">${thank.message}</p>
      <div style="font-size:0.75rem; color:#999;">${new Date(thank.createdAt).toLocaleDateString()}</div>
    </div>
  `).join('');

  container.innerHTML = `
    <div style="background: #fcf7ec; border-radius:20px; padding:22px 20px; border-left:6px solid #f5c518; margin:12px 0;">
      <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
        <div style="width:60px; height:60px; border-radius:50%; background:#ffe066; display:flex; align-items:center; justify-content:center; font-size:30px; border:2px solid #f5c518;">
          <i class="fas fa-user-circle"></i>
        </div>
        <div>
          <strong style="font-size:1.1rem;">${driver.name}</strong>
          <span style="background:#f5c518; padding:3px 16px; border-radius:40px; font-size:0.7rem; font-weight:600;">⭐ ${driver.rating || 0}</span><br>
          <span style="font-size:0.85rem; color:#5d5346;">${driver.company || ''} ${driver.yearsExperience ? `· ${driver.yearsExperience} years` : ''}</span>
        </div>
        ${driver.qrCodeUrl ? `<span style="margin-left:auto; background:#f5c518; border-radius:40px; padding:3px 16px; font-size:0.7rem; font-weight:600;">QR Code</span>` : ''}
      </div>

      <div style="margin:16px 0;">
        <strong><i class="fas fa-heart"></i> Thank Yous (${thanks.length})</strong>
        ${thanksHtml || '<div style="color:#999; margin-top:8px;">No thank yous yet. Be the first!</div>'}
      </div>

      <div style="background:#f5efe2; border-radius:16px; padding:14px 16px; margin:10px 0 12px;">
        <div style="font-weight:600; font-size:0.9rem; margin-bottom:8px;">
          <i class="fas fa-paper-plane"></i> Send a Thank You
        </div>
        <div style="margin-bottom:8px;">
          <input type="text" id="thankYouSender" placeholder="Your name" style="width:100%; padding:10px 16px; border-radius:40px; border:1.5px solid #ddd; background:white; font-size:1rem;">
        </div>
        <div style="margin-bottom:8px;">
          <textarea id="thankYouMessage" placeholder="Write your message..." style="width:100%; padding:10px 16px; border-radius:16px; border:1.5px solid #ddd; background:white; font-size:1rem; min-height:60px; resize:vertical;"></textarea>
        </div>
        <div style="display:flex; gap:12px; align-items:center; margin-bottom:8px;">
          <label style="font-weight:600; font-size:0.9rem;">Points:</label>
          <select id="thankYouPoints" style="padding:8px 16px; border-radius:40px; border:1.5px solid #ddd; background:white;">
            <option value="5">5</option>
            <option value="10" selected>10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <button onclick="sendThankYou('${driver.id}')" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; background:#22c55e; border:none; padding:12px 24px; border-radius:60px; font-weight:600; color:white; cursor:pointer; width:100%; border:1px solid #16a34a;">
          <i class="fas fa-paper-plane"></i> Send Thank You
        </button>
      </div>

      <button onclick="closeDriverProfile()" style="margin-top:8px; background:none; border:none; color:#666; cursor:pointer;">
        ← Back to Search
      </button>
    </div>
  `;

  container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function closeDriverProfile() {
  document.getElementById('selectedDriverContainer').innerHTML = '';
}

// ===== SEND THANK YOU =====
async function sendThankYou(driverId) {
  const senderName = document.getElementById('thankYouSender').value || 'Anonymous';
  const message = document.getElementById('thankYouMessage').value;
  const points = parseInt(document.getElementById('thankYouPoints').value) || 10;

  if (!message) {
    showToast('❌ Please write a message');
    return;
  }

  try {
    const result = await graphqlRequest(mutations.createThankYou, {
      input: {
        driverId: driverId,
        senderName: senderName,
        message: message,
        points: points
      }
    });

    showToast('✅ Thank you sent successfully!');
    await selectDriver(driverId);
  } catch (error) {
    showToast('❌ Failed to send: ' + error.message);
  }
}

// ===== REGISTER DRIVER =====
async function registerDriver() {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const company = document.getElementById('regCompany').value;
  const password = document.getElementById('regPassword').value;
  const yearsExperience = parseInt(document.getElementById('regYears').value) || 0;

  if (!name || !email || !password) {
    showToast('❌ Please fill in all required fields');
    return;
  }

  try {
    const result = await graphqlRequest(mutations.createDriver, {
      input: {
        name: name,
        email: email,
        company: company || '',
        password: password,
        yearsExperience: yearsExperience,
        status: 'PENDING'
      }
    });

    showToast('✅ Registration submitted! Waiting for admin approval.');
    
    document.getElementById('regName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regCompany').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regYears').value = '';
  } catch (error) {
    showToast('❌ Registration failed: ' + error.message);
  }
}

// ===== ADMIN FUNCTIONS =====
async function loadAdminPanel() {
  const adminContent = document.getElementById('adminContent');
  if (!adminContent) return;

  try {
    const result = await graphqlRequest(queries.listDrivers, {
      filter: { status: { eq: 'PENDING' } }
    });

    const pendingDrivers = result?.listDrivers?.items || [];

    adminContent.innerHTML = `
      <div style="background:#2d2a24; color:#f0e8d8; border-radius:24px; padding:24px 20px; margin:24px 0; border:1px solid #4d453c;">
        <h3 style="color:#f5c518;"><i class="fas fa-user-shield"></i> Admin Dashboard</h3>
        <p style="font-size:0.85rem; opacity:0.8; margin:4px 0 12px;">Approve or reject driver registrations</p>

        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin:16px 0 20px;">
          <div style="background:#3d3730; padding:12px 8px; border-radius:16px; text-align:center;">
            <span style="font-size:1.5rem; font-weight:700; color:#f5c518; display:block;">${pendingDrivers.length}</span>
            <span style="font-size:0.6rem; opacity:0.7; text-transform:uppercase;">Pending</span>
          </div>
        </div>

        ${pendingDrivers.length === 0 ? '<div style="color:#999;">No pending registrations</div>' : ''}

        ${pendingDrivers.map(driver => `
          <div style="background:#3d3730; padding:12px 18px; border-radius:16px; margin:6px 0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div>
              <strong>${driver.name}</strong>
              <div style="font-size:0.85rem; color:#999;">${driver.email} ${driver.company ? `· ${driver.company}` : ''}</div>
            </div>
            <div style="display:flex; gap:8px;">
              <button onclick="approveDriver('${driver.id}')" style="background:#22c55e; border:none; padding:6px 14px; border-radius:40px; font-size:0.75rem; font-weight:600; color:white; cursor:pointer;">
                <i class="fas fa-check"></i> Approve
              </button>
              <button onclick="rejectDriver('${driver.id}')" style="background:#ef4444; border:none; padding:6px 14px; border-radius:40px; font-size:0.75rem; font-weight:600; color:white; cursor:pointer;">
                <i class="fas fa-times"></i> Reject
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    adminContent.innerHTML = `<div style="color:#ef4444;">Error loading admin panel: ${error.message}</div>`;
  }
}

async function approveDriver(driverId) {
  if (!confirm('Approve this driver?')) return;
  try {
    await graphqlRequest(mutations.updateDriver, {
      input: { id: driverId, status: 'APPROVED' }
    });
    showToast('✅ Driver approved!');
    await loadAdminPanel();
  } catch (error) {
    showToast('❌ Error: ' + error.message);
  }
}

async function rejectDriver(driverId) {
  if (!confirm('Reject this driver?')) return;
  try {
    await graphqlRequest(mutations.updateDriver, {
      input: { id: driverId, status: 'REJECTED' }
    });
    showToast('❌ Driver rejected');
    await loadAdminPanel();
  } catch (error) {
    showToast('❌ Error: ' + error.message);
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚌 Thank Driver App with real backend!');
  
  const registerBtn = document.querySelector('#registerSection .btn');
  if (registerBtn) {
    registerBtn.onclick = registerDriver;
  }

  // Admin panel - 5 taps on logo
  let tapCount = 0;
  let tapTimer = null;
  const logo = document.getElementById('logoArea');
  const adminPanel = document.getElementById('adminPanel');

  if (logo) {
    logo.addEventListener('click', function(e) {
      e.stopPropagation();
      tapCount++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => { tapCount = 0; }, 700);
      if (tapCount >= 5) {
        tapCount = 0;
        if (adminPanel.classList.contains('admin-hidden')) {
          const pwd = prompt('🔐 Admin password required');
          if (pwd === 'admin123') {
            adminPanel.classList.remove('admin-hidden');
            showToast('🔓 Admin panel unlocked');
            loadAdminPanel();
          } else if (pwd !== null) {
            showToast('❌ Wrong password');
          }
        } else {
          adminPanel.classList.add('admin-hidden');
          showToast('🔒 Admin panel locked');
        }
      }
    });
  }
});

// ===== MAKE GLOBALS =====
window.searchDrivers = searchDrivers;
window.selectDriver = selectDriver;
window.closeDriverProfile = closeDriverProfile;
window.sendThankYou = sendThankYou;
window.registerDriver = registerDriver;
window.approveDriver = approveDriver;
window.rejectDriver = rejectDriver;
window.loadAdminPanel = loadAdminPanel;

console.log('✅ Thank Driver App loaded successfully!');
