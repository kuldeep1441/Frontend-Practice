export const AllMonthName = [
  {
    value: "01",
    label: "January",
  },
  {
    value: "02",
    label: "February",
  },
  {
    value: "03",
    label: "March",
  },
  {
    value: "04",
    label: "April",
  },
  {
    value: "05",
    label: "May",
  },
  {
    value: "06",
    label: "June",
  },
  {
    value: "07",
    label: "July",
  },
  {
    value: "08",
    name: "August",
  },
  {
    value: "09",
    label: "September",
  },
  {
    value: "10",
    label: "October",
  },
  {
    value: "11",
    label: "November",
  },
  {
    value: "12",
    label: "December",
  },
];

export const AllYearName = () => {
  const year = new Date().getFullYear();
  const yearArray = [];
  for (let i = 1980; i <= year; i++) {
    yearArray.push({
      value: i,
      label: i,
    });
  }

  return yearArray.reverse();
};

export const getTitleCase = (str: string) => {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const wrapOverflowingText = (
  text: string | undefined,
  maxChars: number
) => {
  return text && text.length > maxChars
    ? text.slice(0, maxChars) + "..."
    : text;
};

export const dataURLtoFile = (dataurl: string, filename: string): File => {
  const [header, base64] = dataurl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error("Invalid data URL");
  }
  const mime = mimeMatch[1];
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new File([array], filename, { type: mime });
};

export const createMarkup = (htmlContent: string) => {
  return { __html: htmlContent };
};

export const clearUserLocalStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userFirstName");
  localStorage.removeItem("userLastName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("termId");
  localStorage.removeItem("termName");
  localStorage.removeItem("batchId");
  localStorage.removeItem("profilePicUrl");
};

export const generateHexadecimalString = (length = 24) => {
  const characters = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }
  return result;
};

export const formatToTime = (dateString: string) => {
  const date = new Date(dateString);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};
