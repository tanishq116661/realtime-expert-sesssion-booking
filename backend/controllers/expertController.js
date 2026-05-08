const Expert = require('../models/Expert');
const Booking = require('../models/Booking');

const getExperts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 8, 1);
    const search = req.query.search ? req.query.search.trim() : '';
    const category = req.query.category ? req.query.category.trim() : '';

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }

    const total = await Expert.countDocuments(filter);
    const experts = await Expert.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      experts,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id).lean();
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    const bookings = await Booking.find({ expert: expert._id }).lean();
    const bookedMap = new Set(bookings.map((booking) => `${booking.date}|${booking.timeSlot}`));

    const availableSlots = expert.slots.map((slotGroup) => {
      return {
        date: slotGroup.date,
        times: slotGroup.times.map((time) => ({
          time,
          booked: bookedMap.has(`${slotGroup.date}|${time}`)
        }))
      };
    });

    res.json({ expert, availableSlots });
  } catch (error) {
    next(error);
  }
};

module.exports = { getExperts, getExpertById };
