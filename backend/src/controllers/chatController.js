const { ChatGroup, Dinner, User } = require('../models');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const getMyChats = asyncHandler(async (req, res) => {
  const chats = await ChatGroup.findAll({
    where: { isActive: true },
    include: [
      { model: Dinner, as: 'dinner', attributes: ['id', 'title', 'coverImage', 'date'] },
    ],
    order: [['updatedAt', 'DESC']],
  });

  // Filter chats where user is a member (JSONB array)
  const myChats = chats.filter((chat) =>
    chat.members.some((m) => m.userId === req.user.id)
  );

  res.status(200).json({ success: true, data: myChats });
});

const getChat = asyncHandler(async (req, res) => {
  const chat = await ChatGroup.findByPk(req.params.id, {
    include: [
      { model: Dinner, as: 'dinner', attributes: ['id', 'title', 'coverImage', 'date'] },
    ],
  });

  if (!chat) throw new AppError('Chat not found.', 404);

  const isMember = chat.members.some((m) => m.userId === req.user.id);
  if (!isMember) throw new AppError('Not a member of this chat.', 403);

  res.status(200).json({ success: true, data: chat });
});

const sendMessage = asyncHandler(async (req, res) => {
  const chat = await ChatGroup.findByPk(req.params.id);
  if (!chat) throw new AppError('Chat not found.', 404);

  const isMember = chat.members.some((m) => m.userId === req.user.id);
  if (!isMember) throw new AppError('Not a member of this chat.', 403);

  const { content, type = 'text', image } = req.body;

  const messages = [...chat.messages, {
    senderId: req.user.id,
    content,
    type,
    image,
    readBy: [req.user.id],
    createdAt: new Date().toISOString(),
  }];

  const lastMessage = {
    content,
    senderId: req.user.id,
    createdAt: new Date().toISOString(),
  };

  await chat.update({ messages, lastMessage });

  const updated = await ChatGroup.findByPk(chat.id, {
    include: [
      { model: Dinner, as: 'dinner', attributes: ['id', 'title', 'coverImage', 'date'] },
    ],
  });

  res.status(200).json({ success: true, data: updated });
});

const markRead = asyncHandler(async (req, res) => {
  const chat = await ChatGroup.findByPk(req.params.id);
  if (!chat) throw new AppError('Chat not found.', 404);

  const messages = chat.messages.map((msg) => {
    const readBy = msg.readBy || [];
    if (!readBy.includes(req.user.id)) {
      return { ...msg, readBy: [...readBy, req.user.id] };
    }
    return msg;
  });

  await chat.update({ messages });
  res.status(200).json({ success: true, message: 'Messages marked as read.' });
});

module.exports = { getMyChats, getChat, sendMessage, markRead };
