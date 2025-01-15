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

  static mapJobForVolunteerMainPage(input: any): Job {
    return {
      jobName: input.title,
      id: input.id,
      jobDescription: input.description,
      positions: input.vacant_positions,
      jobCategory: input.jobCategory,
      unit: input.unit,
      address: input.address,
      openBase: input.openBase,
      closedBase: input.closedBase,
      additionalInfo: input.additionalInfo,
      commonQuestions: input.commonQuestions,
      commonAnswers: input.commonAnswers,
      education: input.education,
      techSkills: input.techSkills,
      workExperience: input.workExperience,
      passedCourses: input.passedCourses,
      candidateCount: input.candidateCount,
      status: input.status,
      department: input.department
    };
  }

  static mapJobsForVolunteerMainPage(input: any[]): Job[] {
    return input.map(item => ({
      jobName: item.title,
      id: item.id,
      jobDescription: item.description,
      positions: item.vacant_positions,
      jobCategory: item.jobCategory,
      unit: item.unit,
      address: item.address,
      openBase: item.openBase,
      closedBase: item.closedBase,
      additionalInfo: item.additionalInfo,
      commonQuestions: item.commonQuestions,
      commonAnswers: item.commonAnswers,
      education: item.education,
      techSkills: item.techSkills,
      workExperience: item.workExperience,
      passedCourses: item.passedCourses,
      candidateCount: item.candidateCount,
      status: item.status,
      department: item.department
    }));
  }
}
