import { useEffect, useState } from 'react';
import { appointmentsData } from '../Datas';
import AddAppointmentModal from '../Modals/AddApointmentModal';
import { AppointmentTable } from '../Tables';
import { useDispatch, useSelector } from 'react-redux';
import { fetchScheduleForStaff } from '../../store/scheduleSlice';
import { useParams } from 'react-router-dom';
import Loading from '../Loading';

function AppointmentsUsed({ doctor }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const { _id } = useParams()
  const { schedule, loading, error } = useSelector((state) => state.schedule)

  useEffect(() => {
    dispatch(fetchScheduleForStaff(_id));
  }, [dispatch, _id])

  console.log("dlal", schedule);
  

  if (loading) return <Loading />;
  if (error) return <p>Lỗi: {error}</p>;  

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
      {open && (
        <AddAppointmentModal
          datas={data}
          isOpen={open}
          closeModal={() => {
            handleClose();
          }}
        />
      )}
      <h1 className="text-sm font-medium mb-6">Appointments</h1>
      <div className="w-full overflow-x-scroll">
        <AppointmentTable
          data={schedule}
          doctor={doctor}
          functions={{
            preview: handleEventClick,
          }}
        />
      </div>
    </div>
  );
}

export default AppointmentsUsed;
