// models/PollManager.js
class PollManager {
  constructor() {
    this.activePoll = null;
    this.answers = {};
    this.students = {};
    this.pollHistory = [];
  }

  createPoll(question, options, duration) {
    this.activePoll = {
      id: Date.now(),
      question,
      options,
      duration,
      createdAt: Date.now()
    };
    this.answers = {};
  }

  submitAnswer(studentId, answer) {
    this.answers[studentId] = answer;
  }

  endPoll() {
    if (this.activePoll) {
      this.pollHistory.push({
        ...this.activePoll,
        results: this.answers
      });
    }
    this.activePoll = null;
    this.answers = {};
  }

  getResults() {
    return this.answers;
  }

  getHistory() {
    return this.pollHistory;
  }

  addStudent(socketId, name) {
    this.students[socketId] = name;
  }

  removeStudent(socketId) {
    delete this.students[socketId];
    delete this.answers[socketId];
  }

  getStudentCount() {
    return Object.keys(this.students).length;
  }

  getActivePoll() {
    return this.activePoll;
  }
}

const pollManager = new PollManager();
export default pollManager;
