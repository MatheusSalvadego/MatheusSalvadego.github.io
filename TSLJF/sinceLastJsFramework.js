const currentRecord = document.getElementById("record");
const currentRecordDate = document.getElementById("dateOfRecord");

const times = document.getElementById("frameworks");
const hr = document.getElementById("hr");
const min = document.getElementById("min");
const sec = document.getElementById("secs");

async function getPackages() {
  const response = await fetch(
    "https://registry.npmjs.com/-/v1/search?text=framework&size=25000",
    //250 is max size unfortunately, which means that the record is not exactly accurate
  );
  const data = await response.json();
  const { objects } = data;

  return objects;
}

async function getRecordOfMostPackagesCreated() {
  const packages = await getPackages();
  const packagesByDay = {};

  packages.forEach((pkg) => {
    const createdAt = new Date(pkg.package.date);
    const day = createdAt.toISOString().split("T")[0];
    packagesByDay[day] = (packagesByDay[day] || 0) + 1;
  });

  let record = 0;
  let recordDate = "";

  for (const day in packagesByDay) {
    if (packagesByDay[day] > record) {
      record = packagesByDay[day];
      recordDate = day;
    }
  }

  currentRecord.innerText = `${record} frameworks `;
  currentRecordDate.innerText = `${recordDate}`;
}

async function logPackageCount() {
  const packages = await getPackages();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const packagesCreatedToday = packages.filter((pkg) => {
    const pkgDate = getPackegeDate(pkg);
    return pkgDate.setHours(0, 0, 0, 0) === today.getTime();
  });

  const count = packagesCreatedToday.length;
  times.innerText = count;
}

function getPackegeDate(pkg) {
  return new Date(pkg.package.date);
}

async function logTime() {
  const packages = await getPackages();
  const [first] = packages.sort((a, b) =>
    b.package.date.localeCompare(a.package.date),
  );

  const pkgDate = getPackegeDate(first);
  const sinceInSeconds = (Date.now() - pkgDate.getTime()) / 1000;
  formatTime(sinceInSeconds);
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 60).toFixed(0);

  hr.innerText = toPaddedString(hours);
  min.innerText = toPaddedString(minutes);
  sec.innerText = toPaddedString(secs);
}

function toPaddedString(time) {
  return time >= 10 ? time.toString() : "0" + time.toString();
}

getRecordOfMostPackagesCreated();
logTime();
logPackageCount();

setInterval(() => {
  logTime();
  logPackageCount();
}, 1000);
