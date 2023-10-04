function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    function(txt: string) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    }
  )
}


export function getSchoolIdFromSlug (slug: string) {
  return toTitleCase(slug.trim().replaceAll('-', ' '))
}

export function getSlugFromSchoolId (id: string) {
  return id.trim().toLowerCase().replaceAll(' ', '-')
}
