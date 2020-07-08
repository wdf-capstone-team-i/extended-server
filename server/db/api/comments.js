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
        console.log(req.body)
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
        console.log(site)
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
        console.log(page)
        const comment = await Comment.create({
            text
        })
        console.log(comment)
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

module.exports = router
