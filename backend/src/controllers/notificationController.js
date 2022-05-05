const bcrypt = require("bcrypt");
const Notification = require("../models/notificationModel");

const notificationController = {
  createNotification: async (req, res, next) => {
    try {
      const notification = new Notification(req.body);
      await notification.save();

      res.json({
        message: "Create notification Success",
        notification: notification,
      });
    } catch (err) {
      next(err);
    }
  },
  getNotificationsNotRead: async (req, res, next) => {
    try {
      const { userId } = req;

      const notifications = await Notification.find({
        receiverId: userId,
        isRead: false,
      });

      res.json({
        message: "Get notifications not read Success",
        number: notifications.length,
      });
    } catch (err) {
      next(err);
    }
  },
  getNotifications: async (req, res, next) => {
    try {
      const { userId } = req;

      const notifications = await Notification.find({
        receiverId: userId,
      });

      res.json({
        message: "Get all notifications Success",
        notifications,
      });
    } catch (err) {
      next(err);
    }
  },
  deleteNotification: async (req, res, next) => {
    try {
      const { notificationId } = req.params;
      const { userId } = req;
      const notification = await Notification.findById(notificationId);

      if (!notification) {
        return res
          .status(404)
          .json({ message: "This notification does not exist" });
      }

      if (notification.receiverId !== userId) {
        return res
          .status(404)
          .json({ message: "You can not remove another user notification" });
      }

      await Notification.findByIdAndDelete(notificationId);

      res.json({
        message: "Delete notification Success",
      });
    } catch (err) {
      next(err);
    }
  },
  removeAllNotifications: async (req, res, next) => {
    try {
      const { userId } = req;

      const notifications = await Notification.find({ receiverId: userId });

      await Promise.all(
        notifications.map((notification) => {
          return Notification.findByIdAndDelete(notification._id.toString());
        })
      );

      res.json({
        message: "Delete all notifications Success",
      });
    } catch (err) {
      next(err);
    }
  },
  updateReadNotification: async (req, res, next) => {
    try {
      const { notificationId } = req.params;
      const { userId } = req;
      const notification = await Notification.findById(notificationId);

      if (!notification) {
        return res
          .status(404)
          .json({ message: "This notification does not exist" });
      }

      if (notification.receiverId !== userId) {
        return res
          .status(404)
          .json({ message: "You can not upadte another user notification" });
      }

      if (notification.isRead) {
        return res.status(404).json({ message: "Notification has been read" });
      }

      const notificationUpdate = await Notification.findByIdAndUpdate(
        notificationId,
        {
          $set: { isRead: true },
        },
        { new: true }
      );

      res.json({
        message: "Read notifications Success",
        newNotification: notificationUpdate,
      });
    } catch (err) {
      next(err);
    }
  },
  unReadNotification: async (req, res, next) => {
    try {
      const { notificationId } = req.params;
      const { userId } = req;
      const notification = await Notification.findById(notificationId);

      if (!notification) {
        return res
          .status(404)
          .json({ message: "This notification does not exist" });
      }

      if (notification.receiverId !== userId) {
        return res
          .status(404)
          .json({ message: "You can not upadte another user notification" });
      }

      if (!notification.isRead) {
        return res
          .status(404)
          .json({ message: "Notification has been not read" });
      }

      const notificationUpdate = await Notification.findByIdAndUpdate(
        notificationId,
        {
          $set: { isRead: false },
        },
        { new: true }
      );

      res.json({
        message: "Read notifications Success",
        newNotification: notificationUpdate,
      });
    } catch (err) {
      next(err);
    }
  },
  updateReadAllNotification: async (req, res, next) => {
    try {
      const { userId } = req;

      const notifications = await Notification.find({ receiverId: userId });

      const notificationsUpadte = await Promise.all(
        notifications.map((notification) => {
          return Notification.findByIdAndUpdate(
            notification?._id.toString(),
            {
              $set: { isRead: true },
            },
            { new: true }
          );
        })
      );

      res.json({
        message: "Read all notifications Success",
        notifications: notificationsUpadte,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = notificationController;
