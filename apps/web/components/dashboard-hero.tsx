"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
  useToast,
} from "@jn76g7re6eaetkbr28pxzdp73x7sk4zg/components";

export function DashboardHero() {
  const { toast } = useToast();
  const summary = useQuery(api.endpoints.dashboard.summary);
  const recent = useQuery(api.endpoints.dashboard.recent);

  const loading = summary === undefined || recent === undefined;
  const rows = useMemo(() => recent ?? [], [recent]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Todo Dashboard</CardTitle>
            <p className="text-sm text-neutral-foreground-secondary mt-1">
              Manage your tasks with AI assistance
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Todos</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-9 w-24" />
                ) : (
                  <p className="text-3xl font-semibold">{summary.totalTodos}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Active</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <>
                    <p className="text-3xl font-semibold">{summary.activeTodos}</p>
                    <p className="text-sm text-neutral-foreground-secondary mt-1">
                      In progress
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-success text-success-foreground">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <p className="text-3xl font-semibold">{summary.completedTodos}</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-danger text-danger-foreground">
              <CardHeader>
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  <p className="text-3xl font-semibold">{summary.highPriorityTodos}</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Recent Todos</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Skeleton className="h-7 w-full" />
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-sm text-neutral-foreground-secondary py-8"
                    >
                      No todos yet. Create your first todo to get started!
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.slice(0, 10).map((todo) => (
                    <TableRow key={todo._id}>
                      <TableCell className="font-medium">{todo.title}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <Badge variant={todo.completed ? "success" : "outline"}>
                          {todo.completed ? "Completed" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-neutral-foreground-secondary">
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
