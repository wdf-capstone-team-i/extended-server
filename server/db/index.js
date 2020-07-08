const db = require('./db');
const User = require('./models/users');
const Page = require('./models/pages')
const Site = require('./models/sites')
const Comment = require('./models/comments')

Site.hasMany(Page)
Page.belongsTo(Site)

Page.hasMany(Comment)
Comment.belongsTo(Page)

User.hasMany(Comment)
Comment.belongsTo(User)

module.exports = {
    db,
    User,
    Page,
    Site,
    Comment
}
