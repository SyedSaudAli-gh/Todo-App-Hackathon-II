/**
 * Chat Page - Redirect to Dashboard
 *
 * This route has been deprecated. Chat is now available as an overlay
 * component on all authenticated pages via the floating chat button.
 *
 * Users navigating to /chat will be redirected to /dashboard/todos.
 */

import { redirect } from 'next/navigation';

export default function ChatPage() {
  // Redirect to dashboard - chat is now an overlay component
  redirect('/dashboard/todos');
}
