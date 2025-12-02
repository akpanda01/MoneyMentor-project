"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
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

/**
 * BudgetProgress - corrected and hardened
 *
 * Fixes and improvements:
 * - removed duplicate/unused imports
 * - synced `newBudget` when `initialBudget` changes
 * - defensive parsing for Decimal/number/string budget shapes
 * - safe percent computation and clamping
 * - accessible labels and tooltips for buttons
 * - shows loading spinner when saving
 */

export function BudgetProgress({ initialBudget, currentExpenses = 0 }) {
  const [isEditing, setIsEditing] = useState(false);

  // Defensive extraction of numeric initial amount (handles Prisma Decimal objects)
  const getInitialAmountString = (budget) => {
    if (!budget) return "";
    const amt =
      typeof budget.amount === "object" &&
      typeof budget.amount.toNumber === "function"
        ? budget.amount.toNumber()
        : Number(budget.amount);
    return Number.isFinite(amt) ? String(amt) : "";
  };

  const [newBudget, setNewBudget] = useState(getInitialAmountString(initialBudget));

  // Keep controlled input in sync when initialBudget prop updates
  useEffect(() => {
    setNewBudget(getInitialAmountString(initialBudget));
  }, [initialBudget]);

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  // Numeric budget used for percent calculations
  const budgetNumber =
    typeof initialBudget?.amount === "object" &&
    typeof initialBudget?.amount.toNumber === "function"
      ? initialBudget.amount.toNumber()
      : Number(initialBudget?.amount ?? 0);

  // safe percent calculation clamped to [0, 100]
  let rawPercent =
    budgetNumber > 0 ? (Number(currentExpenses || 0) / budgetNumber) * 100 : 0;
  if (!Number.isFinite(rawPercent) || Number.isNaN(rawPercent)) rawPercent = 0;
  const percentUsed = Math.max(0, Math.min(100, rawPercent));

  // Currency formatting with fallback
  const formatCurrency = (val) => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(Number(val || 0));
    } catch {
      return `₹${Number(val || 0).toFixed(2)}`;
    }
  };

  const progressColorClass =
    percentUsed >= 90 ? "bg-red-500" : percentUsed >= 75 ? "bg-amber-500" : "bg-emerald-500";

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await updateBudgetFn(amount);
      // optimistic UX: keep editing off if update succeeded via hook response
      // updatedBudget useEffect below will also show toast and close edit mode
    } catch (err) {
      toast.error(err?.message || "Failed to update budget");
    }
  };

  const handleCancel = () => {
    setNewBudget(getInitialAmountString(initialBudget));
    setIsEditing(false);
  };

  // react to hook response
  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  // show errors surfaced by the hook
  useEffect(() => {
    if (error) {
      toast.error(error?.message || String(error));
    }
  }, [error]);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-sm font-semibold">
            Monthly Budget (Default Account)
          </CardTitle>

          <div className="flex items-center gap-3 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-36 font-medium text-sm"
                  placeholder="Amount"
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
                  title="Save"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                  aria-label="Cancel edit"
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription className="text-sm">
                  {initialBudget
                    ? `${formatCurrency(currentExpenses)} of ${formatCurrency(budgetNumber)} spent`
                    : "No budget set"}
                </CardDescription>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-7 w-7 ml-1"
                  aria-label="Edit budget"
                  title="Edit budget"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {initialBudget ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2" aria-hidden={false}>
              <div className="text-xs text-muted-foreground truncate">
                {percentUsed < 100
                  ? `You have ${formatCurrency(Math.max(0, budgetNumber - currentExpenses))} remaining`
                  : "You've reached or exceeded your budget"}
              </div>
              <div className="text-xs font-medium tabular-nums">{percentUsed.toFixed(1)}%</div>
            </div>

            <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
              <Progress
                value={percentUsed}
                className={`h-3 rounded-full ${progressColorClass}`}
                aria-label={`Budget usage ${percentUsed.toFixed(1)} percent`}
              />
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No budget set</div>
        )}
      </CardContent>
    </Card>
  );
}
