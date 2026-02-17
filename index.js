class Pet {
    constructor(name, animalType) {
        this.name = name;
        this.animalType = animalType;
        this.energy = 50;
        this.fullness = 50;
        this.happiness = 50;
    }

    nap() {
        this.energy += 40;
        this.happiness -= 10;
        this.fullness -= 10;
        this.keepStatsInRange();
        return this.name + " took a nap";
    }

    play() {
        this.happiness += 30;
        this.fullness -= 10;
        this.energy -= 10;
        this.keepStatsInRange();
        return "You played with " + this.name;
    }

    eat() {
        this.fullness += 30;
        this.happiness += 5;
        this.energy -= 15;
        this.keepStatsInRange();
        return "You fed " + this.name;
    }

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

    static async getPetName() {
        try {
            const response = await fetch('https://randomuser.me/api/0.8');
            const data = await response.json();
            return data.results[0].user.name.first;
        } catch (err) {
            console.log(err)
            //Display something on the screen?
        }
    }
}

const randomNameBtn = document.getElementById('random-name-btn');
const petNameInput = document.getElementById('pet-name');
const createPetBtn = document.getElementById('create-pet-btn');
const petSelect = document.getElementById('pet-select');
const petsContainer = document.getElementById('pets-container');

randomNameBtn.addEventListener('click', async () => {
    const randomName = await Pet.getPetName();
    petNameInput.value = randomName;
});

createPetBtn.addEventListener('click', () => {
    const name = petNameInput.value.charAt(0).toUpperCase()+petNameInput.value.slice(1);
    const animalType = petSelect.value;

    if (name === "" || animalType === "") {
        alert('Please enter a name and choose an animal type!');
        return;
    }

    const newPet = new Pet(name, animalType);
    console.log(newPet); //delete
    displayPet(newPet);
});

function displayPet(pet) {
    const petDiv = document.createElement('div');
    petDiv.innerHTML = `
        <h3>${pet.name}</h3>
        <label for="energyProgress${pet.name}">Energy</label>
        <progress id="energyProgress${pet.name}" value="${pet.energy}" max="100"></progress><br>
        <label for="happinessProgress${pet.name}">Happiness</label>
        <progress id="happinessProgress${pet.name}" value="${pet.happiness}" max="100"></progress><br>
        <label for="fullnessProgress${pet.name}">Fullness</label>
        <progress id="fullnessProgress${pet.name}" value="${pet.fullness}" max="100"></progress><br>

        <button id="nap-btn${pet.name}">Nap</button>
        <button id="play-btn${pet.name}">Play</button>
        <button id="eat-btn${pet.name}">Eat</button>
    `;
    petsContainer.appendChild(petDiv);

    const napBtn = document.getElementById(`nap-btn${pet.name}`); 
    const playBtn = document.getElementById(`play-btn${pet.name}`);
    const eatBtn = document.getElementById(`eat-btn${pet.name}`);

    napBtn.addEventListener('click', () => {
        pet.nap();
    });

    playBtn.addEventListener('click', () => {
        pet.play();
    });

     eatBtn.addEventListener('click', () => {
        pet.eat();
    });
}
