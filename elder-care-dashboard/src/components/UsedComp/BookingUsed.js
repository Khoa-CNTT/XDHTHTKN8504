import { useEffect, useState } from "react";
import { BookingTable1 } from "../Tables";
import { fetchBookingForCustomer } from "../../store/bookingSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function BookingUsed() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const { _id } = useParams()
  const dispatch = useDispatch();
  const { customerBookings, loading, error } = useSelector((state) => state.booking || {})

  useEffect(() => {
    dispatch(fetchBookingForCustomer(_id))
  }, [dispatch, _id])

  console.log("dddaaa", customerBookings);
  

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
        data={customerBookings}
        doctor={""}
        functions={{
          preview: handleEventClick,
        }}
        />
      </div>
    </div>
  );
}

export default BookingUsed;
