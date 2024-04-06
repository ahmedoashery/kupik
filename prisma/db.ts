import { Prisma, PrismaClient, type Item } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    model: {
      $allModels: {
        async exists<T>(
          this: T,
          where: Prisma.Args<T, 'findFirst'>['where']
        ): Promise<boolean> {
          // Get the current model at runtime
          const context = Prisma.getExtensionContext(this)

          const result = await (context as any).findFirst({ where })
          return result !== null
        },
      },
      item: {
        async checkDuplicates(item: any, id?: number) {
          const match = await db.item.findFirst({
            where: {
              AND: [
                { id: { not: parseInt(id!.toString()) } },
                {
                  OR: [
                    { code: item.code },
                    { name: item.name },
                  ]
                }
              ]
            }
          })

          if (id !== match?.id) {
            if (item.code == match?.code) {
              throw createError({ data: [{ message: 'الكود مسجل - يرجى اختيار كود اخر', path: ['code'] }] })
            }
            if (item.name == match?.name) {
              throw createError({ data: [{ message: 'الاسم مسجل - يرجى اختيار اسم اخر', path: ['name'] }] })
            }
          }
        }
      }
    },
    result: {
      entity: {
        fullname: {
          needs: { firstname: true, lastname: true },
          compute(entity) {
            return `${entity.firstname} ${entity.lastname || ''}`
          },
        }
      },
      user: {
        fullname: {
          needs: { firstname: true, lastname: true },
          compute(user) {
            return `${user.firstname} ${user.lastname || ''}`
          },
        }
      }
    },
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as { prisma: PrismaClientSingleton | undefined }

export const db = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
