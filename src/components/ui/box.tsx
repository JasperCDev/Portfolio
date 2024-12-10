export function Box(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={
        props.className +
        " rounded-l border bg-card text-card-foreground shadow p-2"
      }
    >
      {props.children}
    </div>
  );
}
