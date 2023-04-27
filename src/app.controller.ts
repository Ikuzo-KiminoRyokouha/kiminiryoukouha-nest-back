import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { error } from 'console';
import { PythonShell } from 'python-shell';
import { throwError } from 'rxjs';

@Controller()
export class AppController {
  @Get()
  sayHello() {
    return 'hello';
  }

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
