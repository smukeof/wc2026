import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type MatchInput = { phase: string; group?: string; teamHome: string; teamAway: string; kickoff: Date }

const d = (iso: string) => new Date(iso)

const MATCHES: MatchInput[] = [
  // ========================= KOLEJKA 1 =========================
  { phase: 'Kolejka 1', group: 'A', teamHome: 'Meksyk',                   teamAway: 'RPA',                      kickoff: d('2026-06-11T21:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'A', teamHome: 'Korea Południowa',          teamAway: 'Czechy',                   kickoff: d('2026-06-12T04:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'B', teamHome: 'Kanada',                   teamAway: 'Bośnia i Hercegowina',     kickoff: d('2026-06-12T21:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'B', teamHome: 'Katar',                    teamAway: 'Szwajcaria',               kickoff: d('2026-06-13T21:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'D', teamHome: 'USA',                      teamAway: 'Paragwaj',                 kickoff: d('2026-06-13T03:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'C', teamHome: 'Brazylia',                 teamAway: 'Maroko',                   kickoff: d('2026-06-14T00:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'C', teamHome: 'Haiti',                    teamAway: 'Szkocja',                  kickoff: d('2026-06-14T03:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'D', teamHome: 'Australia',                teamAway: 'Turcja',                   kickoff: d('2026-06-14T06:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'E', teamHome: 'Niemcy',                   teamAway: 'Curaçao',                  kickoff: d('2026-06-14T19:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'F', teamHome: 'Holandia',                 teamAway: 'Japonia',                  kickoff: d('2026-06-14T22:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'E', teamHome: 'Wybrzeże Kości Słoniowej', teamAway: 'Ekwador',                  kickoff: d('2026-06-15T01:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'F', teamHome: 'Szwecja',                  teamAway: 'Tunezja',                  kickoff: d('2026-06-15T04:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'H', teamHome: 'Hiszpania',                teamAway: 'Wyspy Zielonego Przylądka',kickoff: d('2026-06-15T18:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'G', teamHome: 'Belgia',                   teamAway: 'Egipt',                    kickoff: d('2026-06-15T21:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'H', teamHome: 'Arabia Saudyjska',         teamAway: 'Urugwaj',                  kickoff: d('2026-06-16T00:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'G', teamHome: 'Iran',                     teamAway: 'Nowa Zelandia',            kickoff: d('2026-06-16T03:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'I', teamHome: 'Francja',                  teamAway: 'Senegal',                  kickoff: d('2026-06-16T21:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'I', teamHome: 'Irak',                     teamAway: 'Norwegia',                 kickoff: d('2026-06-17T00:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'J', teamHome: 'Argentyna',                teamAway: 'Algieria',                 kickoff: d('2026-06-17T03:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'J', teamHome: 'Austria',                  teamAway: 'Jordania',                 kickoff: d('2026-06-17T06:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'K', teamHome: 'Portugalia',               teamAway: 'DR Kongo',                 kickoff: d('2026-06-17T19:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'L', teamHome: 'Anglia',                   teamAway: 'Chorwacja',                kickoff: d('2026-06-17T22:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'L', teamHome: 'Ghana',                    teamAway: 'Panama',                   kickoff: d('2026-06-18T01:00:00+02:00') },
  { phase: 'Kolejka 1', group: 'K', teamHome: 'Uzbekistan',               teamAway: 'Kolumbia',                 kickoff: d('2026-06-18T04:00:00+02:00') },

  // ========================= KOLEJKA 2 =========================
  { phase: 'Kolejka 2', group: 'A', teamHome: 'Czechy',                   teamAway: 'RPA',                      kickoff: d('2026-06-18T18:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'B', teamHome: 'Szwajcaria',               teamAway: 'Bośnia i Hercegowina',     kickoff: d('2026-06-18T21:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'B', teamHome: 'Kanada',                   teamAway: 'Katar',                    kickoff: d('2026-06-19T00:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'A', teamHome: 'Meksyk',                   teamAway: 'Korea Południowa',         kickoff: d('2026-06-19T03:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'D', teamHome: 'USA',                      teamAway: 'Australia',                kickoff: d('2026-06-19T21:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'C', teamHome: 'Szkocja',                  teamAway: 'Maroko',                   kickoff: d('2026-06-20T00:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'C', teamHome: 'Brazylia',                 teamAway: 'Haiti',                    kickoff: d('2026-06-20T02:30:00+02:00') },
  { phase: 'Kolejka 2', group: 'D', teamHome: 'Turcja',                   teamAway: 'Paragwaj',                 kickoff: d('2026-06-20T05:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'F', teamHome: 'Holandia',                 teamAway: 'Szwecja',                  kickoff: d('2026-06-20T19:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'E', teamHome: 'Niemcy',                   teamAway: 'Wybrzeże Kości Słoniowej', kickoff: d('2026-06-20T22:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'E', teamHome: 'Ekwador',                  teamAway: 'Curaçao',                  kickoff: d('2026-06-21T02:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'F', teamHome: 'Tunezja',                  teamAway: 'Japonia',                  kickoff: d('2026-06-21T06:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'H', teamHome: 'Hiszpania',                teamAway: 'Arabia Saudyjska',         kickoff: d('2026-06-21T18:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'G', teamHome: 'Belgia',                   teamAway: 'Iran',                     kickoff: d('2026-06-21T21:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'H', teamHome: 'Urugwaj',                  teamAway: 'Wyspy Zielonego Przylądka',kickoff: d('2026-06-22T00:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'G', teamHome: 'Nowa Zelandia',            teamAway: 'Egipt',                    kickoff: d('2026-06-22T03:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'J', teamHome: 'Argentyna',                teamAway: 'Austria',                  kickoff: d('2026-06-22T19:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'I', teamHome: 'Francja',                  teamAway: 'Irak',                     kickoff: d('2026-06-22T23:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'I', teamHome: 'Norwegia',                 teamAway: 'Senegal',                  kickoff: d('2026-06-23T02:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'J', teamHome: 'Jordania',                 teamAway: 'Algieria',                 kickoff: d('2026-06-23T05:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'K', teamHome: 'Portugalia',               teamAway: 'Uzbekistan',               kickoff: d('2026-06-23T19:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'L', teamHome: 'Anglia',                   teamAway: 'Ghana',                    kickoff: d('2026-06-23T22:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'L', teamHome: 'Panama',                   teamAway: 'Chorwacja',                kickoff: d('2026-06-24T01:00:00+02:00') },
  { phase: 'Kolejka 2', group: 'K', teamHome: 'Kolumbia',                 teamAway: 'DR Kongo',                 kickoff: d('2026-06-24T04:00:00+02:00') },

  // ========================= KOLEJKA 3 =========================
  { phase: 'Kolejka 3', group: 'B', teamHome: 'Szwajcaria',               teamAway: 'Kanada',                   kickoff: d('2026-06-24T21:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'B', teamHome: 'Bośnia i Hercegowina',     teamAway: 'Katar',                    kickoff: d('2026-06-24T21:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'C', teamHome: 'Maroko',                   teamAway: 'Haiti',                    kickoff: d('2026-06-25T00:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'C', teamHome: 'Szkocja',                  teamAway: 'Brazylia',                 kickoff: d('2026-06-25T00:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'A', teamHome: 'Czechy',                   teamAway: 'Meksyk',                   kickoff: d('2026-06-25T03:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'A', teamHome: 'RPA',                      teamAway: 'Korea Południowa',         kickoff: d('2026-06-25T03:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'E', teamHome: 'Ekwador',                  teamAway: 'Niemcy',                   kickoff: d('2026-06-25T22:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'E', teamHome: 'Curaçao',                  teamAway: 'Wybrzeże Kości Słoniowej', kickoff: d('2026-06-25T22:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'F', teamHome: 'Japonia',                  teamAway: 'Szwecja',                  kickoff: d('2026-06-26T01:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'F', teamHome: 'Tunezja',                  teamAway: 'Holandia',                 kickoff: d('2026-06-26T01:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'D', teamHome: 'Turcja',                   teamAway: 'USA',                      kickoff: d('2026-06-26T04:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'D', teamHome: 'Paragwaj',                 teamAway: 'Australia',                kickoff: d('2026-06-26T04:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'I', teamHome: 'Senegal',                  teamAway: 'Irak',                     kickoff: d('2026-06-26T21:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'I', teamHome: 'Norwegia',                 teamAway: 'Francja',                  kickoff: d('2026-06-26T21:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'H', teamHome: 'Urugwaj',                  teamAway: 'Hiszpania',                kickoff: d('2026-06-27T02:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'H', teamHome: 'Wyspy Zielonego Przylądka',teamAway: 'Arabia Saudyjska',         kickoff: d('2026-06-27T02:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'G', teamHome: 'Egipt',                    teamAway: 'Iran',                     kickoff: d('2026-06-27T05:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'G', teamHome: 'Nowa Zelandia',            teamAway: 'Belgia',                   kickoff: d('2026-06-27T05:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'L', teamHome: 'Chorwacja',                teamAway: 'Ghana',                    kickoff: d('2026-06-27T23:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'L', teamHome: 'Panama',                   teamAway: 'Anglia',                   kickoff: d('2026-06-27T23:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'K', teamHome: 'Kolumbia',                 teamAway: 'Portugalia',               kickoff: d('2026-06-28T01:30:00+02:00') },
  { phase: 'Kolejka 3', group: 'K', teamHome: 'DR Kongo',                 teamAway: 'Uzbekistan',               kickoff: d('2026-06-28T01:30:00+02:00') },
  { phase: 'Kolejka 3', group: 'J', teamHome: 'Algieria',                 teamAway: 'Austria',                  kickoff: d('2026-06-28T04:00:00+02:00') },
  { phase: 'Kolejka 3', group: 'J', teamHome: 'Jordania',                 teamAway: 'Argentyna',                kickoff: d('2026-06-28T04:00:00+02:00') },

  // ========================= 1/16 FINAŁU (16 meczów) =========================
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-06-29T21:00:00+02:00') },
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-06-30T00:00:00+02:00') },
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-06-30T21:00:00+02:00') },
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-01T00:00:00+02:00') },
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-01T21:00:00+02:00') },
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-02T00:00:00+02:00') },
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-02T21:00:00+02:00') },
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-03T00:00:00+02:00') },
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-03T21:00:00+02:00') },
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-04T00:00:00+02:00') },
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-04T21:00:00+02:00') },
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-05T00:00:00+02:00') },
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-05T21:00:00+02:00') },
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-06T00:00:00+02:00') },
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-06T21:00:00+02:00') },
  { phase: '1/16 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-07T00:00:00+02:00') },

  // ========================= 1/8 FINAŁU (8 meczów) =========================
  { phase: '1/8 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-08T21:00:00+02:00') },
  { phase: '1/8 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-09T01:00:00+02:00') },
  { phase: '1/8 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-09T21:00:00+02:00') },
  { phase: '1/8 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-10T01:00:00+02:00') },
  { phase: '1/8 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-10T21:00:00+02:00') },
  { phase: '1/8 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-11T01:00:00+02:00') },
  { phase: '1/8 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-11T21:00:00+02:00') },
  { phase: '1/8 finału', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-12T01:00:00+02:00') },

  // ========================= ĆWIERĆFINAŁY (4 mecze) =========================
  { phase: 'Ćwierćfinały', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-13T21:00:00+02:00') },
  { phase: 'Ćwierćfinały', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-14T01:00:00+02:00') },
  { phase: 'Ćwierćfinały', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-14T21:00:00+02:00') },
  { phase: 'Ćwierćfinały', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-15T01:00:00+02:00') },

  // ========================= PÓŁFINAŁY (2 mecze) =========================
  { phase: 'Półfinały', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-16T02:00:00+02:00') },
  { phase: 'Półfinały', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-17T02:00:00+02:00') },

  // ========================= MECZ O 3. MIEJSCE =========================
  { phase: 'Mecz o 3. miejsce', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-19T02:00:00+02:00') },

  // ========================= FINAŁ =========================
  { phase: 'Finał', teamHome: 'TBD', teamAway: 'TBD', kickoff: d('2026-07-20T02:00:00+02:00') },
]

async function main() {
  // Users
  for (const u of [
    { code: 'ADMIN2026', name: 'Admin',  isAdmin: true  },
    { code: 'MARCEL26',  name: 'Marcel', isAdmin: false },
    { code: 'MAKS26',    name: 'Maks',   isAdmin: false },
    { code: 'KUBA26',    name: 'Kuba',   isAdmin: false },
    { code: 'FILIP26',   name: 'Filip',  isAdmin: false },
  ]) {
    await prisma.user.upsert({ where: { code: u.code }, update: {}, create: u })
  }

  // Matches — clear and re-create
  await prisma.prediction.deleteMany()
  await prisma.match.deleteMany()
  await prisma.match.createMany({ data: MATCHES })

  const count = await prisma.match.count()
  console.log(`✅ Seed zakończony! Wgrano ${count} meczów.`)
  console.log('   Kody: ADMIN2026 (admin) | MARCEL26 (Marcel)')
}

main().catch(console.error).finally(() => prisma.$disconnect())
