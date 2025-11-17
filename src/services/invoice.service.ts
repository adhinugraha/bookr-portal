import logger from "../config/logger.js";
import { AppError } from "../core/http/error.js";
import { InvoiceRepository } from "../repositories/invoice.repository.js";

export class InvoiceService {
  static async create(data: any) {

    const latestRecord = await InvoiceRepository.findLatest();
    
    const now = new Date();
    let invoiceCode = `INV/BOOKR/${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}/${Number(latestRecord + 1 ).toString().padStart(5, "0")}`;  

    const invoiceData = {
      code: invoiceCode,
      amount: data.amount,
      userId: data.userId,
      bookingId: data.bookingId,
      paymentId: data.paymentId,
      status: 1,
    }

    const newInvoice = await InvoiceRepository.create(invoiceData);
    if (!newInvoice) {
      logger.error({ userId: data.userId }, "InvoiceService.createInvoice - error creating invoice");
      throw new AppError("Error creating invoice", 500);
    }

    return newInvoice;
	}

  static async update(id: string, data: any) {

    const result = {
      id: id
    }

    return result;
	}

  static async issued(data: any) {
    
    const ref = data.body.ref;
    const refDecode = Buffer.from(ref || "", "base64").toString("utf8");
    const invoiceId = refDecode.split(":")[0];
    const paymentRefId = `BOOKR-${refDecode.split(":")[1]}`;
    
    const result = {
      ref: ref,
      refDecode: refDecode,
      invoiceId: invoiceId,
      paymentRefId: paymentRefId,
      success: data.body.success,
    };

    return result;
  }
}
