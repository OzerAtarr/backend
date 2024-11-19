var express = require('express');
var router = express.Router();

/* GET auditlogs listing. */
router.get('/:id', function(req, res, next) {
    res.json({
        body: req.body,
        params: req.params,
        query: req.query,
        Headers: req.headers
    });
});

module.exports = router;
