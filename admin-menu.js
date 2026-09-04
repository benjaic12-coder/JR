// Admin Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
  const adminToggle = document.getElementById('adminToggle');
  const adminPanel = document.getElementById('adminPanel');
  const adminClose = document.getElementById('adminClose');
  const currentWhatsappDisplay = document.getElementById('currentWhatsapp');
  const whatsappFooter = document.getElementById('whatsappFooter');
  const whatsappInput = document.getElementById('whatsappInput');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'admin-overlay';
  document.body.appendChild(overlay);

  // Open admin panel
  adminToggle.addEventListener('click', function() {
    adminPanel.classList.add('active');
    overlay.classList.add('active');
  });

  // Close admin panel
  function closePanel() {
    adminPanel.classList.remove('active');
    overlay.classList.remove('active');
  }

  adminClose.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  // Keyboard shortcut to close (Escape)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && adminPanel.classList.contains('active')) {
      closePanel();
    }
  });

  // Load saved data from localStorage
  function loadSavedData() {
    const savedWhatsapp = localStorage.getItem('jr-whatsapp');
    if (savedWhatsapp) {
      currentWhatsappDisplay.textContent = savedWhatsapp;
      whatsappInput.value = savedWhatsapp;
      updateWhatsAppLinks(savedWhatsapp);
    }
  }

  // Update WhatsApp function
  window.updateWhatsApp = function() {
    const newWhatsapp = whatsappInput.value.trim();
    if (newWhatsapp) {
      localStorage.setItem('jr-whatsapp', newWhatsapp);
      currentWhatsappDisplay.textContent = newWhatsapp;
      updateWhatsAppLinks(newWhatsapp);
      alert('WhatsApp actualizado exitosamente: ' + newWhatsapp);
    } else {
      alert('Por favor ingresa un número de WhatsApp válido');
    }
  };

  // Update all WhatsApp links on the page
  function updateWhatsAppLinks(whatsapp) {
    const text = 'Hola%2C%20quiero%20consultar%20por%20un%20diagn%C3%B3stico%20para%20mi%20veh%C3%ADculo.';
    const whatsappUrl = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${text}`;
    
    // Update footer link
    if (whatsappFooter) {
      whatsappFooter.href = whatsappUrl;
      whatsappFooter.textContent = whatsapp;
    }

    // Update floating WhatsApp button
    const floatingWhatsapp = document.querySelector('.whatsapp');
    if (floatingWhatsapp) {
      floatingWhatsapp.href = whatsappUrl;
    }

    // Update all WhatsApp buttons in the page
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
      link.href = whatsappUrl;
    });
  }

  // Toggle sections visibility
  document.getElementById('toggleServicios').addEventListener('change', function() {
    const section = document.getElementById('servicios');
    if (section) section.style.display = this.checked ? 'block' : 'none';
    localStorage.setItem('jr-servicios', this.checked);
  });

  document.getElementById('toggleGaleria').addEventListener('change', function() {
    const section = document.getElementById('galeria');
    if (section) section.style.display = this.checked ? 'block' : 'none';
    localStorage.setItem('jr-galeria', this.checked);
  });

  document.getElementById('toggleFAQ').addEventListener('change', function() {
    const section = document.getElementById('faq');
    if (section) section.style.display = this.checked ? 'block' : 'none';
    localStorage.setItem('jr-faq', this.checked);
  });

  // Toggle theme
  window.toggleTheme = function() {
    const currentTheme = localStorage.getItem('jr-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    localStorage.setItem('jr-theme', newTheme);
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
    alert(`Tema cambiado a: ${newTheme === 'dark' ? 'Oscuro' : 'Claro'}`);
  };

  // Load saved data on page load
  loadSavedData();

  // Restore section visibility
  const servicios = localStorage.getItem('jr-servicios');
  const galeria = localStorage.getItem('jr-galeria');
  const faq = localStorage.getItem('jr-faq');

  if (servicios === 'false') {
    document.getElementById('servicios').style.display = 'none';
    document.getElementById('toggleServicios').checked = false;
  }
  if (galeria === 'false') {
    document.getElementById('galeria').style.display = 'none';
    document.getElementById('toggleGaleria').checked = false;
  }
  if (faq === 'false') {
    document.getElementById('faq').style.display = 'none';
    document.getElementById('toggleFAQ').checked = false;
  }

  // Restore theme
  const savedTheme = localStorage.getItem('jr-theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
});
