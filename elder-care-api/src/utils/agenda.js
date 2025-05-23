import Agenda from "agenda";

const agenda = new Agenda({
  db: {
    address:
      process.env.MONGO_URI ||
      "mongodb+srv://ledinhlongmcs:7hS1My9xiBxy69Iy@cluster0.rpkxlzg.mongodb.net/elder_care",
    collection: "agendaJobs",
  },
  processEvery: "30 seconds", // Agenda check job mỗi 30s
});

export default agenda;
