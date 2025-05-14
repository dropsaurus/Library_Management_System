export function showPopupMessage(text, type = 'success') {
  let popup = document.getElementById('popupMessage');

  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'popupMessage';
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.right = '20px';
    popup.style.zIndex = '9999';
    popup.style.padding = '12px 20px';
    popup.style.borderRadius = '6px';
    popup.style.fontWeight = 'bold';
    popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    popup.style.color = 'white';
    popup.style.fontFamily = 'Roboto, sans-serif';
    document.body.appendChild(popup);
  }

  const colorMap = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  };

  popup.textContent = text;
  popup.style.backgroundColor = colorMap[type] || '#17a2b8';
  popup.style.display = 'block';

  setTimeout(() => {
    popup.style.display = 'none';
  }, 3000);
}
