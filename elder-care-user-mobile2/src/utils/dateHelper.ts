import moment from "moment-timezone";

type FormatType = "date" | "time" | "datetime";

export const formatTime = (
  isoDate: string,
  formatType: FormatType = "datetime",
  customFormat?: string
): string => {
  const vnMoment = moment(isoDate).tz("Asia/Ho_Chi_Minh");

  if (customFormat) return vnMoment.format(customFormat);

  switch (formatType) {
    case "date":
      return vnMoment.format("DD/MM/YYYY");
    case "time":
      return vnMoment.format("HH:mm");
    case "datetime":
    default:
      return vnMoment.format("HH:mm - DD/MM/YYYY");
  }
};

