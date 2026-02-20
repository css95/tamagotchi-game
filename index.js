//Array för att spara husdjursobjekten 
let pets = [];

//Pet class - OOP - innehåller all logil för husdjuren
class Pet {

    //Constructor - initierar husdjurets egenskaper
    constructor(name, animalType) {
        this.name = name;
        this.animalType = animalType;
        this.energy = 50;
        this.fullness = 50;
        this.happiness = 50;
        this.timer(); //Startar timern direkt när husdjuret skapas
    }

    //Timer - minskar stats automatiskt var 10:e sekund
    timer() {
        this.petTimer = setInterval(() => {
            //Minska alla stats med 10
            this.energy -= 10;
            this.fullness -= 10;
            this.happiness -= 10;
            
            //Håll stats inom 0-100
            this.keepStatsInRange();

            //Uppdatera progress bars på sidan
            updateBars(this);

            //Kolla om husdjuret ska springa iväg
            this.checkPetAlive();
        }, 10000);
    }

    // Kollar om husdjuret fortfarande lever
    checkPetAlive() {
        //Om någon stat når 0, springer husdjuret iväg
        if (this.energy === 0 || this.happiness === 0 || this.fullness === 0 ) {
            
            setTimeout( () => {
                //Stoppa timern
                clearInterval(this.petTimer);

                //Ta bort från DOM:en
                this.petDiv.remove();

                //Ta bort från pets-arrayen
                const index = pets.indexOf(this);
                if (index > -1) {
                    pets.splice(index, 1);
                }

                //Lägger till meddelande i historiken
                activityHistory.innerHTML +=  `<p>${this.name} ran away due to neglect! :(</p>`;
            }, 3000); //Vänta 3 sekunder innan borttagning
        }
    }

    //Activiteter - nap, play, eat

    //Nap - husdjuret tar en tupplur
    nap() {
        this.energy += 40;
        this.happiness -= 10;
        this.fullness -= 10;
        this.keepStatsInRange();
        this.checkPetAlive();
        return this.name + " took a nap" + ".";
    }

    //Play - leker med husdjuret
    play() {
        this.happiness += 30;
        this.fullness -= 10;
        this.energy -= 10;
        this.keepStatsInRange();
        this.checkPetAlive();
        return "You played with " + this.name + ".";
    }

    //Eat - matar husdjuret 
    eat() {
        this.fullness += 30;
        this.happiness += 5;
        this.energy -= 15;
        this.keepStatsInRange();
        this.checkPetAlive();
        return "You fed " + this.name + ".";
    }

    //Ser till att stats håller sig inom intervallet 0-100
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

    //Statisk metod för att hämta slumpmässigt namn från API
    static async getPetName() {
        try {
            //Hämta data från API:t
            const response = await fetch('https://randomuser.me/api/0.8');
            const data = await response.json();

            //Returnera förnamnet
            return data.results[0].user.name.first;
        } catch (err) {
            //Om API.t inte fungerar, logga felet och returnera fallback-namn
            console.error('Could not fetch name:', err);
            return 'Toto';
        }
    }
}

//DOM-element - hämtar referenser till HTML-element
const randomNameBtn = document.getElementById('random-name-btn');
const petNameInput = document.getElementById('pet-name');
const createPetBtn = document.getElementById('create-pet-btn');
const petSelect = document.getElementById('pet-select');
const petsContainer = document.getElementById('pets-container');
const activityHistory = document.getElementById('activity-history');

//Random name-knappen - hämtar slumpmässigt namn från API när man klickar
randomNameBtn.addEventListener('click', async () => {
    const randomName = await Pet.getPetName();
    petNameInput.value = randomName;
});

//Create pet-knappen - skapar ett nytt husdjur när man klickar
createPetBtn.addEventListener('click', () => {

    //Kolla om vi redan har 4 husdjur(maxgräns)
    if (pets.length >= 4) {
        alert('You can only create up to 4 pets!');
        return;
    }

    //Hämta och kapitalisera första bokstaven i namnet
    const name = petNameInput.value.charAt(0).toUpperCase()+petNameInput.value.slice(1);
    const animalType = petSelect.value;

    //Validera att namn och djurtyp är ifyllda
    if (name === "" || animalType === "") {
        alert('Please enter a name and choose an animal type!');
        return;
    }

    //Kolla om namnet redan finns (förhindrar dubletter)
    const nameExists = pets.some(pet => pet.name === name);
    if (nameExists) {
        alert('A pet with this name already exists! Please choose a different name.');
        return;
    }

    //Skapa nytt husdjur och lägg i arrayen
    const newPet = new Pet(name, animalType);
    pets.push(newPet);

    //Visa husdjuret på sidan
    displayPet(newPet);
});

//Funktion för att visa det skapade husdjuret på sidan
function displayPet(pet) {

    //Skapa en container-div för husdjuret
    const petDiv = document.createElement('div');
    petDiv.classList.add("pet-card");

    //Fyll div:en med HTML-innehåll
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

    //Spara referens till div:en i husdjursobjektet
    pet.petDiv = petDiv;
    petsContainer.appendChild(petDiv);

    // Hämta aktivitetsknapparna för detta husdjur 
    const napBtn = petDiv.querySelector('.nap-btn');
    const playBtn = petDiv.querySelector('.play-btn');
    const eatBtn = petDiv.querySelector('.eat-btn');

    //Nap-knappen - när man klickar tar husdjuret en tupplur
    napBtn.addEventListener('click', () => {
        const activityMessage = pet.nap();
        updateBars(pet);
        activityHistory.innerHTML += `<p>${activityMessage}</p>`;
    });

    //Play-knappen - när man klickar leker man med husdjuret
    playBtn.addEventListener('click', () => {
        const activityMessage = pet.play();
        updateBars(pet);
        activityHistory.innerHTML += `<p>${activityMessage}</p>`;
    });

    //Eat-knappen - när man klickar äter husdjuret
    eatBtn.addEventListener('click', () => {
        const activityMessage = pet.eat();
        updateBars(pet);
        activityHistory.innerHTML += `<p>${activityMessage}</p>`;
    });

}

//Funktion för att uppdatera progress bars med nya stat-värden
function updateBars(pet) {
    //Hitta och uppdatera energy-baren
    const energyBar = document.getElementById(`energyProgress${pet.name}`); 
    energyBar.value = pet.energy;

    //Hitta och uppdatera happiness-baren
    const happinessBar = document.getElementById(`happinessProgress${pet.name}`);
    happinessBar.value = pet.happiness;

    //Hitta och uppdatera fullness-baren
    const fullnessBar = document.getElementById(`fullnessProgress${pet.name}`); 
    fullnessBar.value = pet.fullness;
}
