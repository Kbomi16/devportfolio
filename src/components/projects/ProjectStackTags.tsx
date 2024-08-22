import { getRandomGradient } from '../../utils/getRandomGradient'

type ProjectStackTagsProps = {
  stack: string
}

export default function ProjectStackTags({ stack }: ProjectStackTagsProps) {
  // '-' 문자로 문자열을 분리 + 공백 제거
  const items = stack
    .split('-')
    .map((item) => item.trim())
    .filter((item) => item)
  return (
    <div className="mt-10 flex flex-wrap gap-1">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex w-fit items-center justify-center rounded-full bg-primary px-2 text-xs text-white"
          style={{
            background: getRandomGradient(),
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )
}
