export type DynamicAnswerKey =
  | 'president'
  | 'vicePresident'
  | 'speakerOfTheHouse'
  | 'chiefJustice'
  | 'governor'
  | 'stateSenators'
  | 'representative'
  | 'stateCapital';

export const currentCivicsAnswers = {
  lastVerified: '2026-05-11',
  jurisdiction: {
    state: 'New Hampshire',
    city: 'Manchester',
    congressionalDistrict: 'NH-1',
  },
  federal: {
    president: ['Donald J. Trump', 'Donald Trump', 'Trump'],
    vicePresident: ['JD Vance', 'J.D. Vance', 'Vance'],
    speakerOfTheHouse: ['Mike Johnson', 'Michael Johnson', 'Johnson'],
    chiefJustice: ['John Roberts', 'John G. Roberts', 'John G. Roberts, Jr.', 'Roberts'],
    presidentPoliticalParty: ['Republican Party', 'Republican'],
  },
  state: {
    governor: ['Kelly Ayotte', 'Ayotte'],
    senators: ['Jeanne Shaheen', 'Maggie Hassan', 'Margaret Wood Hassan'],
    representatives: {
      'NH-1': ['Chris Pappas', 'Christopher Pappas'],
      'NH-2': ['Maggie Goodlander', 'Margaret Goodlander'],
    } as Record<string, string[]>,
    stateCapital: ['Concord'],
  },
  city: {
    mayor: ['Jay Ruais', 'Joseph Ruais'],
  },
} as const;

export function getDynamicAnswer(key: DynamicAnswerKey): string[] {
  switch (key) {
    case 'president':
      return [...currentCivicsAnswers.federal.president];
    case 'vicePresident':
      return [...currentCivicsAnswers.federal.vicePresident];
    case 'speakerOfTheHouse':
      return [...currentCivicsAnswers.federal.speakerOfTheHouse];
    case 'chiefJustice':
      return [...currentCivicsAnswers.federal.chiefJustice];
    case 'governor':
      return [...currentCivicsAnswers.state.governor];
    case 'stateSenators':
      return [...currentCivicsAnswers.state.senators];
    case 'representative': {
      const district = currentCivicsAnswers.jurisdiction.congressionalDistrict;
      return [...(currentCivicsAnswers.state.representatives[district] ?? [])];
    }
    case 'stateCapital':
      return [...currentCivicsAnswers.state.stateCapital];
  }
}
