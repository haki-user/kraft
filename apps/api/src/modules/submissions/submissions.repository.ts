// import { PrismaClient, SubmissionStatus } from "@prisma/client";
// import {
//   CreateSubmissionDTO,
//   SubmissionQuery,
//   SubmissionResponse,
// } from "@kraft/types";

// export const createSubmissionRepository = (prisma: PrismaClient) => ({
//   async create(data: CreateSubmissionDTO): Promise<SubmissionResponse> {
//     return prisma.submission.create({
//       data: {
//         userId: data.userId,
//         problemId: data.problemId,
//         code: data.code,
//         language: data.language,
//         contestId: data.contestId,
//         // Default status is PENDING
//         status: "PENDING",
//         score: 0,
//       },
//     });
//   },

//   async findById(id: string): Promise<SubmissionResponse | null> {
//     return prisma.submission.findUnique({
//       where: { id },
//     });
//   },

//   async list(query: SubmissionQuery): Promise<{
//     submissions: SubmissionResponse[];
//     total: number;
//     page: number;
//     limit: number;
//   }> {
//     const {
//       userId,
//       problemId,
//       contestId,
//       status,
//       page = 1,
//       limit = 10,
//     } = query;

//     const where = {
//       ...(userId && { userId }),
//       ...(problemId && { problemId }),
//       ...(contestId && { contestId }),
//       ...(status && { status }),
//     };

//     const total = await prisma.submission.count({ where });

//     const submissions = await prisma.submission.findMany({
//       where,
//       skip: (page - 1) * limit,
//       take: limit,
//       orderBy: { createdAt: "desc" },
//     });

//     return {
//       submissions,
//       total,
//       page,
//       limit,
//     };
//   },

//   async updateStatus(
//     id: string,
//     status: SubmissionStatus,
//     score?: number
//   ): Promise<SubmissionResponse> {
//     return prisma.submission.update({
//       where: { id },
//       data: {
//         status,
//         ...(score !== undefined && { score }),
//       },
//     });
//   },
// });
