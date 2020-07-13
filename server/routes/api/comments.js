const router = require("express").Router()
const { Page, User, Comment, Site } = require('../')

router.get("/domain/:id", async (req, res, next) => {
    try {
        let pages = await Page.findAll({
            attributes: ['id'],
            where: {
                siteId: req.params.id
            }
        })
        pages = pages.map(page => page.dataValues.id)
        const comments = await Comment.findAll({
            attributes: ['text', 'createdAt', 'updatedAt'],
            where: {
                pageId: pages
            },
            include: {
                model: User,
                attributes: ['username']
            }
        })
        res.json(comments)
    } catch (error) {
        next(error)
    }
})

router.get("/page/:id", async (req, res, next) => {
    try {
        const comments = await Comment.findAll({
            attributes: ['text', 'createdAt', 'updatedAt'],
            where: {
                pageId: req.params.id
            },
            include: {
                model: User,
                attributes: ['username']
            }
        })
        res.json(comments)
    } catch (error) {
        next(error)
    }
})

router.get("/", async (req, res, next) => {
    try {
        const comments = await Comment.findAll({
            where: {
                userId: req.session.userId
            }
        })
        res.json(comments)
    } catch (error) {
        next(error)
    }
})

router.post("/", async (req, res, next) => {
    try {
        const { domain, name, url, pageTitle, text } = req.body
        let site = await Site.findOne({
            where: {
                domain
            }
        })
        if (!site) site = await Site.create({
            name,
            domain
        })
        let page = await Page.findOne({
            where: {
                url
            }
        })
        if (!page) {
            page = await Page.create({
                pageTitle,
                url
            })
            await page.setSite(page)
        }
        const comment = await Comment.create({
            text
        })
        await page.setSite(site.dataValues.id)
        await comment.setPage(page.dataValues.id)
        await comment.setUser(req.session.userId)
        res.json(comment)
    } catch (error) {
        next(error)
    }
})

router.put("/:commentId", async (req, res, next) => {
    try {
        await Comment.update(
            req.body,
            {
                where: {
                    userId: req.session.userId,
                    id: req.params.commentId
                }
            }
        )
        const comment = await Comment.findOne({
            where: {
                id: req.params.commentId
            }
        })
        res.json(comment)
    } catch (error) {
        next(error)
    }
})

router.delete('/', async (req, res, next) => {
    try {
        const deleted = await Comment.destroy({
            where: {
                userId: req.session.userId
            }
        })
        if (!deleted) res.json('no comments to delete')
        else res.json(`successfully deleted ${deleted} comment${deleted > 1 ? 's' : ''}`)
    } catch (error) {
        next(error)
    }
})

router.delete('/:commentId', async (req, res, next) => {
    try {
        const deleted = await Comment.destroy({
            where: {
                userId: req.session.userId,
                id: req.params.commentId
            }
        })
        res.json(`successfully deleted comment`)
    } catch (error) {
        next(error)
    }
})

module.exports = router
