import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

export default function SSOCallback() {
  // Handle the redirect flow by rendering the
  // pre-built AuthenticateWithRedirectCallback component.
  // This is the final step in the custom OAuth flow.
  return <AuthenticateWithRedirectCallback />
}
