const { prisma } = require('./generated/prisma-client');

async function main() {
  await prisma.createUser({
    name: 'José das Couves',
    email: 'email@email.com',
    password: '12345678'
  });
  const users = await prisma.users();
  console.log(users);
}

main().catch(e => console.error(e))