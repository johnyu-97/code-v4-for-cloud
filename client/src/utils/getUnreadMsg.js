export const getUnreadMsg = (notifications) => {
  return notifications.filter((n) => n.isRead === false);
};
