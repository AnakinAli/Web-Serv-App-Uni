const STORAGE_KEY = "upr3People";

let people = [];
let currentIndex = -1;

function formatPerson(person, index) {
    const typeText = person.type === "student" ? "Студент" : "Служител";
    const salaryText = person.type === "employee" ? `, заплата: ${person.salary} лв.` : "";
    const numberText = typeof index === "number" ? `${index + 1}. ` : "";

    return `${numberText}${typeText}: ${person.name}, рождена дата: ${person.birthDate}, специалност/отдел: ${person.majorDept}${salaryText}`;
}

function showMessage(text, type) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.className = type || "";
}

function renderPeople(data, heading) {
    const output = document.getElementById("dataOutput");
    output.replaceChildren();

    const title = document.createElement("strong");
    title.textContent = heading;
    output.appendChild(title);

    if (data.length === 0) {
        const empty = document.createElement("p");
        empty.className = "muted";
        empty.textContent = "Няма намерени записи.";
        output.appendChild(empty);
        return;
    }

    data.map(function (person, index) {
        const item = document.createElement("div");
        item.className = "person";
        item.textContent = formatPerson(person, index);
        return item;
    }).forEach(function (item) {
        output.appendChild(item);
    });
}

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
}

function readFromLocalStorage() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData === null) {
        return [];
    }

    try {
        const parsedData = JSON.parse(savedData);
        return Array.isArray(parsedData) ? parsedData : [];
    } catch (error) {
        console.error("Невалидни данни в localStorage:", error);
        return [];
    }
}

async function loadWithFetch() {
    try {
        const response = await fetch("data.json");

        if (!response.ok) {
            throw new Error(`HTTP грешка ${response.status}`);
        }

        const loadedData = await response.json();

        if (!Array.isArray(loadedData)) {
            throw new Error("Получените данни не са масив.");
        }

        people = loadedData;
        currentIndex = people.length > 0 ? 0 : -1;
        saveToLocalStorage();
        renderPeople(people, "Всички данни, заредени с fetch():");
        renderCurrentRecord();
        showMessage("Данните са заредени и записани в localStorage.", "success");
    } catch (error) {
        console.error(error);
        showMessage(
            "Данните не могат да бъдат заредени. Стартирайте страницата чрез локален уеб сървър, а не директно като file:// адрес.",
            "error"
        );
    }
}

function loadFromLocalStorage() {
    people = readFromLocalStorage();
    currentIndex = people.length > 0 ? 0 : -1;
    renderPeople(people, "Данни от localStorage:");
    renderCurrentRecord();
    showMessage(
        people.length > 0 ? "Данните са заредени от localStorage." : "В localStorage няма записани данни.",
        people.length > 0 ? "success" : ""
    );
}

function filterByType(type) {
    const filteredPeople = people.filter(function (person) {
        return person.type === type;
    });
    const heading = type === "student" ? "Само студенти:" : "Само служители:";
    renderPeople(filteredPeople, heading);
}

function showAll() {
    renderPeople(people, "Всички данни:");
}

function updateSalaryState() {
    const isEmployee = document.getElementById("typeInput").value === "employee";
    const salaryInput = document.getElementById("salaryInput");
    salaryInput.disabled = !isEmployee;

    if (!isEmployee) {
        salaryInput.value = "";
    }
}

function getPersonFromForm() {
    const type = document.getElementById("typeInput").value;
    const name = document.getElementById("nameInput").value.trim();
    const birthDate = document.getElementById("birthDateInput").value.trim();
    const majorDept = document.getElementById("majorDeptInput").value.trim();
    const salaryText = document.getElementById("salaryInput").value.trim();

    if (name === "" || birthDate === "" || majorDept === "") {
        showMessage("Попълнете име, рождена дата и специалност/отдел.", "error");
        return null;
    }

    const person = { type, name, birthDate, majorDept };

    if (type === "employee") {
        const salary = Number(salaryText);
        if (salaryText === "" || !Number.isFinite(salary) || salary < 0) {
            showMessage("Въведете валидна неотрицателна заплата.", "error");
            return null;
        }
        person.salary = salary;
    }

    return person;
}

function clearForm() {
    document.getElementById("personForm").reset();
    updateSalaryState();
}

function addPerson() {
    const person = getPersonFromForm();
    if (person === null) {
        return;
    }

    people.push(person);
    currentIndex = people.length - 1;
    saveToLocalStorage();
    renderPeople(people, "Всички данни след добавянето:");
    renderCurrentRecord();
    clearForm();
    showMessage("Новият запис е добавен и записан в localStorage.", "success");
}

function fillForm(person) {
    document.getElementById("typeInput").value = person.type;
    document.getElementById("nameInput").value = person.name;
    document.getElementById("birthDateInput").value = person.birthDate;
    document.getElementById("majorDeptInput").value = person.majorDept;
    updateSalaryState();
    document.getElementById("salaryInput").value = person.salary ?? "";
}

function editCurrentPerson() {
    if (currentIndex < 0 || currentIndex >= people.length) {
        showMessage("Няма избран запис за редактиране.", "error");
        return;
    }

    const person = getPersonFromForm();
    if (person === null) {
        return;
    }

    people[currentIndex] = person;
    saveToLocalStorage();
    renderPeople(people, "Всички данни след редактирането:");
    renderCurrentRecord();
    showMessage("Записът е редактиран успешно.", "success");
}

function deleteCurrentPerson() {
    if (currentIndex < 0 || currentIndex >= people.length) {
        showMessage("Няма избран запис за изтриване.", "error");
        return;
    }

    const deletedName = people[currentIndex].name;
    people.splice(currentIndex, 1);

    if (people.length === 0) {
        currentIndex = -1;
    } else if (currentIndex >= people.length) {
        currentIndex = people.length - 1;
    }

    saveToLocalStorage();
    renderPeople(people, "Всички данни след изтриването:");
    renderCurrentRecord();
    showMessage(`Записът за ${deletedName} е изтрит.`, "success");
}

function renderCurrentRecord() {
    const output = document.getElementById("currentRecord");
    const hasRecords = people.length > 0 && currentIndex >= 0;
    document.getElementById("previousButton").disabled = !hasRecords || currentIndex === 0;
    document.getElementById("nextButton").disabled = !hasRecords || currentIndex === people.length - 1;
    document.getElementById("editButton").disabled = !hasRecords;
    document.getElementById("deleteButton").disabled = !hasRecords;

    if (!hasRecords) {
        output.textContent = "Няма зареден запис.";
        clearForm();
        return;
    }

    const person = people[currentIndex];
    output.textContent = `Запис ${currentIndex + 1} от ${people.length}\n${formatPerson(person)}`;
    output.style.whiteSpace = "pre-line";
    fillForm(person);
}

function showPrevious() {
    if (currentIndex > 0) {
        currentIndex--;
        renderCurrentRecord();
    }
}

function showNext() {
    if (currentIndex < people.length - 1) {
        currentIndex++;
        renderCurrentRecord();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    updateSalaryState();
    renderCurrentRecord();
});
