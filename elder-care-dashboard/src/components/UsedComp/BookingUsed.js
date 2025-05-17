import { useState } from "react";
import { BookingTable1 } from "../Tables";

function BookingUsed() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

  // onClick event handler
  const handleEventClick = (event) => {
    setData(event);
    setOpen(!open);
  };
  // handle modal close
  const handleClose = () => {
    setOpen(!open);
    setData({});
  };
  return (
    <div className="w-full">
      <h1 className="text-sm font-medium mb-6">Bookings</h1>
      <div className="w-full overflow-x-scroll">
        <BookingTable1
        // data={bookingData}
        // doctor={doctor}
        // functions={{
        //   preview: handleEventClick,
        // }}
        />
      </div>
    </div>
  );
}

export default BookingUsed;
