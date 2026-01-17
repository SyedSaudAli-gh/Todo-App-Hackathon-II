"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckSquare } from "lucide-react";
import Link from "next/link";

export function DashboardEmptyState() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Dashboard!</CardTitle>
          <CardDescription>
            Get started by creating your first task
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-6 mb-6">
              <CheckSquare className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Start organizing your work by creating your first task. You can assign priorities,
              track status, and filter tasks to stay productive.
            </p>
            <Link href="/dashboard/todos">
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Task
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Set Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Assign High, Medium, or Low priority to each task to focus on what matters most.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Track Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Update task status from To Do → In Progress → Done to track your workflow.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filter & Organize</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use filters to view specific tasks by priority, status, or search for keywords.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
