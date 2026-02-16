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
        }
    }
}

const randomNameBtn = document.getElementById('random-name-btn');
const petNameInput = document.getElementById('pet-name');

randomNameBtn.addEventListener('click', async () => {
    const randomName = await Pet.getPetName();
    petNameInput.value = randomName;
});

const testPet = new Pet("Mimi", "dog");

testPet.nap();
testPet.play();
testPet.eat();

console.log(testPet);