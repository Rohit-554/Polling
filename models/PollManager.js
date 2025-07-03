class PollManager {
  constructor() {
    this.students = {}; 
    this.answers = {}; 
    this.currentPoll = null; 
    this.kickedStudents = new Set();
  }

  addStudent(id, name) {
    this.students[id] = name;
  }

  removeStudent(id) {
    delete this.students[id];
    delete this.answers[id];
  }

  getStudentCount() {
    return Object.keys(this.students).length;
  }

  getStudentName(id) {
    return this.students[id];
  }

  getAllStudentNames() {
    return Object.values(this.students);
  }

  createPoll(question, options, duration, correctAnswers) {
    this.currentPoll = {
      question,
      options,
      duration,
      correctAnswers,
    };
    this.answers = {};
  }

  submitAnswer(id, answer) {
    if (!this.students[id] || !this.currentPoll) return;
    this.answers[id] = answer;
  }

  endPoll() {
    this.currentPoll = null;
    this.answers = {};
  }

  getActivePoll() {
    return this.currentPoll;
  }

  getResultsByStudent() {
    const results = {};
    Object.entries(this.answers).forEach(([socketId, answer]) => {
      const name = this.students[socketId] || "Anonymous";
      results[name] = answer;
    });
    return results;
  }


  getResultsByOption() {
    if (!this.currentPoll) return {};

    const resultCount = {};
    this.currentPoll.options.forEach((opt) => {
      resultCount[opt] = 0;
    });

    Object.values(this.answers).forEach((ans) => {
      if (resultCount[ans] !== undefined) {
        resultCount[ans]++;
      }
    });

    return resultCount;
  }

  isPollActive() {
    return !!this.currentPoll;
  }

  kickStudent(socketId) {
  this.kickedStudents.add(socketId);
  delete this.students[socketId];
  delete this.answers[socketId];
  }

  isKicked(socketId) {
    return this.kickedStudents.has(socketId);
  }
}

export default new PollManager();
