/** Re-mounts on every navigation, so each page enters with the route transition. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-in">{children}</div>;
}
