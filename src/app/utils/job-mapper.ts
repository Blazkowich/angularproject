import { Job } from "../models/jobs.model";

export class JobMapper {
  static mapJobResponse(job: any): Job {
    return {
      id: job.id,
      jobName: job.jobName,
      jobCategory: job.jobCategory,
      unit: job.unit,
      address: job.address,
      positions: job.positions,
      openBase: job.openBase,
      closedBase: job.closedBase,
      jobDescription: job.jobDescription,
      additionalInfo: job.additionalInfo,
      commonQuestions: job.commonQuestions,
      commonAnswers: job.commonAnswers,
      education: job.education,
      techSkills: job.techSkills,
      workExperience: job.workExperience,
      passedCourses: job.passedCourses,
      candidateCount: job.candidateCount,
      status: job.status,
      department: job.department,
    };
  }
}
