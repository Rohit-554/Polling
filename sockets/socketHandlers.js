import pollManager from "../models/PollManager.js";

export default function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("student-join", (name) => {
      pollManager.addStudent(socket.id, name);
      console.log(`✅ Student joined: ${name} (${socket.id})`);
      console.log(`Current student count: ${pollManager.getStudentCount()}`);
    });

    socket.on("create-poll", ({ question, options, duration }) => {
      pollManager.createPoll(question, options, duration);
      console.log(`🟣 Poll created: "${question}"`);
      console.log(`Options: ${options.join(", ")}`);
      console.log(`Duration: ${duration}s`);
      io.emit("new-poll", pollManager.getActivePoll());

      // Start timer to end poll
      console.log("⏳ Poll timer started...");
      setTimeout(() => {
        pollManager.endPoll();
        io.emit("poll-ended");
        console.log("🔴 Poll ended automatically after timer expired.");
      }, duration * 1000);
    });

    socket.on("submit-answer", (answer) => {
      pollManager.submitAnswer(socket.id, answer);
      console.log(`✅ Answer received from ${socket.id}: ${answer}`);

      const currentResults = pollManager.getResults();
      console.log(`📊 Current answers count: ${Object.keys(currentResults).length}/${pollManager.getStudentCount()}`);

      io.emit("poll-results", currentResults);

      // If all students have answered, end poll early
      if (
        Object.keys(currentResults).length ===
        pollManager.getStudentCount()
      ) {
        pollManager.endPoll();
        io.emit("poll-ended");
        console.log("✅ All students answered—poll ended early.");
      }
    });

    socket.on("disconnect", () => {
      pollManager.removeStudent(socket.id);
      console.log(`⚠️ Client disconnected: ${socket.id}`);
      console.log(`Remaining students: ${pollManager.getStudentCount()}`);
    });
  });
}