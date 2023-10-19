import { Body, Controller, Get } from '@nestjs/common';
import axios from 'axios';
import { error } from 'console';
import { PythonShell } from 'python-shell';
import { throwError } from 'rxjs';
import { planRepository } from './travels/repositories/plan.repository';

@Controller()
export class AppController {
}
