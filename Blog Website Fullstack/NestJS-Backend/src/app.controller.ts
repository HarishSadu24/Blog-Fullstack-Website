import { Controller, Get, Req , UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';

// @UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  welcome(){
    return 'Hiiiiii';
  }
}
