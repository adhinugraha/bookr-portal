import { Request, Response } from "express";
import logger from "../config/logger.js";
import { response } from "../core/http/response.js";
import { BookingService } from "../services/booking.service.js";

export const BookingController = {
  index: async (req: Request, res: Response) => {
    try {
      logger.info({
        msg: "Incoming bookings request",
        body: req.body || {},
        path: req.path,
        headers: req.headers,
        method: req.method,
      });

      const result = {};

      return res
        .status(200)
        .json(response(result, "Bookings fetched successfully"));
      
    } catch (err: any) {
      logger.error({ err }, "BookingController.index error");
	    return res
        .status(err.statusCode || 500)
        .json(response(null, err.message || "Something went wrong" , false));
    }
  },

  show: async (req: Request, res: Response) => {
    try {
      logger.info({
        msg: "Incoming booking request",
        body: req.body || {},
        path: req.path,
        params: req.params || {},
        headers: req.headers,
        method: req.method,
      });

      const id = req.params["id"] || "";
      const result = await BookingService.getDetail(id)

      return res
        .status(200)
        .json(response(result, "Booking detail fetched successfully"));
      
    } catch (err: any) {
      logger.error({ err }, "BookingController.show error");
	    return res
        .status(err.statusCode || 500)
        .json(response(null, err.message || "Something went wrong" , false));
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      logger.info({
        msg: "Incoming booking request",
        body: req.body || {},
        path: req.path,
        headers: req.headers,
        method: req.method,
      });
      
      const result = await BookingService.createBooking(req);

      return res
        .status(200)
        .json(response(result, "Booking created successfully"));
      
    } catch (err: any) {
      logger.error({ err }, "BookingController.createBooking error");
	    return res
        .status(err.statusCode || 500)
        .json(response(null, err.message || "Something went wrong" , false));
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      logger.info({
        msg: "Incoming booking request",
        body: req.body || {},
        path: req.path,
        headers: req.headers,
        method: req.method,
      });
      
      const result = {};

      return res
        .status(200)
        .json(response(result, "Booking updated successfully"));
      
    } catch (err: any) {
      logger.error({ err }, "BookingController.updateBooking error");
	    return res
        .status(err.statusCode || 500)
        .json(response(null, err.message || "Something went wrong" , false));
    }
  }

};
