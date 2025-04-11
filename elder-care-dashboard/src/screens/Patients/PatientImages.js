import React from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Uploader from "../../components/Uploader";
import { Button } from "../../components/Form";

function PatientImages() {
  const [image, setImage] = React.useState(null);
  return (
    <div className="flex-colo gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <div className="relative w-full">
            <img
              src="./images/123.jpg"
              alt="bệnh nhân"
              className="w-full h-72 rounded-lg object-cover"
            />
            <button
              onClick={() => toast.error("Tính năng này chưa khả dụng.")}
              className="bg-white rounded-full w-8 h-8 flex-colo absolute -top-1 -right-1"
            >
              <FaTimes className="text-red-500" />
            </button>
          </div>
        ))}
      </div>
      <Uploader setImage={setImage} />
      <Button
        onClick={() => toast.error("Tính năng này chưa khả dụng.")}
        label="Lưu thay đổi"
        Icon={null}
      />
    </div>
  );
}

export default PatientImages;
