import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from './schemas/resume.schema';
import { UsersModule } from 'src/users/users.module';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),
    UsersModule,
    JobsModule,
  ],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}
