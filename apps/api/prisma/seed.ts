import { PrismaClient, Role, Province, ApplicationStatus, AuditAction, ResourceType, OrganizationPlan } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('demo1234', 12);

  // Remove legacy demo orgs so landlord/tenant always end up in one org for demos.
  await prisma.organization.deleteMany({
    where: { slug: { in: ['tenant-demo', 'test'] } },
  });

  // ─── Landlord org ─────────────────────────────────────────────────────────
  const landlordOrg = await prisma.organization.upsert({
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
    where: { organizationId_email: { organizationId: landlordOrg.id, email: 'landlord@demo.com' } },
    update: {},
    create: {
      organizationId: landlordOrg.id,
      email: 'landlord@demo.com',
      passwordHash,
      role: Role.LANDLORD,
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: landlordOrg.id,
      userId: landlord.id,
      action: AuditAction.REGISTER,
      resourceType: ResourceType.ORGANIZATION,
      resourceId: landlordOrg.id,
    },
  });

  // ─── Properties ────────────────────────────────────────────────────────────
  const prop1 = await prisma.property.upsert({
    where: { id: 'demo-property-1' },
    update: {},
    create: {
      id: 'demo-property-1',
      organizationId: landlordOrg.id,
      name: 'Granville Townhome',
      address: '101 Granville St, Vancouver',
      province: Province.BC,
    },
  });

  const prop2 = await prisma.property.upsert({
    where: { id: 'demo-property-2' },
    update: {},
    create: {
      id: 'demo-property-2',
      organizationId: landlordOrg.id,
      name: 'Yaletown Studio',
      address: '880 Pacific Blvd, Vancouver',
      province: Province.BC,
    },
  });

  const prop3 = await prisma.property.upsert({
    where: { id: 'demo-property-3' },
    update: {},
    create: {
      id: 'demo-property-3',
      organizationId: landlordOrg.id,
      name: 'Kitsilano Apartment',
      address: '2285 W 4th Ave, Vancouver',
      province: Province.BC,
    },
  });

  for (const p of [prop1, prop2, prop3]) {
    await prisma.auditLog.create({
      data: {
        organizationId: landlordOrg.id,
        userId: landlord.id,
        action: AuditAction.PROPERTY_CREATED,
        resourceType: ResourceType.PROPERTY,
        resourceId: p.id,
      },
    });
  }

  // ─── Applications (4 statuses) ─────────────────────────────────────────────
  const applications = [
    {
      id: 'demo-app-1',
      propertyId: prop1.id,
      applicantEmail: 'tenant@demo.com',
      income: 72000,
      status: ApplicationStatus.PENDING,
      notes: 'Long-term tenant, references available.',
    },
    {
      id: 'demo-app-2',
      propertyId: prop2.id,
      applicantEmail: 'alice@example.com',
      income: 85000,
      status: ApplicationStatus.REVIEWED,
      notes: 'Credit check completed.',
    },
    {
      id: 'demo-app-3',
      propertyId: prop3.id,
      applicantEmail: 'bob@example.com',
      income: 95000,
      status: ApplicationStatus.APPROVED,
      notes: 'Approved — move-in date May 1.',
    },
    {
      id: 'demo-app-4',
      propertyId: prop1.id,
      applicantEmail: 'carol@example.com',
      income: 42000,
      status: ApplicationStatus.REJECTED,
      notes: 'Income does not meet minimum requirement.',
    },
  ];

  for (const app of applications) {
    const created = await prisma.application.upsert({
      where: { id: app.id },
      update: {},
      create: { ...app, organizationId: landlordOrg.id },
    });

    await prisma.auditLog.create({
      data: {
        organizationId: landlordOrg.id,
        userId: landlord.id,
        action: AuditAction.APPLICATION_SUBMITTED,
        resourceType: ResourceType.APPLICATION,
        resourceId: created.id,
      },
    });
  }

  // ─── Tenant user (same org as landlord) ───────────────────────────────────
  // Both users share the same org so tenant can see the same properties/applications.
  const tenant = await prisma.user.upsert({
    where: { organizationId_email: { organizationId: landlordOrg.id, email: 'tenant@demo.com' } },
    update: {},
    create: {
      organizationId: landlordOrg.id,
      email: 'tenant@demo.com',
      passwordHash,
      role: Role.TENANT,
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: landlordOrg.id,
      userId: tenant.id,
      action: AuditAction.REGISTER,
      resourceType: ResourceType.USER,
      resourceId: tenant.id,
    },
  });

  console.log('\n✓ Seed complete\n');
  console.log('Demo accounts (both use org slug: maple-properties):');
  console.log('  Landlord  → email: landlord@demo.com | password: demo1234');
  console.log('  Tenant    → email: tenant@demo.com   | password: demo1234');
  console.log('\nProperties (3): Granville Townhome, Yaletown Studio, Kitsilano Apartment');
  console.log('Applications (4): PENDING, REVIEWED, APPROVED, REJECTED\n');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
