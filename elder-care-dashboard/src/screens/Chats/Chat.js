import { useState } from "react";
import Layout from "../../Layout";

const customers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    messages: ["Khách: Xin chào", "Khách: Tôi cần hỗ trợ"],
  },
  {
    id: 2,
    name: "Trần Thị B",
    messages: ["Khách: Giá sản phẩm này bao nhiêu?", "Khách: Cảm ơn bạn"],
  },
  { id: 3, name: "Lê Văn C", messages: ["Khách: Tôi gặp lỗi khi đặt hàng"] },
];

export default function ChatPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      setSelectedCustomer((prev) => ({
        ...prev,
        messages: [...prev.messages, `Admin: ${message}`],
      }));
      setMessage("");
    }
  };

  return (
    <Layout>
      <h1 className="text-xl font-semibold">Hộp Thoại</h1>

      {/* Giao diện được bọc giống Booking */}
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        <div className="flex h-[70vh]">
          {/* Danh sách khách hàng */}
          <div className="w-1/3 bg-gray-50 border-r border-border overflow-y-auto p-4 rounded-l-xl">
            <h2 className="text-lg font-semibold mb-4">Khách hàng</h2>
            {customers.map((customer) => (
              <div
                key={customer.id}
                className={`p-3 cursor-pointer rounded-lg mb-2 transition duration-300 ${
                  selectedCustomer.id === customer.id
                    ? "bg-blue-200"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                {customer.name}
              </div>
            ))}
          </div>

          {/* Khung chat */}
          <div className="w-2/3 flex flex-col">
            <div className="p-4 border-b border-border text-xl font-semibold bg-blue-100 rounded-tr-xl">
              {selectedCustomer.name}
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
              {selectedCustomer.messages.map((msg, index) => {
                const isAdmin = msg.startsWith("Admin:");
                return (
                  <div
                    key={index}
                    className={`p-2 w-max max-w-xs rounded-lg ${
                      isAdmin
                        ? "bg-blue-500 text-white self-end"
                        : "bg-gray-300 self-start"
                    }`}
                  >
                    {msg.replace("Admin: ", "")}
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-border flex items-center bg-white rounded-b-xl">
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded-lg"
                placeholder="Nhập tin nhắn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={handleSendMessage}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
