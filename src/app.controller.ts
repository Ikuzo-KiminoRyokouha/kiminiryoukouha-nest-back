import { Body, Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { error } from 'console';
import { PythonShell } from 'python-shell';
import { throwError } from 'rxjs';
import { planRepository } from './travels/repositories/plan.repository';

@Controller()
export class AppController {
  // constructor(private planRepository: planRepository) {}

  @Get()
  sayHello() {
    return 'hello';
  }

  // @Get('test')
  // async test(@Body() testInput) {
  //   console.log(testInput);
  //   const plan = await this.planRepository.showPlan(testInput.planId);
  //   const endDay = plan.end.toISOString().slice(0, 10).split('-').join('');
  //   const startDay = plan.start.toISOString().slice(0, 10).split('-').join('');
  //   console.log(startDay, endDay);
  //   const nowDate = new Date().toISOString().slice(0, 10).split('-').join('');
  //   console.log(startDay > nowDate);
  //   console.log(endDay >= nowDate);

  //   console.log(nowDate);
  // }

  // @Cron('0 1 23 * * *')
  @Cron('0 38 * * * *')
  dataToCSV() {
    try {
      axios
        .get(process.env.DJANGO_API + '/destinations')
        .then((res) => {
          console.log('success to ' + res);
        })
        .catch((error) => {
          console.log(error);
          throwError;
        });
    } catch (error) {
      return 'cronjob error';
    }
  }
}
