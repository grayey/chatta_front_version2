const setTimeOfChat = () => {
  const today = new Date();
  const hour = today.getHours();
  const suffix = +hour < 12 ? "AM" : "PM";
  return `${hour} : ${today.getMinutes()}  ${suffix}`;
};

export default setTimeOfChat;
