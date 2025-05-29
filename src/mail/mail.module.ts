import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { SubcribersModule } from 'src/subcribers/subcribers.module';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          secure: configService.get<string>('MAIL_SECURE') === 'true',
          auth: {
            user: configService.get<string>('MAIL_AUTH_USER'),
            pass: configService.get<string>('MAIL_AUTH_PASSWORD'),
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        preview: configService.get<string>('MAIL_PREVIEW') === 'true',
      }),
      inject: [ConfigService],
    }),
    SubcribersModule,
    JobsModule,
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
