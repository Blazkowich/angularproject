import { Job } from "../models/jobs.model";

export class JobMapper {
  static mapJobResponse(job: any): Job {
    return {
      id: job.id.toString(),
      jobName: job.title,
      jobCategory: '',
      unit: '',
      address: '',
      positions: job.vacant_positions ?? null,
      openBase: false,
      closedBase: false,
      jobDescription: job.description,
      additionalInfo: '',
      commonQuestions: '',
      commonAnswers: '',
      education: '',
      techSkills: '',
      workExperience: '',
      passedCourses: '',
      candidateCount: 0,
      status: 'open',
      department: '',
    };
  }
}
