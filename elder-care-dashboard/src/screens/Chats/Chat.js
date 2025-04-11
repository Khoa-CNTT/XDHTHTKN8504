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
      <div className="flex h-screen bg-gray-100">
        {/* Danh sách khách hàng */}
        <div className="w-1/3 bg-white shadow-lg overflow-y-auto p-4">
          <h2 className="text-xl font-semibold mb-4">Khách hàng</h2>
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
        <div className="w-2/3 flex flex-col bg-white shadow-lg">
          <div className="p-4 border-b text-xl font-semibold bg-blue-100">
            {selectedCustomer.name}
          </div>
          <div className="flex-1 p-4 overflow-y-auto flex flex-col">
            {selectedCustomer.messages.map((msg, index) => {
              const isAdmin = msg.startsWith("Admin:");
              return (
                <div
                  key={index}
                  className={`p-2 my-2 w-max max-w-xs rounded-lg ${
                    isAdmin
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-300 self-start"
                  }`}
                >
                  {msg.replace("Admin: ", "")}{" "}
                  {/* Xóa nhãn Admin khi hiển thị */}
                </div>
              );
            })}
          </div>
          <div className="p-4 border-t flex items-center sticky bottom-0 bg-white">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg"
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
    </Layout>
  );
}
