import StockDAO from "../../dao/stockDAO.js";

const getStockData = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const stockData = await StockDAO.getStockData(startDate, endDate);
    res.json(stockData);
  } catch (err) {
    console.error(`Error getting stock data: ${err}`);
    res.status(500).json({ error: err });
  }
};

export default {
  getStockData,
};
