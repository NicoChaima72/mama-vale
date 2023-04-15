import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  getOne: publicProcedure
    .input(z.object({ rut: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          rut: input.rut,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        rut: z.string(),
        names: z.string(),
        lastNames: z.string(),
        address: z.string(),
        city: z.string(),
        phone: z.string(),
        email: z.string(),
        birthday: z.date(),
        civilStatus: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          rut: input.rut,
        },
      });

      if (user)
        return { ok: false, message: "El usuario ya existe", user: null };

      const newUser = await ctx.prisma.user.create({
        data: {
          rut: input.rut,
          names: input.names,
          lastNames: input.lastNames,
          address: input.address,
          city: input.city,
          phone: input.phone,
          email: input.email,
          birthday: input.birthday,
          civilStatus: input.civilStatus,
        },
      });

      return { ok: true, user: newUser, message: "Usuario creado" };
    }),

  update: publicProcedure
    .input(
      z.object({
        rut: z.string(),
        names: z.string(),
        lastNames: z.string(),
        address: z.string(),
        city: z.string(),
        phone: z.string(),
        email: z.string(),
        birthday: z.date(),
        civilStatus: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          rut: input.rut,
        },
        data: {
          names: input.names,
          lastNames: input.lastNames,
          address: input.address,
          city: input.city,
          phone: input.phone,
          email: input.email,
          birthday: input.birthday,
          civilStatus: input.civilStatus,
        },
      });
    }),
});
