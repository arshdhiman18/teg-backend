const adminAuth = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  const expectedKey = process.env.ADMIN_KEY || 'teg-admin-2024';

  if (!adminKey || adminKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or missing admin key',
    });
  }

  next();
};

module.exports = adminAuth;
