import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorators/customize';
import { Cron } from '@nestjs/schedule';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Get()
  @ResponseMessage('Send test email successfully')
  @Cron('0 10 0 * * 0')
  async handleTestEmail() {
    await this.mailService.sendTestEmail({
      from: 'vu65617@gmail.com',
      subject: 'Mail subcribers',
    });
    return 'OK';
  }
}
