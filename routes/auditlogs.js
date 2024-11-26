var express = require("express");

const moment = require("moment");
const Response = require("../lib/Response");
const AuditLogs = require("../db/models/AuditLogs");
var router = express.Router();
const auth = require("../lib/auth")(); // fonksiyon olarak çağır

router.all("*", auth.authenticate(), (req, res, next) => {
  next();
});

/* GET auditlogs listing. */
router.post("/", auth.checkRoles("auditlogs_view"), async (req, res) => {
  try {
    let body = req.body;
    let query = {};
    let skip = body.skip;
    let limit = body.limit;

    if (typeof body.skip !== "number") {
      skip = 0;
    }

    if (typeof body.limit !== "number" || body.limit > 500) {
      limit = 500;
    }

    if (body.begin_date && body.end_date) {
      query.created_at = {
        $gte: moment(body.begin_date),
        $lte: moment(body.end_date),
      };
    } else {
      query.created_at = {
        $gte: moment().subtract(1, "day").startOf("day"), // bu günün tarihini döner son günü dönmesi için
        $lte: moment(),
      };
    }

    let auditlogs = await AuditLogs.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit); // pagination işlemi için skip

    res.json(Response.successResponse(auditlogs));
  } catch (err) {
    let errorResponse = Response.errorResponse(err, req.user?.language);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
