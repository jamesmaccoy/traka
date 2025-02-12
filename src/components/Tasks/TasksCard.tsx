import { type Media as MediaType, User } from '@/payload-types'
import { formatDate } from 'date-fns'
import { CalendarIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import React, { FC } from 'react'
import { Media } from '../Media'

type Props = {
  task: {
    fromDate: string
    toDate: string
    member: (string | User)[] | null | undefined
    id: string
    slug?: string | null | undefined
    title: string
    meta?:
      | {
          title?: string | null | undefined
          image?: string | MediaType | null | undefined
          description?: string | null | undefined
        }
      | undefined
  }
}

const TasksCard: FC<Props> = ({ task }) => {
  return (
    <Link key={task.id} href={`/admin/collections/tasks/${task.id}`}>
      <div className="flex flex-col gap-4 border border-border bg-card h-full">
        <div className="relative w-full">
          {!task.meta?.image && <div>No Image</div>}
          {task.meta?.image && typeof task.meta?.image !== 'string' && (
            <Media resource={task.meta.image} size="33vw" />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-2xl font-medium">{task.title}</h3>
          <p className="my-2">{task.meta?.description}</p>
          <div
            className="flex items-center gap-2 font-medium
        "
          >
            <div>
              <CalendarIcon className="size-4" />
            </div>
            <div className="text-sm font-medium">
              {formatDate(new Date(task.fromDate), 'PPP')} -{' '}
              {formatDate(new Date(task.toDate), 'PPP')}
            </div>
          </div>
          {task.member && task.member?.length > 0 && (
            <div className="flex items-center gap-2">
              <div>
                <UsersIcon className="size-4" />
              </div>
              <div className="font-medium text-sm">{task.member?.length} Member</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default TasksCard
