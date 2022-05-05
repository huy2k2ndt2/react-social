import { format } from "timeago.js";

export default function (value, slice) {
  const time = format(value);
  let timeFormat = time.replace("seconds", "giây");
  timeFormat = timeFormat.replace("minutes", "phút");
  timeFormat = timeFormat.replace("hours", "giờ");
  timeFormat = timeFormat.replace("days", "ngày");
  const idx = timeFormat.indexOf(" ago");
  return slice ? timeFormat.slice(0, idx) : timeFormat;
}
