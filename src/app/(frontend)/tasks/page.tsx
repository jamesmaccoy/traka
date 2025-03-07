import { getPayload, Where } from 'payload'
import config from '@payload-config'
import React from 'react'
import { Post, User } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'
import PageClient from './page.client'
import TasksCard from '../../../components/Tasks/TasksCard'
import { redirect } from 'next/navigation'

export default async function Tasks() {
  const currentUser = await getMeUser()

  if (!currentUser) {
    redirect('/login')
  }

  const [upcomingTasks, pastTasks] = await Promise.all([
    getTasks('upcoming', currentUser.user),
    getTasks('past', currentUser.user),
  ])

  const formattedUpcomingTasks = upcomingTasks.docs.map((task) => ({
    ...(task.post as Pick<Post, 'meta' | 'slug' | 'title'>),
    fromDate: task.fromDate,
    toDate: task.toDate,
    member: task.member,
    id: task.id,
  }))

  const formattedPastTasks = pastTasks.docs.map((task) => ({
    ...(task.post as Pick<Post, 'meta' | 'slug' | 'title'>),
    fromDate: task.fromDate,
    toDate: task.toDate,
    member: task.member,
    id: task.id,
  }))

  console.log(upcomingTasks, pastTasks)

  return (
    <>
      <PageClient />
      <div className="my-10 container space-y-10">
        <div>
          {upcomingTasks.docs.length > 0 && (
            <h2 className="text-4xl font-medium tracking-tighter my-6">Active</h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {formattedUpcomingTasks.map((task) => (
              <TasksCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {pastTasks.docs.length > 0 && (
          <h2 className="text-4xl font-medium tracking-tighter my-6">Past</h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {formattedPastTasks.map((task) => (
            <TasksCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </>
  )
}

const getTasks = async (type: 'upcoming' | 'past', currentUser: User) => {
  const payload = await getPayload({ config })

  let whereQuery: Where

  if (type === 'upcoming') {
    whereQuery = {
      and: [
        {
          fromDate: {
            greater_than_equal: new Date(),
          },
        },
        {
          shareholder: {
            equals: currentUser.id,
          },
        },
      ],
    }
  } else {
    whereQuery = {
      and: [
        {
          fromDate: {
            less_than: new Date(),
          },
        },
        {
          shareholder: {
            equals: currentUser.id,
          },
        },
      ],
    }
  }

  const Tasks = await payload.find({
    collection: 'tasks',
    limit: 100,
    where: whereQuery,
    depth: 2,
    sort: '-fromDate',
    select: {
      slug: true,
      post: true,
      member: true,
      fromDate: true,
      toDate: true,
    },
  })

  return Tasks
}
