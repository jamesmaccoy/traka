import { CollectionBeforeValidateHook } from 'payload'

// This hook will add the customer ID to the form if the user is logged in.
// FormIds are the id of forms for which this hook should run.
export const addMemberToForm =
  (formIds: string[]): CollectionBeforeValidateHook =>
  ({ data, req: { user, payload } }) => {
    if (data && typeof data === 'object' && 'form' in data && formIds.includes(data.form) && user) {
      payload.logger.info(
        `User is logged in, adding member to form. FormID: ${data.form}, MemberID: ${user?.id}, SubmissionID: ${data?.id}`,
      )
      data.member = user?.id
    }

    console.log(data)
    return data
  }
