import { PrismaClient } from '@prisma/client'
import { fakerAR as faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  console.log('===============\n', 'Seeding...')

  const entities = Array.from({ length: 30000 }).map(() => ({
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    avatar: faker.image.avatar(),
    // code: faker.string.numeric({ length: { min: 5, max: 30 } }),
    // accountNumber: faker.string.numeric({ length: { min: 5, max: 30 } }),
    contact: faker.person.jobTitle(),
    company: faker.company.name(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    zipcode: faker.location.zipCode(),
    startedAt: faker.date.past(),
  }))

  const items = Array.from({ length: 30000 }).map(() => ({
    code: faker.string.numeric({ length: { min: 3, max: 50 } }),
    name: faker.commerce.product(),
    cost: faker.commerce.price(),
    price: faker.commerce.price(),
  }))

  const orders = Array.from({ length: 3000 }).map(() => ({
    serialNo: faker.number.int(),
    entityId: faker.number.int({ min: 1, max: 9 }),
    addedBy: faker.number.int({ min: 1, max: 3 }),
    addedAt: faker.date.anytime(),
    updatedBy: faker.number.int({ min: 1, max: 3 }),
    updatedAt: faker.date.anytime(),
    statusId: faker.number.int({ min: 1, max: 3 }),
    statusAt: faker.date.anytime(),
    comments: faker.lorem.sentence(5),
    notes: faker.lorem.sentence(5),
  }))

  const shippersData = Array.from({ length: 3000 }).map(() => ({
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    code: faker.string.numeric({ length: { min: 5, max: 10 } }),
    contact: faker.person.jobTitle(),
    company: faker.company.name(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    zipcode: faker.location.zipCode(),
    startedAt: faker.date.past(),
  }))

  const invoices = Array.from({ length: 30 }).map(() => ({
    num: faker.number.int({ min: 3, max: 10 }),
    type: faker.helpers.arrayElement(['invoice', 'return-invoice', 'bill', 'return-bill', 'payment']),
    entityId: faker.number.int({ min: 3, max: 10 }),
    // accountId: faker.number.int({ min: 3, max: 10 }),
    // userId: faker.number.int(),
    date: faker.date.past()
  }))

  const invoiceLines = Array.from({ length: 300 }).map(() => ({
    // accountId: faker.number.int({ min: 3, max: 10 }),
    itemId: faker.number.int({ min: 3, max: 10 }),
    quantity: faker.number.float({ min: 1, max: 10, fractionDigits: 2 }),
    price: faker.commerce.price(),
    amount: faker.commerce.price(),
  }))

  // Items
  console.log('Seeding Items.')
  await prisma.inventory.upsert({
    where: { name: 'Main' },
    update: {},
    create: {
      name: 'Main',
      items: {
        createMany: {
          skipDuplicates: true,
          data: items
        }

      }
    }
  }).then(() => console.log('Completed.', '\n==================='))
    .catch((error) => console.log(error))

  // Customers
  console.log('Seeding Customers.')
  await prisma.group.upsert({
    where: { name: 'Customers' },
    update: {},
    create: {
      name: 'Customers',
      entities: {
        createMany: {
          skipDuplicates: true,
          data: entities
        },
      },
    },
  }).then(() => console.log('Completed.', '\n==================='))
    .catch((error) => console.log(error))

  // Vendors
  console.log('Seeding Vendors.')
  await prisma.group.upsert({
    where: { name: 'Vendors' },
    update: {},
    create: {
      name: 'Vendors',
      entities: {
        createMany: {
          skipDuplicates: true,
          data: entities,
        },
      },
    },
  }).then(() => console.log('Completed.', '\n==================='))
    .catch((error) => console.log(error))

  // Shippers
  console.log('Seeding Shippers.')
  await prisma.group.upsert({
    where: { name: 'Shippers' },
    update: {},
    create: {
      name: 'Shippers',
      shippers: {
        createMany: {
          skipDuplicates: true,
          data: shippersData
        }
      },
    },
  }).then(() => console.log('Completed.', '\n==================='))
    .catch((error) => console.log(error))

  // Satatuses
  console.log('Seeding Satatuses.')
  await prisma.status.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Added' },
      { name: 'Pending' },
      { name: 'On Hold' },
      { name: 'Shipped' },
      { name: 'Returned' },
      { name: 'Delivered' },
      { name: 'Paid' },
      { name: 'Complete' },
    ]
  }).then(() => console.log('Completed.', '\n==================='))
    .catch((error) => console.log(error))

  // Orders
  console.log('Seeding Orders.')
  await prisma.order.createMany({
    skipDuplicates: true,
    data: orders
  }).then(() => console.log('All Done.', '\n==================='))
    .catch((error) => console.log(error))

  // Invoices
  console.log('Seeding Invoices.')
  for (let i of invoices) {
    await prisma.invoice.upsert({
      where: { num: i.num },
      update: {},
      create: {
        num: i.num,
        type: i.type,
        entityId: i.entityId,
        accountId: i.accountId,
        // userId: i.userId,
        date: i.date,
        invoiceLines: {
          createMany: {
            data: invoiceLines
          }
        }
      }
    }).then(() => console.log('Completed.', '\n==================='))
      .catch((error) => console.log(error))
  }

  // const deleteDublicateNames = async () => {
  //   const all = await prisma.entity.findMany()
  //   const uniques = await prisma.entity.findMany({ distinct: ['firstname'] })
  //   const dublicates = all.filter((n) => !uniques.some((u) => u.id === n.id))
  //   for (let dublicate of dublicates) {
  //     await prisma.entity.delete({ where: { id: dublicate.id } })
  //   }
  // }

  // await deleteDublicateNames()

  console.log('==========================\n', 'Completed...', '\n==========================\n')

  // console.log(customersGroup, vendorsGroup, entities)
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
