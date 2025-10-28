const form = document.getElementById("feedbackForm");
const feedbackList = document.getElementById("feedbackList");

async function loadFeedbacks() {
  const res = await fetch("/api/feedback");
  const data = await res.json();
  feedbackList.innerHTML = data.map(fb => `
    <div class="bg-white p-3 rounded shadow mb-2">
      <p class="font-bold">${fb.name}</p>
      <p>${fb.message}</p>
      <p class="text-xs text-gray-500">${new Date(fb.createdAt).toLocaleString()}</p>
    </div>
  `).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message })
  });

  form.reset();
  loadFeedbacks();
});

loadFeedbacks();
