class Pet {
    constructor(name, animalType) {
        this.name = name;
        this.animalType = animalType;
        this.energy = 50;
        this.fullness = 50;
        this.happiness = 50;
    }

    //Create method for each activity
    nap() {
        this.energy += 40;
        this.happiness -= 10;
        this.fullness -= 10;
        console.log(this.name + " took a nap");
    }

    play() {
        this.happiness += 30;
        this.fullness -= 10;
        this.energy -= 10;
        console.log("You played with " + this.name);
    }

    eat() {
        this.fullness += 30;
        this.happiness += 5;
        this.energy -= 15;
        console.log("You fed " + this.name);
    }

    //History:
    //Text box

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

const testPet = new Pet("Mimi", "dog");

testPet.nap();
testPet.play();
testPet.eat();

console.log(testPet);