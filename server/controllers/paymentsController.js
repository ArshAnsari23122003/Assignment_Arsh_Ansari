const Payment = require('../models/Payment');
const dayjs = require('dayjs');

exports.addPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add payment', error: err.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch transaction' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const payments = await Payment.find();

    const todayStr = dayjs().format('YYYY-MM-DD');
    const weekStartStr = dayjs().startOf('week').format('YYYY-MM-DD');

    let totalPaymentsToday = 0;
    let totalPaymentsThisWeek = 0;
    let totalRevenue = 0;
    let failedCount = 0;

    const last7Days = [...Array(7)].map((_, i) => {
      const date = dayjs().subtract(6 - i, 'day').format('YYYY-MM-DD');
      return { date, revenue: 0 };
    });

    payments.forEach(payment => {
      const createdAtDate = dayjs(payment.createdAt).format('YYYY-MM-DD');

      if (createdAtDate === todayStr) {
        totalPaymentsToday++;
      }

      if (createdAtDate >= weekStartStr) {
        totalPaymentsThisWeek++;
      }

      if (payment.status === 'success') {
        totalRevenue += parseFloat(payment.amount || 0);

        const day = last7Days.find(d => d.date === createdAtDate);
        if (day) {
          day.revenue += parseFloat(payment.amount || 0);
        }
      } else {
        failedCount++;
      }
    });

    const revenueTrend = last7Days.map(day => ({
      date: dayjs(day.date).format('ddd'),
      revenue: day.revenue,
    }));

    res.json({
      totalPaymentsToday,
      totalPaymentsThisWeek,
      totalRevenue,
      failedCount,
      revenueTrend,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

