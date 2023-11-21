import express from "express";
import MenuCtrl from "./addmenu.controller.js";

const router = express.Router();

router.post("/addmenu", MenuCtrl.apiAddMenu);
router.get("/getmenu/:id", MenuCtrl.apiGetMenuById);
router.get("/getallmenus", MenuCtrl.apiGetAllMenus);
router.put("/updatemenu/:id", MenuCtrl.apiUpdateMenu);
export default router;
