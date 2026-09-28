/** 외부 이동 시 포트폴리오 도메인을 Referer·링크 신호로 남기지 않음 */
export const outboundLinkProps = (
  url: string,
): { rel: 'nofollow noreferrer'; referrerPolicy: 'no-referrer' } | Record<string, never> => {
  if (!/^https?:/i.test(url)) return {}

  return { rel: 'nofollow noreferrer', referrerPolicy: 'no-referrer' }
}
