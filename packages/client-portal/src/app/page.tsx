'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <header className='border-b border-gray-100'>
        <div className='mx-auto max-w-6xl px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='h-8 w-8 rounded-lg bg-gradient-to-br from-sophia-primary to-sophia-secondary' />
            <span className='text-xl font-bold text-sophia-primary'>Sophia Werkt</span>
          </div>
          <div className='flex items-center gap-3'>
            <Link
              href='/login'
              className='text-sophia-primary font-medium hover:text-sophia-secondary transition-colors px-4 py-2'
            >
              Inloggen
            </Link>
            <Link
              href='/register'
              className='bg-sophia-secondary text-white font-medium px-5 py-2 rounded-lg hover:bg-opacity-90 transition-colors'
            >
              Registreren
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className='mx-auto max-w-6xl px-4 py-20 text-center'>
        <h1 className='text-4xl font-bold text-sophia-text tracking-tight sm:text-5xl'>
          Arbeidsrechtelijk advies,<br />
          <span className='text-sophia-secondary'>snel en toegankelijk</span>
        </h1>
        <p className='mt-6 text-lg text-sophia-muted max-w-2xl mx-auto leading-relaxed'>
          Sophia Werkt verbindt u direct met gespecialiseerde arbeidsrechtadvocaten van Rassers Advocaten.
          Upload uw documenten, ontvang een deskundige analyse en persoonlijk advies, alles via een veilig online platform.
        </p>
        <div className='mt-10 flex items-center justify-center gap-4'>
          <Link
            href='/register'
            className='bg-sophia-secondary text-white font-medium px-8 py-3 rounded-lg text-lg hover:bg-opacity-90 transition-colors shadow-sm'
          >
            Start uw aanvraag
          </Link>
          <a
            href='#hoe-werkt-het'
            className='text-sophia-primary font-medium px-8 py-3 rounded-lg text-lg border border-gray-200 hover:bg-gray-50 transition-colors'
          >
            Meer informatie
          </a>
        </div>
      </section>

      {/* Diensten */}
      <section className='bg-gray-50 py-20'>
        <div className='mx-auto max-w-6xl px-4'>
          <h2 className='text-3xl font-bold text-sophia-text text-center mb-4'>Onze diensten</h2>
          <p className='text-sophia-muted text-center mb-12 max-w-xl mx-auto'>
            Sophia Werkt biedt gespecialiseerd arbeidsrechtelijk advies voor werknemers die te maken krijgen met een arbeidsconflict of ontslag.
          </p>
          <div className='grid gap-8 md:grid-cols-3'>
            <ServiceCard
              title='Beoordeling vaststellingsovereenkomst'
              description='Een ervaren arbeidsrechtadvocaat beoordeelt uw VSO op alle relevante punten: vergoeding, opzegtermijn, concurrentiebeding en WW-rechten.'
              price='Vanaf € 750'
            />
            <ServiceCard
              title='Ontslagadvies'
              description='Juridische analyse van uw ontslagsituatie met beoordeling van de ontslaggronden, uw positie en concrete aanbevelingen voor de beste strategie.'
              price='Vanaf € 1.000'
            />
            <ServiceCard
              title='Onderhandeling'
              description='Wij onderhandelen namens u met uw werkgever over de voorwaarden van uw vertrek, zodat u het beste resultaat behaalt.'
              price='Vanaf € 1.500'
            />
          </div>
        </div>
      </section>

      {/* Hoe werkt het */}
      <section id='hoe-werkt-het' className='py-20'>
        <div className='mx-auto max-w-6xl px-4'>
          <h2 className='text-3xl font-bold text-sophia-text text-center mb-4'>Hoe werkt het?</h2>
          <p className='text-sophia-muted text-center mb-12 max-w-xl mx-auto'>
            In vier eenvoudige stappen van vraag naar advies.
          </p>
          <div className='grid gap-8 md:grid-cols-4'>
            <StepCard
              step={1}
              title='Registreer'
              description='Maak een account aan en beschrijf uw situatie. Uw gegevens worden vertrouwelijk behandeld.'
            />
            <StepCard
              step={2}
              title='Upload documenten'
              description='Upload uw arbeidsovereenkomst, VSO of andere relevante documenten via het beveiligde platform.'
            />
            <StepCard
              step={3}
              title='AI-analyse'
              description='Onze AI-technologie maakt een eerste analyse van uw documenten, die door een advocaat wordt gecontroleerd.'
            />
            <StepCard
              step={4}
              title='Persoonlijk advies'
              description='U ontvangt een helder en concreet juridisch advies, opgesteld door een gespecialiseerde advocaat.'
            />
          </div>
        </div>
      </section>

      {/* Waarom Sophia Werkt */}
      <section className='bg-gray-50 py-20'>
        <div className='mx-auto max-w-6xl px-4'>
          <h2 className='text-3xl font-bold text-sophia-text text-center mb-12'>Waarom Sophia Werkt?</h2>
          <div className='grid gap-8 md:grid-cols-2 max-w-4xl mx-auto'>
            <FeatureItem
              title='Gespecialiseerde advocaten'
              description='Uw dossier wordt behandeld door advocaten van Rassers Advocaten met jarenlange ervaring in het arbeidsrecht.'
            />
            <FeatureItem
              title='Veilig en vertrouwelijk'
              description='Al uw gegevens en documenten worden versleuteld opgeslagen en zijn uitsluitend toegankelijk voor u en uw advocaat.'
            />
            <FeatureItem
              title='Snelle doorlooptijd'
              description='Dankzij slimme AI-ondersteuning ontvangt u sneller een gedegen juridisch advies, zonder concessies aan kwaliteit.'
            />
            <FeatureItem
              title='Transparante tarieven'
              description='U weet vooraf wat het advies kost. Geen verborgen kosten, geen verrassingen achteraf.'
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-20'>
        <div className='mx-auto max-w-3xl px-4 text-center'>
          <h2 className='text-3xl font-bold text-sophia-text mb-4'>
            Heeft u een arbeidsrechtelijke vraag?
          </h2>
          <p className='text-sophia-muted text-lg mb-8'>
            Registreer nu en ontvang snel en deskundig advies van een gespecialiseerde advocaat.
          </p>
          <Link
            href='/register'
            className='inline-block bg-sophia-secondary text-white font-medium px-8 py-3 rounded-lg text-lg hover:bg-opacity-90 transition-colors shadow-sm'
          >
            Start uw aanvraag
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-gray-100 py-12 bg-white'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='grid gap-8 md:grid-cols-3'>
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <div className='h-6 w-6 rounded-md bg-gradient-to-br from-sophia-primary to-sophia-secondary' />
                <span className='font-bold text-sophia-primary'>Sophia Werkt</span>
              </div>
              <p className='text-sm text-sophia-muted'>
                Een initiatief van Rassers Advocaten.
                Gespecialiseerd arbeidsrechtelijk advies, ondersteund door AI-technologie.
              </p>
            </div>
            <div>
              <h3 className='font-semibold text-sophia-text mb-3'>Contact</h3>
              <p className='text-sm text-sophia-muted'>
                Rassers Advocaten<br />
                Sophiastraat 24<br />
                4811 EL Breda<br />
                info@sophiawerkt.nl
              </p>
            </div>
            <div>
              <h3 className='font-semibold text-sophia-text mb-3'>Juridisch</h3>
              <p className='text-sm text-sophia-muted'>
                Alle diensten worden verricht door Rassers N.V. onder toepasselijkheid van de Algemene Voorwaarden voor de Rechtspraktijk.
                Ingeschreven bij de KvK te Breda.
              </p>
            </div>
          </div>
          <div className='mt-8 pt-6 border-t border-gray-100 text-center text-sm text-sophia-muted'>
            © {new Date().getFullYear()} Rassers N.V. Alle rechten voorbehouden.
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ title, description, price }: { title: string; description: string; price: string }) {
  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow'>
      <h3 className='text-lg font-semibold text-sophia-text mb-3'>{title}</h3>
      <p className='text-sophia-muted text-sm leading-relaxed mb-4'>{description}</p>
      <p className='text-sophia-secondary font-semibold'>{price}</p>
    </div>
  );
}

function StepCard({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className='text-center'>
      <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sophia-secondary text-white text-lg font-bold'>
        {step}
      </div>
      <h3 className='text-lg font-semibold text-sophia-text mb-2'>{title}</h3>
      <p className='text-sophia-muted text-sm leading-relaxed'>{description}</p>
    </div>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className='flex gap-4'>
      <div className='mt-1 flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center'>
        <svg className='h-4 w-4 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
          <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
        </svg>
      </div>
      <div>
        <h3 className='font-semibold text-sophia-text mb-1'>{title}</h3>
        <p className='text-sophia-muted text-sm leading-relaxed'>{description}</p>
      </div>
    </div>
  );
}
