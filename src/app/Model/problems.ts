import { Entity } from "./entity";

export class Problems extends Entity {
    userId: string;
    problemId: number;
    confirmationNumber: string;
    subjectId: number;
    descriptionId: number;
    problemStatusId: number;
    problemText: string;
    solutionText: string;
    anyProblemAttachemt: boolean;
    anySolutionAttachemt: boolean;
    createdByUserId: string;
    createdDate: Date | string | null;
    acceptedByUserId: string;
    descriptionTitle: string;

    problemFileName: string;
    problemOriginalFileName: string;
    problemFileExtention: string;
    problemFileContentType: string;
    problemCreatedDate: Date;

    solutionFileName: string;
    solutionOriginalFileName: string;
    solutionFileExtention: string;
    solutionFileContentType: string;
    solutionCreatedDate: Date;

    studentFirstName: string;
    studentLastName: string;
    teacherFirstName: string;
    teacherLastName: string;

    statusMessage: string;
    successStatus: boolean;
    totalActiveProblems: number;
    totalAcceptedProblems: number;
    isSent: boolean;
    paymentSelectionId: number;
}
