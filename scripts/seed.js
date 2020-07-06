const {db, User} = require('../server/db');
const faker = require('faker');


async function seed(generate){
    await db.sync({force: true});
    const newUsers = [];
    for(let i = 0; i < generate; i++){
        const newUser = await User.create({
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: '123456789'
        });
        newUsers.push(newUser.dataValues)
    }
    console.log(newUsers);
}

seed(10);

