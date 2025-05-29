import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { JobsService } from 'src/jobs/jobs.service';
import { SubcribersService } from 'src/subcribers/subcribers.service';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private subcriberService: SubcribersService,
    private jobService: JobsService,
  ) {}
  async sendTestEmail(options: { from: string; subject: string }) {
    const subcribers = await this.subcriberService.findSubcriberToSendEmail();
    for (const subs of subcribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills =
        await this.jobService.jobsWithMatchingSkills(subsSkills);
      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map((item) => {
          return {
            name: item.name,
            company: item.company.name,
            salary:
              `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VND',
            skills: item.skills,
          };
        });
        await this.mailerService.sendMail({
          to: subs.email,
          from: options.from,
          subject: options.subject,
          template: 'new-job',
          context: {
            receiver: subs.name,
            jobs: jobs,
          },
        });
      }
    }
  }
}
