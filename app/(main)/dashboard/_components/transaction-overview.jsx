"use client";

import { useState, useMemo, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = [
  "#1e40af", // blue-800
  "#2563eb", // blue-600
  "#60a5fa", // blue-400
  "#93c5fd", // blue-300
  "#0ea5e9", // sky-500
  "#6366f1",
  "#94a3b8",
];

const toNumber = (v) =>
  v != null && typeof v === "object" && typeof v.toNumber === "function"
    ? v.toNumber()
    : Number(v) || 0;

export default function DashboardOverview({ accounts = [], transactions = [] }) {
  // ensure arrays
  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const [selectedAccountId, setSelectedAccountId] = useState(
    safeAccounts.find((a) => a.isDefault)?.id ?? safeAccounts[0]?.id ?? ""
  );

  // if accounts change (async load), ensure selectedAccountId is valid
  useEffect(() => {
    if (!selectedAccountId && safeAccounts.length > 0) {
      setSelectedAccountId(safeAccounts.find((a) => a.isDefault)?.id ?? safeAccounts[0].id);
    }
    // if selectedAccountId no longer exists, reset to first
    if (selectedAccountId && !safeAccounts.find((a) => a.id === selectedAccountId)) {
      setSelectedAccountId(safeAccounts[0]?.id ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeAccounts]);

  // Filter transactions for selected account (defensive)
  const accountTransactions = useMemo(() => {
    if (!selectedAccountId) return [];
    return safeTransactions.filter((t) => String(t.accountId) === String(selectedAccountId));
  }, [safeTransactions, selectedAccountId]);

  // Get recent transactions (last 5) — handle invalid/missing dates
  const recentTransactions = useMemo(() => {
    return [...accountTransactions]
      .sort((a, b) => {
        const da = a.date ? new Date(a.date).getTime() : 0;
        const db = b.date ? new Date(b.date).getTime() : 0;
        return db - da;
      })
      .slice(0, 5);
  }, [accountTransactions]);

  // Calculate expense breakdown for current month
  const currentDate = new Date();
  const currentMonthExpenses = useMemo(() => {
    return accountTransactions.filter((t) => {
      try {
        const transactionDate = t.date ? new Date(t.date) : null;
        return (
          t.type === "EXPENSE" &&
          transactionDate &&
          transactionDate.getMonth() === currentDate.getMonth() &&
          transactionDate.getFullYear() === currentDate.getFullYear()
        );
      } catch {
        return false;
      }
    });
  }, [accountTransactions, currentDate]);

  // Group expenses by category (safely sum numbers)
  const expensesByCategory = useMemo(() => {
    return currentMonthExpenses.reduce((acc, transaction) => {
      const category = transaction.category ?? "Uncategorized";
      const amt = toNumber(transaction.amount);
      acc[category] = (acc[category] || 0) + amt;
      return acc;
    }, {});
  }, [currentMonthExpenses]);

  // Format data for pie chart
  const pieChartData = useMemo(
    () =>
      Object.entries(expensesByCategory).map(([category, amount]) => ({
        name: category,
        value: amount,
      })),
    [expensesByCategory]
  );

  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Recent Transactions Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-normal">Recent Transactions</CardTitle>

          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {safeAccounts.length === 0 ? (
                <SelectItem value="">No accounts</SelectItem>
              ) : (
                safeAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No recent transactions</p>
            ) : (
              recentTransactions.map((transaction) => {
                const amountVal = toNumber(transaction.amount);
                const dateStr = transaction.date ? format(new Date(transaction.date), "PP") : "—";

                return (
                  <div
                    key={transaction.id ?? JSON.stringify(transaction)}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {transaction.description || "Untitled Transaction"}
                      </p>
                      <p className="text-sm text-muted-foreground">{dateStr}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex items-center",
                          transaction.type === "EXPENSE" ? "text-red-500" : "text-green-500"
                        )}
                      >
                        {transaction.type === "EXPENSE" ? (
                          <ArrowDownRight className="mr-1 h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="mr-1 h-4 w-4" />
                        )}
                        {currencyFormatter.format(amountVal)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal">Monthly Expense Breakdown</CardTitle>
        </CardHeader>

        <CardContent className="p-0 pb-5">
          {pieChartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No expenses this month</p>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${currencyFormatter.format(value)}`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      typeof value === "number" ? currencyFormatter.format(value) : String(value)
                    }
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
