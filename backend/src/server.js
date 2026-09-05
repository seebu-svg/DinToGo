const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');

const config = require('./config');
const { connectDB } = require('./config/database');
require('./models'); // Load associations
const routes = require('./routes');
const globalErrorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');
const logger = require('./utils/logger');

// ── Initialize Express ───────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ── Socket.IO ────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: config.clientUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('join_dinner_chat', (dinnerId) => {
    socket.join(`dinner_${dinnerId}`);
    logger.info(`Socket ${socket.id} joined dinner_${dinnerId}`);
  });

  socket.on('leave_dinner_chat', (dinnerId) => {
    socket.leave(`dinner_${dinnerId}`);
  });

  socket.on('send_message', (data) => {
    socket.to(`dinner_${data.dinnerId}`).emit('new_message', data);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

app.set('io', io);

// ── Security Middleware ──────────────────────────────────────────────
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ── General Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// ── Health Check ─────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DinToGo API is running (PERN Stack)',
    timestamp: new Date().toISOString(),
    env: config.env,
  });
});

// ── API Routes ───────────────────────────────────────────────────────
app.use('/api', routes);

// ── 404 Handler ──────────────────────────────────────────────────────
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found.`, 404));
});

// ── Global Error Handler ─────────────────────────────────────────────
app.use(globalErrorHandler);

// ── Start Server ─────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();

    // Sync models — create tables if they don't exist
    const { sequelize } = require('./config/database');
    await sequelize.sync();
    logger.info('[DB] Models synced');

    server.listen(config.port, () => {
      logger.info(`DinToGo server running on port ${config.port} [${config.env}] (PostgreSQL)`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

startServer();

module.exports = { app, server, io };
