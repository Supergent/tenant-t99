"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Checkbox,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "@jn76g7re6eaetkbr28pxzdp73x7sk4zg/components";
import { Plus, Trash2 } from "lucide-react";

export function TodoList() {
  const { toast } = useToast();
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<"low" | "medium" | "high">("medium");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const allTodos = useQuery(api.endpoints.todos.list, {});
  const activeTodos = useQuery(api.endpoints.todos.list, { completed: false });
  const completedTodos = useQuery(api.endpoints.todos.list, { completed: true });

  const createTodo = useMutation(api.endpoints.todos.create);
  const toggleComplete = useMutation(api.endpoints.todos.toggleComplete);
  const deleteTodo = useMutation(api.endpoints.todos.remove);

  const displayedTodos =
    filter === "active"
      ? activeTodos
      : filter === "completed"
      ? completedTodos
      : allTodos;

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      await createTodo({
        title: newTodoTitle,
        priority: newTodoPriority,
      });
      setNewTodoTitle("");
      setNewTodoPriority("medium");
      toast({
        title: "Todo created",
        description: "Your todo has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create todo",
        variant: "destructive",
      });
    }
  };

  const handleToggleComplete = async (id: Id<"todos">, completed: boolean) => {
    try {
      await toggleComplete({ id, completed: !completed });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTodo = async (id: Id<"todos">) => {
    try {
      await deleteTodo({ id });
      toast({
        title: "Todo deleted",
        description: "Your todo has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Todos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create Todo Form */}
        <form onSubmit={handleCreateTodo} className="flex gap-2">
          <Input
            placeholder="Add a new todo..."
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="flex-1"
          />
          <Select value={newTodoPriority} onValueChange={(v: any) => setNewTodoPriority(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          {displayedTodos === undefined ? (
            <p className="text-sm text-neutral-foreground-secondary text-center py-8">
              Loading...
            </p>
          ) : displayedTodos.length === 0 ? (
            <p className="text-sm text-neutral-foreground-secondary text-center py-8">
              {filter === "all"
                ? "No todos yet. Create one to get started!"
                : filter === "active"
                ? "No active todos."
                : "No completed todos."}
            </p>
          ) : (
            displayedTodos.map((todo) => (
              <div
                key={todo._id}
                className="flex items-center gap-3 p-3 rounded-md border bg-surface hover:bg-muted transition-colors"
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleComplete(todo._id, todo.completed)}
                />
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      todo.completed ? "line-through text-neutral-foreground-secondary" : ""
                    }`}
                  >
                    {todo.title}
                  </p>
                  {todo.description && (
                    <p className="text-sm text-neutral-foreground-secondary">
                      {todo.description}
                    </p>
                  )}
                </div>
                <Badge
                  variant={
                    todo.priority === "high"
                      ? "destructive"
                      : todo.priority === "medium"
                      ? "default"
                      : "secondary"
                  }
                >
                  {todo.priority}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTodo(todo._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
