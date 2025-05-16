import moment from "moment-timezone";

type FormatType = "date" | "time" | "datetime";

export const formatTime = (
  isoDate: string | Date,
  formatType: FormatType = "datetime",
  customFormat?: string
): string => {
  // Chuyển đổi về moment UTC
  const utcMoment = moment.utc(isoDate);

  if (customFormat) return utcMoment.format(customFormat);

  switch (formatType) {
    case "date":
      return utcMoment.format("DD/MM/YYYY");
    case "time":
      return utcMoment.format("HH:mm");
    case "datetime":
    default:
      return utcMoment.format("HH:mm - DD/MM/YYYY");
  }
};
