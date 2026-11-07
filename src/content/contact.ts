export const EMAIL = 'bomi2172@gmail.com'
export const MAILTO = 'mailto:bomi2172@gmail.com'
export const GITHUB_URL = 'https://github.com/Kbomi16'
export const RESUME_URL =
  'https://volcano-fisherman-e31.notion.site/31a3307fa7e6803cb79de92068674178'

export type ContactLink = {
  label: string
  href: string
  external: boolean
}

export const CONTACT_LINKS: ContactLink[] = [
  { label: EMAIL, href: MAILTO, external: false },
  { label: 'GitHub', href: GITHUB_URL, external: true },
  { label: 'Resume', href: RESUME_URL, external: true },
]
