const router = require("express").Router()
const { Page, User, Comment, Site } = require('../../db')
const server = require("../../index")
const io = require('socket.io')(server)

router.get("/domain/:domainUrl", async (req, res, next) => {
    try {
        const site = await Site.findOne({
            where: {
                domain: req.params.domainUrl
            }
        })
        if (!site) return res.sendStatus(404)
        let pages = await Page.findAll({
            attributes: ['id'],
            where: {
                siteId: site.dataValues.id
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
            },
            order: ['createdAt']
        })
        res.json(comments)
    } catch (error) {
        next(error)
    }
})

router.get("/page/:id", async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      attributes: ["text", "createdAt", "updatedAt"],
      where: {
        pageId: req.params.id,
      },
      include: {
        model: User,
        attributes: ["username"],
      },
      order: ['createdAt']
    });
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      where: {
        userId: req.session.userId,
      },
      order: ['createdAt']
    });
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
    try {
      console.log('posting comment')
        const { domain, name, url, pageTitle, text } = req.body
        let site = await Site.findOne({
            where: {
                domain
            }
        })
        console.log(site ? 'found site' : 'didnt find site. creating site')
        if (!site) site = await Site.create({
            name,
            domain
        })
        console.log('site:', site)
        let page = await Page.findOne({
            where: {
                url
            }
        })
        console.log(page ? 'found page' : 'didnt find page. crating page')
        if (!page) {
            console.log(`page title: ${pageTitle} url: ${url}`)
            page = await Page.create({
                pageTitle,
                url
            })
            console.log('created page')
            await page.setSite(site)
            console.log('page is set to site')
        }
        const comment = await Comment.create({
            text
        })
        console.log('created coment')
        await comment.setPage(page.dataValues.id)
        // await comment.setUser(req.session.userId)
        console.log('comments is set to page')
        await comment.setUser(1)
        console.log('comment:', comment)
        res.json(comment)
    } catch (error) {
        next(error)
    }
});

router.put("/:commentId", async (req, res, next) => {
  try {
    await Comment.update(req.body, {
      where: {
        userId: req.session.userId,
        id: req.params.commentId,
      },
    });
    const comment = await Comment.findOne({
      where: {
        id: req.params.commentId,
      },
    });
    res.json(comment);
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const deleted = await Comment.destroy({
      where: {
        userId: req.session.userId,
      },
    });
    if (!deleted) res.json("no comments to delete");
    else
      res.json(
        `successfully deleted ${deleted} comment${deleted > 1 ? "s" : ""}`
      );
  } catch (error) {
    next(error);
  }
});

router.delete("/:commentId", async (req, res, next) => {
  try {
    const deleted = await Comment.destroy({
      where: {
        userId: req.session.userId,
        id: req.params.commentId,
      },
    });
    res.json(`successfully deleted comment`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
