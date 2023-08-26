export default function getLocaLTime() {
  let time_zone_offset_in_hours = new Date().getTimezoneOffset() / 60;
  //get current datetime hour
  let current_hour = new Date().getHours();
  //adjust current date hour
  let local_datetime_in_milliseconds = new Date().setHours(
    current_hour - time_zone_offset_in_hours
  );
  //format date in milliseconds to ISO String
  let local_datetime = new Date(local_datetime_in_milliseconds).toISOString();
  return local_datetime;
}
