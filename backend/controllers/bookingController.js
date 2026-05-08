const Booking = require('../models/Booking');
const Expert = require('../models/Expert');

const createBooking = async (req, res, next) => {
  try {
    const { expertId, customerName, email, phone, date, timeSlot } = req.body;
    if (!expertId || !customerName || !email || !phone || !date || !timeSlot) {
      return res.status(400).json({ message: 'All booking fields are required' });
    }

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    const existing = await Booking.findOne({ expert: expertId, date, timeSlot });
    if (existing) {
      return res.status(409).json({ message: 'This slot has already been booked' });
    }

    const booking = await Booking.create({
      expert: expert._id,
      expertName: expert.name,
      customerName,
      email,
      phone,
      date,
      timeSlot,
      status: 'Pending'
    });

    const io = req.app.get('io');
    io.to(expertId).emit('slotBooked', { expertId, date, timeSlot });

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'This slot has already been booked' });
    }
    next(error);
  }
};

const getBookingsByEmail = async (req, res, next) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: 'Email query parameter is required' });
    }

    const bookings = await Booking.find({ email: email.trim() })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const status = req.body.status;
    if (!['Pending', 'Confirmed', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    booking.status = status;
    await booking.save();
    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getBookingsByEmail, updateBookingStatus };
