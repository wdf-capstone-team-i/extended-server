const {db, User, Page, Comment, Site } = require('../server/db');
const faker = require('faker');

async function seed(generate){
    try {
        await db.sync({force: true});
        const newUsers = [];
        for(let i = 0; i < generate * 100; i++){
            const newUser = await User.create({
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                username: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password().slice(0, 5)
            });
            newUsers.push(newUser.dataValues)
        }
        const newSites = []
        for (let i = 0; i < generate; i++) {
            const newSite = await Site.create({
                name: faker.internet.domainName(),
                domain: faker.internet.url()
            })
            newSites.push(newSite.dataValues)
        }
        const newPages = []
        for (let i = 0; i < generate * 10; i++) {
            const randomSite = newSites[Math.floor(Math.random() * newSites.length)]
            const newPage = await Page.create({
                pageTitle: faker.internet.domainWord(),
                url: randomSite.domain + '/' + faker.random.word()
            })
            await newPage.setSite(randomSite.id)
            newPages.push(newPage.dataValues)
        }
        const newComments = []
        for(let i = 0; i < generate * 1000; i++){
            const newComment = await Comment.create({
                text: faker.lorem.text()
            });
            await newComment.setUser(newUsers[Math.floor(Math.random() * newUsers.length)].id)
            await newComment.setPage(newPages[Math.floor(Math.random() * newPages.length)].id)
            newComments.push(newComment.dataValues)
        }
        // console.log(newUsers);
        // console.log(newComments)
        // console.log(newPages)
        // console.log(newSites)
        console.log('seeded database')
    } catch (error) {
        console.error(error)
    }
    db.close()
}

seed(10);


// const info = {
//     password: faker.internet.password(),
//     shortPassword: faker.internet.password().slice(0, 5)
// }

// console.log(info)