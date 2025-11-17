import { UserRepository } from "../repositories/user.repository.js";
import { AppError } from "../core/http/error.js";
import logger from "../config/logger.js";
import type { AuthRequest } from "../types/index.js";
import { GMBookingClassAdapter } from "../providers/gymmaster/bookingClass.adapter.js";
import { BookingRepository } from "../repositories/booking.repository.js";
import { InvoiceService } from "./invoice.service.js";
import { ClassScheduleService } from "./classSchedule.service.js";
import { ClassService } from "./class.service.js";
import { PaymentRepository } from "../repositories/payment.repository.js";
import { XNPaymentAdapter } from "../providers/xendit/payment.adapter.js";

const usersRepo = UserRepository;

export class BookingService {
  static async createBooking(req: AuthRequest) {

    const user = await usersRepo.findByEmail(req.user?.email || "");
    if (!user) {
      logger.warn({ userId: user.id }, "UserService.getProfile - user not found");
      throw new AppError("User not found", 404);
    }

    const classData = await ClassService.getDetail(req.body.class_id);
    
    const scheduleData = await ClassScheduleService.getByClassId({
      userId: user.id,
      classId: classData.id,
      scheduleId: req.body.schedule_id,
    });

    const price = Number(scheduleData.price.replace("IDR ", "").replace(".", ""));

    const extBooking = await GMBookingClassAdapter(user.id, scheduleData.id);

    const newBooking = await BookingRepository.create({
      userId: user.id,
      externalId: extBooking.bookingid,
      classId: classData.id,
      scheduleId: scheduleData.id,
      status: 1,
    });
    if (!newBooking) {
      logger.error({ userId: user.id }, "BookingService.createBooking - error creating booking");
      throw new AppError("Error creating booking", 500);
    }

    const newPayment = await PaymentRepository.create({
      amount: price,
      status: 0,
    });
    if (!newPayment) {
      logger.error({ userId: user.id }, "BookingService.createBooking - error creating payment");
      throw new AppError("Error creating payment", 500);
    }
    
    const newInvoice = await InvoiceService.create({
      userId: user.id,
      bookingId: newBooking.id,
      classId: classData.id,
      scheduleId: scheduleData.id,
      paymentId: newPayment.id,
      amount: price
    });

    const datas = {
      user: user,
      class: classData,
      schedule: scheduleData,
      booking: newBooking,
      payment: newPayment,
      invoice: newInvoice,
      paymentDetail: req.body.payment,
    }

    const paymentResult = await XNPaymentAdapter(datas);
    if (!paymentResult) {
      logger.error({ userId: user.id }, "BookingService.createBooking - error creating payment");
      throw new AppError("Error creating payment", 500);
    }

    const updatePayment = await PaymentRepository.update(
      newPayment.id,
      {
        paymentRefId: paymentResult.reference_id,
        paymentReqId: paymentResult.payment_request_id,
        paymentPrefix: `${paymentResult.channel_code}-${paymentResult.channel_properties.card_details.network}-${paymentResult.channel_properties.card_details.masked_card_number.slice(-4)}`,
        issuer: paymentResult.channel_properties.card_details.issuer,
      }
    );
    if (!updatePayment) {
      logger.error({ userId: user.id }, "BookingService.createBooking - error updating payment");
      throw new AppError("Error updating payment", 500);
    }

    return paymentResult.actions[0];
	}
}
