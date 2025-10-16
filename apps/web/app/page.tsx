import dynamic from "next/dynamic";

const DashboardHero = dynamic(() => import("@/components/dashboard-hero").then(mod => mod.DashboardHero), { ssr: false });
const TodoList = dynamic(() => import("@/components/todo-list").then(mod => mod.TodoList), { ssr: false });

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <header className="mb-4">
        <h1 className="text-4xl font-bold text-neutral-foreground">Todo List</h1>
        <p className="text-neutral-foreground-secondary mt-2">
          Manage your tasks efficiently with AI assistance
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <TodoList />
        </div>
        <div>
          <DashboardHero />
        </div>
      </div>
    </main>
  );
}
