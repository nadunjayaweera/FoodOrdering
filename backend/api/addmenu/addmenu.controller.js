import MenuDAO from "../../dao/addmenuDAO.js";

const apiAddMenu = async (req, res) => {
  try {
    const { name, items } = req.body;

    const newMenu = {
      name,
      items,
    };

    const result = await MenuDAO.addMenu(newMenu);

    return res.json({
      message: "Menu added successfully",
      menu: result,
    });
  } catch (e) {
    console.error(`Unable to add menu: ${e}`);
    return res.status(500).send({ error: e.message });
  }
};

const apiGetMenuById = async (req, res) => {
  try {
    const { id } = req.params;

    const menu = await MenuDAO.getMenuById(id);

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    return res.json(menu);
  } catch (e) {
    console.error(`Unable to get menu by ID: ${e}`);
    return res.status(500).send({ error: e.message });
  }
};

const apiGetAllMenus = async (req, res) => {
  try {
    const menus = await MenuDAO.getAllMenus();

    return res.json(menus);
  } catch (e) {
    console.error(`Unable to get all menus: ${e}`);
    return res.status(500).send({ error: e.message });
  }
};

export default {
  apiAddMenu,
  apiGetMenuById,
  apiGetAllMenus,
};
