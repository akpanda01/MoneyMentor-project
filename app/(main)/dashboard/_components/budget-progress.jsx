"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export function BudgetProgress({ initialBudget, currentExpenses = 0 }) {
  const [isEditing, setIsEditing] = useState(false);

  // Keep as string for controlled numeric input; initialize defensively
  const initialAmount = (() => {
    if (!initialBudget) return "";
    // handle Prisma Decimal or number or string
    const amt =
      typeof initialBudget.amount === "object" &&
      typeof initialBudget.amount.toNumber === "function"
        ? initialBudget.amount.toNumber()
        : Number(initialBudget.amount);
    return Number.isFinite(amt) ? String(amt) : "";
  })();

  const [newBudget, setNewBudget] = useState(initialAmount);

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  // compute percentUsed defensively and clamp 0..100
  const budgetNumber =
    typeof initialBudget?.amount === "object" &&
    typeof initialBudget?.amount.toNumber === "function"
      ? initialBudget.amount.toNumber()
      : Number(initialBudget?.amount ?? 0);

  let rawPercent =
    budgetNumber > 0 ? (Number(currentExpenses || 0) / budgetNumber) * 100 : 0;
  // guard against NaN / Infinity
  if (!Number.isFinite(rawPercent) || Number.isNaN(rawPercent)) rawPercent = 0;
  const percentUsed = Math.max(0, Math.min(100, rawPercent));

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await updateBudgetFn(amount);
    } catch (err) {
      // useFetch likely surfaces error via `error` but keep try/catch for safety
      toast.error(err?.message || "Failed to update budget");
    }
  };

  const handleCancel = () => {
    setNewBudget(initialAmount);
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      // error might be string or Error
      toast.error(error?.message || String(error));
    }
  }, [error]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-sm font-medium">
            Monthly Budget (Default Account)
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-32"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={isLoading}
                  aria-label="Budget amount"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                  aria-label="Save budget"
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                  aria-label="Cancel edit"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription>
                  {initialBudget
                    ? `$${Number(currentExpenses || 0).toFixed(
                        2
                      )} of $${Number(budgetNumber).toFixed(2)} spent`
                    : "No budget set"}
                </CardDescription>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6"
                  aria-label="Edit budget"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {initialBudget ? (
          <div className="space-y-2">
            {/* Pass percentUsed value and use className to style the track/fill */}
            <Progress
              value={percentUsed}
              className={`h-2 rounded-full ${
                percentUsed >= 90
                  ? "bg-red-500"
                  : percentUsed >= 75
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            />
            <p className="text-xs text-muted-foreground text-right">
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No budget set</div>
        )}
      </CardContent>
    </Card>
  );
}
