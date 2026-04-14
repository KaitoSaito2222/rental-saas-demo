import { PrismaClient, Role, Province, ApplicationStatus, AuditAction, ResourceType, OrganizationPlan } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('demo1234', 12);

  const organization = await prisma.organization.upsert({
    where: { slug: 'maple-properties' },
    update: {},
    create: {
      name: 'Maple Properties',
      slug: 'maple-properties',
      plan: OrganizationPlan.FREE,
      country: 'CA',
      timezone: 'America/Vancouver',
    },
  });

  const landlord = await prisma.user.upsert({
    where: {
      organizationId_email: {
        organizationId: organization.id,
        email: 'landlord@mapleproperties.ca',
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      email: 'landlord@mapleproperties.ca',
      passwordHash,
      role: Role.LANDLORD,
    },
  });

  const property = await prisma.property.upsert({
    where: { id: 'demo-property-1' },
    update: {},
    create: {
      id: 'demo-property-1',
      organizationId: organization.id,
      name: 'Granville Townhome',
      address: '101 Granville St, Vancouver, BC',
      province: Province.BC,
    },
  });

  const application = await prisma.application.upsert({
    where: { id: 'demo-application-1' },
    update: {},
    create: {
      id: 'demo-application-1',
      organizationId: organization.id,
      propertyId: property.id,
      applicantEmail: 'tenant@example.com',
      income: 72000,
      status: ApplicationStatus.PENDING,
      notes: 'Demo application created by seed.',
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: organization.id,
      userId: landlord.id,
      action: AuditAction.REGISTER,
      resourceType: ResourceType.ORGANIZATION,
      resourceId: organization.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: organization.id,
      userId: landlord.id,
      action: AuditAction.PROPERTY_CREATED,
      resourceType: ResourceType.PROPERTY,
      resourceId: property.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: organization.id,
      userId: landlord.id,
      action: AuditAction.APPLICATION_SUBMITTED,
      resourceType: ResourceType.APPLICATION,
      resourceId: application.id,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
