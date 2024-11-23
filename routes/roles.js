var express = require('express');
var router = express.Router();


const Roles = require("../db/models/Roles");
const role_privileges = require("../config/role_privileges");
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require("../config/Enum");
const RolePrivileges = require('../db/models/RolePrivileges');



/* GET roles listing. */
router.get('/', async (req, res, next) => {
    try{
        let roles = await Roles.find({});
        res.json(Response.successResponse(roles));
    }catch(err){
      let errorResponse = Response.errorResponse(err);
      res.status(errorResponse.code).json(errorResponse);
    }
  });
  
  // CREATE 
  router.post('/add', async (req, res) => {
    let body = req.body;
    try{
        
      if(!body.role_name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error","role_name field must be filled");
      
      // permission kısmı olmalı array olmalı ve içinde en az 1 eleman olmalı şartı sağlamıyorsa hata fırlatır
      if(!body.permissions || !Array.isArray(body.permissions) || body.permissions.length == 0) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error","permission filled field must be Array");
  
      let role = new Roles({
        role_name: body.role_name,
        is_active: true,
        created_by: req.user?.id
      });
  
      await role.save();
      for(let i=0;i<body.permissions.length;i++){
        let priv = new RolePrivileges({
            role_id: role._id,
            permissions: body.permissions[i],
            created_by: req.user?.id
        })
        await priv.save();
      }
  
      res.json(Response.successResponse({success: true}));
  
    }catch(err){
      let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
  });

  
  // UPDATE 
  router.post('/update', async (req, res) => {
    let body = req.body;
    try{
  
        if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error","_id field must be filled");
  
        let updates = {};
  
        if(body.role_name) updates.role_name = body.role_name;
        if(typeof body.is_active === "boolean") updates.is_active = body.is_active;
        

        // permission kısmı olmalı array olmalı ve içinde en az 1 eleman olmalı şartı sağlıyorsa güncelle
        if(body.permissions && Array.isArray(body.permissions) && body.permissions.length > 0){

            let permissions = await RolePrivileges.find({role_id: body._id});

            // silinen ve yeni eklenen yetkileri bul
            let removedPermissions = permissions.filter(x => !body.permissions.includes(x.permissions));
            let newPermissions = body.permissions.filter(x => !permissions.map(p => p.permissions).includes(x));

            // silinen yetkileri veritabanından da sil
            if(removedPermissions.length > 0){
                await RolePrivileges.remove({_id: {$in: removedPermissions.map(x => x._id)}});
            }

            // yeni eklenen yetkileri veritabanında da ekle
            if(newPermissions.length > 0){
                for(let i=0;i<newPermissions.length;i++){
                    let priv = new RolePrivileges({
                        role_id: body._id,
                        permissions: newPermissions[i],
                        created_by: req.user?.id
                    })
                    await priv.save();
                  }
            }


        }

        // güncelleme işlemini yap
        await Roles.updateOne({_id: body._id}, updates);
  
        res.json(Response.successResponse({success: true}));
  
    }catch(err){
      let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
  });
  
  
// DELETE 
router.post('/delete', async (req, res) => {
  let body = req.body;
  try {
    if (!body._id) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error", "_id field must be filled");
    }

    // Rolü sil ve ilgili yetkileri kaldır
    await Roles.deleteRoleById(body._id);

    res.json(Response.successResponse({ success: true }));
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});


  router.get("/role_privileges", async (req,res) => {
    res.json(role_privileges);
  });

  module.exports = router;