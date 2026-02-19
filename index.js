//Array to store the pet objects
let pets = [];

//Pet class 
class Pet {
    constructor(name, animalType) {
        this.name = name;
        this.animalType = animalType;
        this.energy = 50;
        this.fullness = 50;
        this.happiness = 50;
        this.timer();
    }

    timer() {
        this.petTimer = setInterval(() => {
            this.energy -= 10;
            this.fullness -= 10;
            this.happiness -= 10;
            this.keepStatsInRange();
            updateBars(this);
            this.checkPetAlive();
        }, 10000);
    }

    checkPetAlive() {
        if (this.energy === 0 || this.happiness === 0 || this.fullness === 0 ) {
            setTimeout( () => {
                clearInterval(this.petTimer);
                this.petDiv.remove();

                const index = pets.indexOf(this);
                if (index > -1) {
                    pets.splice(index, 1);
                }

                activityHistory.innerHTML +=  `<p>${this.name} ran away due to neglect! :(</p>`;
            }, 3000);
        }
    }

    //Activities - nap, play, eat
    nap() {
        this.energy += 40;
        this.happiness -= 10;
        this.fullness -= 10;
        this.keepStatsInRange();
        this.checkPetAlive();
        return this.name + " took a nap";
    }

    play() {
        this.happiness += 30;
        this.fullness -= 10;
        this.energy -= 10;
        this.keepStatsInRange();
        this.checkPetAlive();
        return "You played with " + this.name;
    }

    eat() {
        this.fullness += 30;
        this.happiness += 5;
        this.energy -= 15;
        this.keepStatsInRange();
        this.checkPetAlive();
        return "You fed " + this.name;
    }

    //Makes sure that the stats stay within range 0-100
    keepStatsInRange() {
        if (this.energy > 100) {
            this.energy = 100;
        } 
        if (this.energy < 0) {
            this.energy = 0;
        }

        if (this.happiness > 100) {
            this.happiness = 100;
        }
        if (this.happiness < 0) {
            this.happiness = 0;
        }

        if (this.fullness > 100) {
            this.fullness = 100;
        }
        if (this.fullness < 0) {
            this.fullness = 0;
        }
    }

    //Static method to fetch a random pet name from API 
    static async getPetName() {
        try {
            const response = await fetch('https://randomuser.me/api/0.8');
            const data = await response.json();
            return data.results[0].user.name.first;
        } catch (err) {
            console.error('Could not fetch name:', err);
            return 'Toto';
        }
    }
}

//DOM ELEMENTS
const randomNameBtn = document.getElementById('random-name-btn');
const petNameInput = document.getElementById('pet-name');
const createPetBtn = document.getElementById('create-pet-btn');
const petSelect = document.getElementById('pet-select');
const petsContainer = document.getElementById('pets-container');
const activityHistory = document.getElementById('activity-history');

//Random name button: When clicked, it gets a random name from the API and fills it into the input field
randomNameBtn.addEventListener('click', async () => {
    const randomName = await Pet.getPetName();
    petNameInput.value = randomName;
});

//Create pet button: When clicked, a pet is created with name and animalType and image
createPetBtn.addEventListener('click', () => {

    if (pets.length >= 4) {
        alert('You can only create up to 4 pets!');
        return;
    }

    const name = petNameInput.value.charAt(0).toUpperCase()+petNameInput.value.slice(1);
    const animalType = petSelect.value;

    if (name === "" || animalType === "") {
        alert('Please enter a name and choose an animal type!');
        return;
    }

    const nameExists = pets.some(pet => pet.name === name);
    if (nameExists) {
        alert('A pet with this name already exists! Please choose a different name.');
        return;
    }

    const newPet = new Pet(name, animalType);
    pets.push(newPet);
    displayPet(newPet);
});

//Function to display the created pet on the page
function displayPet(pet) {
    const petDiv = document.createElement('div');
    petDiv.classList.add("pet-card");

    petDiv.innerHTML = `
        <h3>${pet.name}</h3>
        <img src="images/${pet.animalType}.png" alt="Your pet is a ${pet.animalType}">

        <label for="energyProgress${pet.name}">Energy</label>
        <progress id="energyProgress${pet.name}" value="${pet.energy}" max="100"></progress><br>

        <label for="happinessProgress${pet.name}">Happiness</label>
        <progress id="happinessProgress${pet.name}" value="${pet.happiness}" max="100"></progress><br>

        <label for="fullnessProgress${pet.name}">Fullness</label>
        <progress id="fullnessProgress${pet.name}" value="${pet.fullness}" max="100"></progress><br>

        <button class="nap-btn">Nap</button>
        <button class="play-btn">Play</button>
        <button class="eat-btn">Eat</button>
    `;
    pet.petDiv = petDiv;
    petsContainer.appendChild(petDiv);

    const napBtn = petDiv.querySelector('.nap-btn');
    const playBtn = petDiv.querySelector('.play-btn');
    const eatBtn = petDiv.querySelector('.eat-btn');

    napBtn.addEventListener('click', () => {
        const activityMessage = pet.nap();
        updateBars(pet);
        activityHistory.innerHTML += `<p>${activityMessage}</p>`;
    });

    playBtn.addEventListener('click', () => {
        const activityMessage = pet.play();
        updateBars(pet);
        activityHistory.innerHTML += `<p>${activityMessage}</p>`;
    });

    eatBtn.addEventListener('click', () => {
        const activityMessage = pet.eat();
        updateBars(pet);
        activityHistory.innerHTML += `<p>${activityMessage}</p>`;
    });

}

//Function to update the progress bars for energy, happiness, and fullness
function updateBars(pet) {
    const energyBar = document.getElementById(`energyProgress${pet.name}`); 
    energyBar.value = pet.energy;
    const happinessBar = document.getElementById(`happinessProgress${pet.name}`);
    happinessBar.value = pet.happiness;
    const fullnessBar = document.getElementById(`fullnessProgress${pet.name}`); 
    fullnessBar.value = pet.fullness;
}