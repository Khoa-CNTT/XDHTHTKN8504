import React, { useEffect } from "react";
import { InvoiceUsedTable } from "../Tables";
import { useNavigate, useParams } from "react-router-dom";
import { invoicesData } from "../Datas";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoiceForStaff } from "../../store/invoiceSlice";
import Loading from "../Loading";
import ErrorFallback from "../ErrorFallback";

function InvoiceUsed() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {_id } = useParams();
  const { invoices, loading, error } = useSelector((state) => state.invoice)

  useEffect(() => {
    dispatch(fetchInvoiceForStaff(_id));
  }, [dispatch, _id])

  // console.log("id", invoices);
  if (loading)
    return <Loading />
  
  if (error) 
    return <ErrorFallback error={error} onRetry={dispatch(fetchInvoiceForStaff(_id))} />
  
  // preview
  const preview = (id) => {
    // navigate(`/invoices/preview/${id}`);
  };
  return (
    <div className="w-full">
      <h1 className="text-sm font-medium mb-6">Invoices</h1>
      <div className="w-full overflow-x-scroll">
        <InvoiceUsedTable
          data={invoices}
          functions={{
            preview: preview,
          }}
        />
      </div>
    </div>
  );
}

export default InvoiceUsed;
