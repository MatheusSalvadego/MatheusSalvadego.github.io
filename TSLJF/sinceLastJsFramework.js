const hr = document.getElementById("hr");
const min = document.getElementById("min");
const sec = document.getElementById("secs");

async function getPackages() {
  const response = await fetch(
    "https://registry.npmjs.com/-/v1/search?text=framework&size=250",
  );
  const data = await response.json();
  const { objects } = data;
  const [first] = objects.sort((a, b) =>
    b.package.date.localeCompare(a.package.date),
  );

  return first;
}

async function logTime() {
  const first = await getPackages();
  const date = new Date(first.package.date);
  const since = Date.now() - date.getTime();

  formatTime(since / 1000);
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 60).toFixed(0);

  paddedHours = hours >= 10 ? hours.toString() : "0" + hours.toString();
  paddedMinutes = minutes >= 10 ? minutes.toString() : "0" + minutes.toString();
  paddedSeconds = secs >= 10 ? secs.toString() : "0" + secs.toString();

  hr.innerText = paddedHours;
  min.innerText = paddedMinutes;
  sec.innerText = paddedSeconds;
}

setInterval(() => {
  logTime();
  console.clear();
}, 1000);
