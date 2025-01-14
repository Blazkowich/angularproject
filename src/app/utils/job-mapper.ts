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

  static mapJobForUpdate(job: Job): any {
    return {
      name: job.jobName,
      description: job.jobDescription,
      positions: job.positions,
      category: job.jobCategory,
      unit: job.unit,
      address: job.address,
      openbase: job.openBase,
      additionalinfo: job.additionalInfo,
      questions: job.commonQuestions,
      answers: job.commonAnswers,
      workexperience: job.workExperience,
      education: job.education,
      passedcourses: job.passedCourses,
      techskills: job.techSkills,
      status: job.status.toLowerCase()
    };
  }

  static mapJobForAdd(job: Job): any {
    return {
      name: job.jobName,
      description: job.jobDescription,
      positions: job.positions,
      category: job.jobCategory,
      unit: job.unit,
      address: job.address,
      openBase: job.openBase,
      additionalInfo: job.additionalInfo,
      questions: job.commonQuestions,
      answers: job.commonAnswers,
      workExperience: job.workExperience,
      education: job.education,
      passedCourses: job.passedCourses,
      techSkills: job.techSkills
    };
  }
}
