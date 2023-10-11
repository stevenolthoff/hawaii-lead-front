export function getSchoolIdFromSlug (slug: string) {
  return slug.trim().toUpperCase()
}

export function getSlugFromSchoolId (id: string) {
  return id.trim().toLowerCase()
}
