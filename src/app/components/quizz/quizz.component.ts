import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {

  title: string = "";

  questions: any;
  questionSelected: any;

  answers: string[] = [];
  answerSelected: string = "";

  questionIndex: number = 0;
  questionMaxIndex: number = 0;

  finished: boolean = false;

  fullData: any; // Para armazenar o JSON completo

  constructor() {}

  ngOnInit(): void {
    fetch('assets/data/quizz_question.json')
      .then(res => res.json())
      .then(data => {
        this.fullData = data;

        this.finished = false;
        this.title = this.fullData.title;

        this.questions = this.fullData.questions;
        this.questionSelected = this.questions[this.questionIndex];

        this.questionIndex = 0;
        this.questionMaxIndex = this.questions.length;

        console.log(this.questionIndex);
        console.log(this.questionMaxIndex);
      });
  }

  playerChoose(value: string) {
    this.answers.push(value);
    this.nextStep();
  }

  async nextStep() {
    this.questionIndex += 1;

    if (this.questionMaxIndex > this.questionIndex) {
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      const finalAnswer: string = await this.checkResult(this.answers);
      this.finished = true;
      this.answerSelected = this.fullData.results[finalAnswer as keyof typeof this.fullData.results];
    }
  }

  async checkResult(answers: string[]) {
    const result = answers.reduce((previous, current, i, arr) => {
      if (
        arr.filter(item => item === previous).length >
        arr.filter(item => item === current).length
      ) {
        return previous;
      } else {
        return current;
      }
    });

    return result;
  }
}
