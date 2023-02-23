import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PythonShell } from 'python-shell';
import { throwError } from 'rxjs';

@Controller()
export class AppController {
  @Get()
  sayHello() {
    return 'hello';
  }

  @Cron('0 0 0 * * *')
  dataToCSV() {
    try {
      PythonShell.run(
        'dataToCSV.py',
        {
          mode: 'text',
          scriptPath: 'src/util/python',
        },
        function (err, data) {
          if (!err) {
            throwError;
          }
          console.log('success to cronJob');
        },
      );
    } catch (error) {
      return 'cronjob error';
    }
  }
}
