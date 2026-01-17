"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityEvent } from "@/types/storage";
import { CheckSquare, Plus, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityFeedProps {
  events: ActivityEvent[];
  isLoading?: boolean;
  onEventClick?: (event: ActivityEvent) => void;
  maxEvents?: number;
}

export function ActivityFeed({
  events,
  isLoading = false,
  onEventClick,
  maxEvents = 5,
}: ActivityFeedProps) {
  const displayEvents = events.slice(0, maxEvents);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getEventIcon = (eventType: ActivityEvent['eventType']) => {
    switch (eventType) {
      case 'created':
        return <Plus className="h-4 w-4" />;
      case 'completed':
        return <CheckSquare className="h-4 w-4" />;
      case 'updated':
        return <Edit className="h-4 w-4" />;
      case 'deleted':
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Edit className="h-4 w-4" />;
    }
  };

  const getEventColor = (eventType: ActivityEvent['eventType']) => {
    switch (eventType) {
      case 'created':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'updated':
        return 'text-yellow-500';
      case 'deleted':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  if (displayEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest task actions will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <CheckSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No activity yet. Start by creating your first task!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest task actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayEvents.map((event) => (
            <div
              key={event.id}
              className={`flex items-start gap-3 ${
                onEventClick ? 'cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors' : ''
              }`}
              onClick={() => onEventClick?.(event)}
            >
              <div className={`rounded-full bg-muted p-2 ${getEventColor(event.eventType)}`}>
                {getEventIcon(event.eventType)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{event.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
