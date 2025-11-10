document.addEventListener("DOMContentLoaded", () => {
	const cDays = document.getElementById("cDays");
	const cHours = document.getElementById("cHours");
	const cMinutes = document.getElementById("cMinutes");
	const cSeconds = document.getElementById("cSeconds");
	const startDateInput = document.getElementById("startDateInput");
	const startDateText = document.getElementById("startDateText");
	const setStartBtn = document.getElementById("setStartBtn");
  
	let startDate = localStorage.getItem("loveStartDate");
  
	if (startDate) {
	  startDate = new Date(startDate);
	  startDateText.textContent = startDate.toLocaleDateString("zh-CN");
	}
  
	setStartBtn.addEventListener("click", () => {
	  startDateInput.style.display = "block";
	  startDateInput.focus();
	});
  
	startDateInput.addEventListener("change", () => {
	  startDate = new Date(startDateInput.value);
	  localStorage.setItem("loveStartDate", startDate);
	  startDateText.textContent = startDate.toLocaleDateString("zh-CN");
	  startDateInput.style.display = "none";
	});
  
	function updateCounter() {
	  if (!startDate) return;
	  const now = new Date();
	  const diff = now - startDate;
  
	  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
	  const minutes = Math.floor((diff / (1000 * 60)) % 60);
	  const seconds = Math.floor((diff / 1000) % 60);
  
	  cDays.textContent = days;
	  cHours.textContent = hours.toString().padStart(2, "0");
	  cMinutes.textContent = minutes.toString().padStart(2, "0");
	  cSeconds.textContent = seconds.toString().padStart(2, "0");
	}
  
	setInterval(updateCounter, 1000);
	updateCounter();
  });
  