export type PropertyListingType = 'buy' | 'rent'

export type Property = {
  id: string
  slug: string
  name: string
  ownerCompanyName?: string | null
  location: string
  price: number
  listing: PropertyListingType
  beds: number
  baths: number
  area: number
  style: string
  visual: string
  description: string
  features: string[]
  yearBuilt: number
  lotSize: string
  imageUrls: string[]
}

export const sampleProperties: Property[] = [

  {
    id: 'maple-house',
    slug: 'maple-house',
    name: 'Maple House',
    location: 'Northampton, Massachusetts',
    price: 645000,
    listing: 'buy',
    beds: 3,
    baths: 2,
    area: 1960,
    style: 'Light-filled rooms and a quiet tree-lined street',
    visual: 'from-[#c9b995] via-[#a58261] to-[#485948]',
    description: 'Light-filled rooms, a comfortable layout, and a quiet tree-lined setting make this sample home an inviting place to settle in. Personalize the details to make it feel like yours.',
    features: ['Tree-lined street', 'Bright living room', 'Updated kitchen', 'Flexible bonus room', 'Private backyard', 'Nearby local amenities'],
    yearBuilt: 2006,
    lotSize: '0.31 acres',
    imageUrls: [],
  },
  {
    id: 'garden-courtyard',
    slug: 'garden-courtyard',
    name: 'Garden Courtyard',
    location: 'Amherst, Massachusetts',
    price: 2850,
    listing: 'rent',
    beds: 2,
    baths: 2,
    area: 1240,
    style: 'A calm, easy-living home close to town',
    visual: 'from-[#d2c49f] via-[#87977d] to-[#526650]',
    description: 'A calm, easy-living rental concept with a practical floor plan, inviting outdoor space, and a convenient location close to town.',
    features: ['Private courtyard', 'In-unit laundry', 'Open living and dining area', 'Pet-friendly concept', 'Off-street parking', 'Close to local shops'],
    yearBuilt: 2015,
    lotSize: 'Part of a shared community',
    imageUrls: [],
  },
  {
    id: 'stonebridge',
    slug: 'stonebridge',
    name: 'Stonebridge Cottage',
    location: 'Easthampton, Massachusetts',
    price: 399000,
    listing: 'buy',
    beds: 3,
    baths: 2,
    area: 1740,
    style: 'Classic details with room for a home office',
    visual: 'from-[#a68b69] via-[#74806c] to-[#344b3d]',
    description: 'Classic character meets flexible everyday living in this sample cottage. A dedicated work space and comfortable common areas make it easy to imagine settling in.',
    features: ['Classic architectural details', 'Home office', 'Updated systems', 'Garden beds', 'Walkable neighborhood', 'Detached storage shed'],
    yearBuilt: 1948,
    lotSize: '0.28 acres',
    imageUrls: [],
  },
  {
    id: 'riverbend',
    slug: 'riverbend',
    name: 'Riverbend Residence',
    location: 'Hadley, Massachusetts',
    price: 3200,
    listing: 'rent',
    beds: 3,
    baths: 2,
    area: 1580,
    style: 'Open-plan living with a generous back deck',
    visual: 'from-[#d2b78f] via-[#87947a] to-[#485e4a]',
    description: 'An open-plan rental concept with room to gather, a generous deck for outdoor living, and a flexible third bedroom for guests or working from home.',
    features: ['Generous back deck', 'Open-plan kitchen', 'Flexible third bedroom', 'Washer and dryer', 'Landscaped shared grounds', 'Off-street parking'],
    yearBuilt: 2020,
    lotSize: 'Part of a residential community',
    imageUrls: [],
  },
  {
    id: 'elm-street',
    slug: 'elm-street',
    name: 'Elm Street Retreat',
    location: 'South Hadley, Massachusetts',
    price: 559000,
    listing: 'buy',
    beds: 4,
    baths: 3,
    area: 2210,
    style: 'A considered renovation in a classic neighborhood',
    visual: 'from-[#baa982] via-[#a27e61] to-[#435640]',
    description: 'A considered renovation in a classic neighborhood, combining comfortable gathering spaces with thoughtful updates and a flexible layout.',
    features: ['Renovated kitchen', 'Primary bedroom suite', 'Finished lower level', 'Energy-conscious updates', 'Mature landscaping', 'Two-car garage'],
    yearBuilt: 1992,
    lotSize: '0.56 acres',
    imageUrls: [],
  },
]

export function getPropertyBySlug(slug: string) {
  return sampleProperties.find((property) => property.slug === slug)
}
