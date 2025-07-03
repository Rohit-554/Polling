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

    const results = pollManager.getResultsByOption();
    io.emit("poll-results", results);

    const totalResponses = Object.keys(pollManager.answers).length;
    const totalStudents = pollManager.getStudentCount();

    if (totalResponses === totalStudents) {
      pollManager.endPoll();
      io.emit("poll-ended");
    }
  });


    socket.on("kick-student", (nameToKick) => {
      const kickedId = pollManager.kickStudent(nameToKick);
      if (kickedId) {
        io.to(kickedId).emit("kicked");
        console.log(`Student ${nameToKick} was kicked.`);
      }
    });

    socket.on("disconnect", () => {
      pollManager.removeStudent(socket.id);
      console.log(`Disconnected: ${socket.id}`);
    });
  });
}
