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
  {
    id: 3,
    name: "Lê Văn C",
    messages: ["Khách: Tôi gặp lỗi khi đặt hàng"],
  },
];

export default function ChatPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0].id);
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState(customers);

  const selectedCustomer = chatData.find((c) => c.id === selectedCustomerId);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setChatData((prev) =>
      prev.map((c) =>
        c.id === selectedCustomerId
          ? { ...c, messages: [...c.messages, `Admin: ${message}`] }
          : c
      )
    );
    setMessage("");
  };

  return (
    <Layout>
      <h1 className="text-xl font-semibold">Hộp thoại hỗ trợ</h1>

      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        className="my-8 bg-white rounded-xl border border-border p-5"
      >
        <div className="flex h-[70vh] rounded-xl overflow-hidden">
          {/* Danh sách khách hàng */}
          <aside className="w-1/3 bg-gray-50 border-r border-border p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Khách hàng</h2>
            {chatData.map((customer) => (
              <button
                key={customer.id}
                onClick={() => setSelectedCustomerId(customer.id)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-all duration-200 ${
                  selectedCustomerId === customer.id
                    ? "bg-blue-200 font-medium"
                    : "hover:bg-gray-200"
                }`}
              >
                {customer.name}
              </button>
            ))}
          </aside>

          {/* Khung chat */}
          <section className="w-2/3 flex flex-col bg-gray-100">
            <div className="bg-blue-100 px-4 py-3 border-b border-border text-lg font-semibold">
              {selectedCustomer.name}
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {selectedCustomer.messages.map((msg, idx) => {
                const isAdmin = msg.startsWith("Admin:");
                const cleanMsg = msg.replace("Admin: ", "");
                return (
                  <div
                    key={idx}
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      isAdmin
                        ? "bg-blue-500 text-white self-end"
                        : "bg-gray-300 self-start"
                    }`}
                    title={isAdmin ? "Admin" : "Khách"}
                  >
                    {cleanMsg}
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-white border-t border-border flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 px-4 py-2 rounded-lg"
                placeholder="Nhập tin nhắn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Gửi
              </button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
