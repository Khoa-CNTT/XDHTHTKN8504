export type WorkItem = {
  id: string;
  name: string;
  location: string;
  time: string;
  status: "ongoing" | "completed";
  detail: string;
};

const fetchWorkData = async (
  status: "ongoing" | "completed"
): Promise<WorkItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: WorkItem[] = [
        {
          id: "1",
          name: "Chăm sóc ông A",
          location: "Quận 1",
          time: "5pm - 8pm",
          status: "ongoing",
          detail: "Chăm sóc sức khỏe.",
        },
        {
          id: "2",
          name: "Chăm sóc bà B",
          location: "Quận 3",
          time: "6pm - 9pm",
          status: "completed",
          detail: "Hỗ trợ ăn uống.",
        },
      ];
      resolve(mockData.filter((item) => item.status === status));
    }, 1000);
  });
};
export default fetchWorkData;
