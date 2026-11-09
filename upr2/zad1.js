class Person {
    constructor(name) {
        this.name = name;
        this.age = 0;
        this.gender = "не е посочен";
    }

    introduce() {
        const message = `Казвам се ${this.name}, на ${this.age} години съм и полът ми е ${this.gender}.`;
        console.log(message);
        return message;
    }
}

class Employee extends Person {
    constructor(name) {
        super(name);
        this.jobTitle = "служител";
        this.salary = 0;
        this.department = "не е посочен";
    }

    work() {
        const message = `${this.name} работи като ${this.jobTitle} в отдел „${this.department}“ със заплата ${this.salary} лв.`;
        console.log(message);
        return message;
    }
}

class Student extends Person {
    constructor(name) {
        super(name);
        this.university = "не е посочен";
        this.major = "не е посочена";
        this.faculty = "не е посочен";
    }

    study() {
        const message = `${this.name} учи в ${this.university}, факултет „${this.faculty}“, специалност „${this.major}“.`;
        console.log(message);
        return message;
    }
}
