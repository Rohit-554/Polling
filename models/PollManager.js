class PollManager {
  constructor() {
    this.students = {}; 
    this.answers = {}; 
    this.currentPoll = null; 
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

  kickStudent(nameToKick) {
    for (const [id, name] of Object.entries(this.students)) {
      if (name === nameToKick) {
        this.removeStudent(id);
        return id;
      }
    }
    return null;
  }
}

export default new PollManager();
