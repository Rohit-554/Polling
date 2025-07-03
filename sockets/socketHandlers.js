import pollManager from "../models/PollManager.js";

export default function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("student-join", (name) => {
      pollManager.addStudent(socket.id, name);
      console.log(`Student joined: ${name}`);
    });

    socket.on("create-poll", ({ question, options, duration, correctAnswers }) => {
      pollManager.createPoll(question, options, duration, correctAnswers);
      io.emit("new-poll", pollManager.getActivePoll());

      setTimeout(() => {
        pollManager.endPoll();
        io.emit("poll-ended");
      }, duration * 1000);
    });

    socket.on("submit-answer", (answer) => {
      pollManager.submitAnswer(socket.id, answer);

      const results = pollManager.getResultsByStudent();;
      io.emit("poll-results", results);

      const totalResponses = Object.keys(pollManager.answers).length;
      const totalStudents = pollManager.getStudentCount();

      if (totalResponses === totalStudents) {
        pollManager.endPoll();
        io.emit("poll-ended");
      }
    });


    socket.on("kick-student", (studentName) => {
      const socketId = Object.entries(pollManager.students).find(
        ([id, name]) => name === studentName
      )?.[0];

      if (socketId) {
        pollManager.kickStudent(socketId);
        io.to(socketId).emit("kicked");
        io.emit("poll-results", pollManager.getResultsByStudent());
      }
    });

    socket.on("send-message", ({ sender, text }) => {
      const message = {
        sender,
        text,
        timestamp: Date.now()
      };

      io.emit("new-message", message);
    });



    socket.on("disconnect", () => {
      pollManager.removeStudent(socket.id);
      console.log(`Disconnected: ${socket.id}`);
    });
  });
}
