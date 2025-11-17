import { Request, Response } from "express";
import logger from "../config/logger.js";
import { response } from "../core/http/response.js";
import { InvoiceService } from "../services/invoice.service.js";

export const InvoiceController = {
  issued: async (req: Request, res: Response) => {
    try {
      logger.info({
        msg: "Incoming invoice request",
        body: req.body || {},
        path: req.path,
        headers: req.headers,
        method: req.method,
      });
      
      const result = await InvoiceService.issued(req);

      return res
        .status(200)
        .json(response(result, "Invoice issued successfully"));
      
    } catch (err: any) {
      logger.error({ err }, "InvoiceController.issued error");
	    return res
        .status(err.statusCode || 500)
        .json(response(null, err.message || "Something went wrong" , false));
    }
  },
};
