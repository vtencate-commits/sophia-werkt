import { PrismaClient, Role, AdviceType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin gebruiker
  const adminPassword = await bcrypt.hash('AdminWelkom2024!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sophiawerkt.nl' },
    update: {},
    create: {
      email: 'admin@sophiawerkt.nl',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'Sophia Werkt',
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log(`Admin aangemaakt: ${admin.email}`);

  // Advocaat gebruiker (Victor)
  const lawyerPassword = await bcrypt.hash('LawyerWelkom2024!', 12);
  const lawyer = await prisma.user.upsert({
    where: { email: 'v.tencate@rassers.nl' },
    update: {},
    create: {
      email: 'v.tencate@rassers.nl',
      passwordHash: lawyerPassword,
      firstName: 'Victor',
      lastName: 'ten Cate',
      role: Role.LAWYER,
      isActive: true,
    },
  });
  console.log(`Advocaat aangemaakt: ${lawyer.email}`);

  // Tweede advocaat
  const lawyer2 = await prisma.user.upsert({
    where: { email: 'a.bakker@rassers.nl' },
    update: {},
    create: {
      email: 'a.bakker@rassers.nl',
      passwordHash: lawyerPassword,
      firstName: 'Anne',
      lastName: 'Bakker',
      role: Role.LAWYER,
      isActive: true,
    },
  });
  console.log(`Advocaat aangemaakt: ${lawyer2.email}`);

  // Test client 1
  const clientPassword = await bcrypt.hash('ClientWelkom2024!', 12);
  const client = await prisma.user.upsert({
    where: { email: 'test.client@example.com' },
    update: {},
    create: {
      email: 'test.client@example.com',
      passwordHash: clientPassword,
      firstName: 'Jan',
      lastName: 'de Vries',
      phone: '+31612345678',
      role: Role.CLIENT,
      isActive: true,
    },
  });
  console.log(`Client aangemaakt: ${client.email}`);

  // Test client 2
  const client2 = await prisma.user.upsert({
    where: { email: 'maria.jansen@example.com' },
    update: {},
    create: {
      email: 'maria.jansen@example.com',
      passwordHash: clientPassword,
      firstName: 'Maria',
      lastName: 'Jansen',
      phone: '+31687654321',
      role: Role.CLIENT,
      isActive: true,
    },
  });
  console.log(`Client aangemaakt: ${client2.email}`);

  // Test client 3
  const client3 = await prisma.user.upsert({
    where: { email: 'peter.smit@example.com' },
    update: {},
    create: {
      email: 'peter.smit@example.com',
      passwordHash: clientPassword,
      firstName: 'Peter',
      lastName: 'Smit',
      phone: '+31698765432',
      role: Role.CLIENT,
      isActive: true,
    },
  });
  console.log(`Client aangemaakt: ${client3.email}`);

  // Tariefconfiguratie
  const pricingConfigs = [
    { adviceType: AdviceType.VSO_REVIEW, amount: 750, description: 'Beoordeling vaststellingsovereenkomst' },
    { adviceType: AdviceType.VSO_NEGOTIATION, amount: 1500, description: 'Onderhandeling vaststellingsovereenkomst' },
    { adviceType: AdviceType.DISMISSAL_ADVICE, amount: 1000, description: 'Ontslagadvies' },
    { adviceType: AdviceType.LABOR_DISPUTE, amount: 1250, description: 'Advies arbeidsconflict' },
    { adviceType: AdviceType.NON_COMPETE_CHECK, amount: 500, description: 'Beoordeling concurrentiebeding' },
    { adviceType: AdviceType.OTHER, amount: 750, description: 'Overig arbeidsrechtelijk advies' },
  ];

  for (const config of pricingConfigs) {
    await prisma.pricingConfig.upsert({
      where: { adviceType: config.adviceType },
      update: { amount: config.amount, description: config.description },
      create: {
        adviceType: config.adviceType,
        amount: config.amount,
        description: config.description,
      },
    });
  }
  console.log('Tariefconfiguratie aangemaakt');

  // Standaard AI Skills
  const vsoSkill = await prisma.aiSkill.create({
    data: {
      name: 'VSO Beoordeling',
      description: 'Analyse van een vaststellingsovereenkomst namens de werknemer',
      category: 'vso_review',
      systemPrompt: `Je bent een gespecialiseerde arbeidsrechtadvocaat die een vaststellingsovereenkomst beoordeelt namens de werknemer. Analyseer de VSO op de volgende punten:

1. FORMELE VEREISTEN
   Bedenktermijn van 14 dagen (art. 7:670b lid 2 BW), initiatief werkgever, schriftelijkheidsvereiste.

2. FINANCIELE BEPALINGEN
   Aangeboden vergoeding, wettelijke transitievergoeding, vergelijking, juridische kostenbijdrage.

3. OPZEGTERMIJN EN EINDDATUM
   Correcte opzegtermijn, vrijstelling werkzaamheden, gevolgen voor WW.

4. CONCURRENTIE EN RELATIEBEDING
   Status van eventuele bedingen, opheffing of handhaving.

5. FINALE KWIJTING
   Kwijtingsclausule en uitzonderingen.

6. OVERIGE BEPALINGEN
   Geheimhouding, referenties, vakantiedagen, vakantiegeld, pensioen, terugbetalingsregelingen, bedrijfseigendommen.

7. RISICOANALYSE
   Belangrijkste risico's, afwijkingen van standaardpraktijk, verbeterpunten.

8. ADVIES
   Overall beoordeling (gunstig/neutraal/ongunstig), concrete verbeterpunten, prioritering.

Antwoord in gestructureerd JSON formaat. Wees specifiek, noem artikelnummers, en geef concrete bedragen waar mogelijk. Benoem expliciet als informatie ontbreekt.`,
      isActive: true,
      version: 1,
      createdBy: lawyer.id,
    },
  });
  console.log(`AI Skill aangemaakt: ${vsoSkill.name}`);

  // AI Skill: Ontslagadvies
  const dismissalSkill = await prisma.aiSkill.create({
    data: {
      name: 'Ontslagadvies',
      description: 'Analyse van een ontslagsituatie en advies over juridische positie werknemer',
      category: 'dismissal_advice',
      systemPrompt: `Je bent een gespecialiseerde arbeidsrechtadvocaat die een ontslagsituatie analyseert namens de werknemer. Beoordeel de situatie op de volgende punten:

1. ONTSLAGGROND
   Welke ontslaggrond(en) worden aangevoerd? Zijn deze voldoende onderbouwd? Toets aan art. 7:669 BW.

2. ONTSLAGROUTE
   Is de juiste route gevolgd (UWV/kantonrechter/wederzijds goedvinden)? Procedurele eisen.

3. HERPLAATSING
   Is aan de herplaatsingsplicht voldaan? Welke inspanningen zijn verricht?

4. DOSSIEROPBOUW
   Is er een adequaat dossier? Functioneringsgesprekken, waarschuwingen, verbetertraject.

5. TRANSITIEVERGOEDING
   Berekening transitievergoeding, eventuele billijke vergoeding.

6. OPZEGTERMIJN
   Correcte opzegtermijn, ingangsdatum.

7. RISICOANALYSE
   Kans van slagen voor werkgever, sterke en zwakke punten positie werknemer.

8. ADVIES
   Aanbevolen strategie, onderhandelingspositie, concrete stappen.

Antwoord in gestructureerd JSON formaat. Wees specifiek en noem relevante wetsartikelen.`,
      isActive: true,
      version: 1,
      createdBy: lawyer.id,
    },
  });
  console.log(`AI Skill aangemaakt: ${dismissalSkill.name}`);

  // Testdossier 1 - Intake status
  const testCase1 = await prisma.case.create({
    data: {
      referenceNumber: 'SW2024000001',
      title: 'VSO Beoordeling De Vries/TechBedrijf B.V.',
      description: 'Client verzoekt beoordeling van aangeboden vaststellingsovereenkomst.',
      adviceType: AdviceType.VSO_REVIEW,
      status: 'INTAKE',
      feeType: 'FIXED',
      feeAmount: 750,
      employerName: 'TechBedrijf B.V.',
      employerKvk: '12345678',
      clientNotes: 'Ik heb een VSO ontvangen van mijn werkgever en wil graag laten beoordelen of de voorwaarden redelijk zijn.',
      clientId: client.id,
      lawyerId: lawyer.id,
      statusHistory: {
        create: {
          toStatus: 'INTAKE',
          changedBy: client.id,
          notes: 'Dossier aangemaakt via intake',
        },
      },
    },
  });
  console.log(`Testdossier aangemaakt: ${testCase1.referenceNumber}`);

  // Testdossier 2 - In behandeling
  const testCase2 = await prisma.case.create({
    data: {
      referenceNumber: 'SW2024000002',
      title: 'Ontslagadvies Jansen/RetailKeten N.V.',
      description: 'Client is op staande voet ontslagen en betwist de gronden.',
      adviceType: AdviceType.DISMISSAL_ADVICE,
      status: 'LAWYER_REVIEW',
      feeType: 'FIXED',
      feeAmount: 1000,
      employerName: 'RetailKeten N.V.',
      employerKvk: '87654321',
      clientNotes: 'Ik ben vorige week op staande voet ontslagen. Volgens mijn werkgever wegens disfunctioneren, maar ik heb nooit een waarschuwing gehad.',
      clientId: client2.id,
      lawyerId: lawyer.id,
      statusHistory: {
        createMany: {
          data: [
            { toStatus: 'INTAKE', changedBy: client2.id, notes: 'Dossier aangemaakt via intake' },
            { fromStatus: 'INTAKE', toStatus: 'DOCUMENTS_RECEIVED', changedBy: client2.id, notes: 'Documenten ontvangen' },
            { fromStatus: 'DOCUMENTS_RECEIVED', toStatus: 'AI_ANALYSIS_PENDING', changedBy: lawyer.id, notes: 'AI analyse gestart' },
            { fromStatus: 'AI_ANALYSIS_PENDING', toStatus: 'AI_ANALYSIS_COMPLETE', notes: 'AI analyse afgerond' },
            { fromStatus: 'AI_ANALYSIS_COMPLETE', toStatus: 'LAWYER_REVIEW', changedBy: lawyer.id, notes: 'Advocaat beoordeelt analyse' },
          ],
        },
      },
    },
  });
  console.log(`Testdossier aangemaakt: ${testCase2.referenceNumber}`);

  // Testdossier 3 - Afgerond
  const testCase3 = await prisma.case.create({
    data: {
      referenceNumber: 'SW2024000003',
      title: 'Concurrentiebeding Smit/Consultancy Partners B.V.',
      description: 'Client wil weten of zijn concurrentiebeding stand houdt bij overstap naar concurrent.',
      adviceType: AdviceType.NON_COMPETE_CHECK,
      status: 'CLOSED',
      feeType: 'FIXED',
      feeAmount: 500,
      employerName: 'Consultancy Partners B.V.',
      employerKvk: '11223344',
      clientNotes: 'Ik wil overstappen naar een concurrent maar heb een concurrentiebeding in mijn contract.',
      adviceFinal: '<h2>Advies Concurrentiebeding</h2><p>Op basis van de analyse van uw arbeidsovereenkomst en de specifieke omstandigheden adviseren wij als volgt...</p>',
      adviceApprovedAt: new Date('2024-12-01'),
      adviceDeliveredAt: new Date('2024-12-02'),
      clientId: client3.id,
      lawyerId: lawyer2.id,
      statusHistory: {
        createMany: {
          data: [
            { toStatus: 'INTAKE', changedBy: client3.id, notes: 'Dossier aangemaakt via intake' },
            { fromStatus: 'INTAKE', toStatus: 'DOCUMENTS_RECEIVED', changedBy: client3.id },
            { fromStatus: 'DOCUMENTS_RECEIVED', toStatus: 'AI_ANALYSIS_COMPLETE', notes: 'AI analyse afgerond' },
            { fromStatus: 'AI_ANALYSIS_COMPLETE', toStatus: 'ADVICE_DRAFT', changedBy: lawyer2.id },
            { fromStatus: 'ADVICE_DRAFT', toStatus: 'ADVICE_FINAL', changedBy: lawyer2.id },
            { fromStatus: 'ADVICE_FINAL', toStatus: 'DELIVERED', changedBy: lawyer2.id },
            { fromStatus: 'DELIVERED', toStatus: 'CLOSED', changedBy: lawyer2.id, notes: 'Dossier afgesloten' },
          ],
        },
      },
    },
  });
  console.log(`Testdossier aangemaakt: ${testCase3.referenceNumber}`);

  // Factuur voor afgesloten dossier
  await prisma.invoice.create({
    data: {
      caseId: testCase3.id,
      invoiceNumber: 'SW2024001',
      amount: 500,
      vatAmount: 105,
      totalAmount: 605,
      description: 'Beoordeling concurrentiebeding',
      lineItems: [
        { description: 'Beoordeling concurrentiebeding - vast tarief', amount: 500, vatRate: 21 },
      ],
      status: 'PAID',
      dueDate: new Date('2024-12-16'),
      paidAt: new Date('2024-12-10'),
    },
  });
  console.log('Factuur aangemaakt voor dossier SW2024000003');

  console.log('Database seeding voltooid.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
